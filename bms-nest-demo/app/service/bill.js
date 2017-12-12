'use strict';
const Const = require('../common/const');
const Cust = require('../common/cust');
const Util = require('../common/util');
const Moment = require('moment');
const { SpruceError, ErrorStatus } = require('../common/spruce_error');
module.exports = app => {
  class BillService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.ctx.getModel('account_bill');
    }

    * list(params) {
      const query = { delete: { $ne: 1 } };// 未删除
      if (!params.choice) {
        params.choice = {};
      }

      for (const key in params.choice) {
        if (key === 'shop' || key === 'user') { break; }
        query[key] = params.choice[key];
      }

      if (params.choice.shop) {
        query['shop.id'] = params.choice.shop.id;
      }
      if (params.choice.user) {
        query['user.id'] = params.choice.user.id;
      }

      if (params.choice.status === 0 || params.choice.status) {
        query.status = params.choice.status;
      }

      if (params.qkey) { // 关键词匹配
        query.$or = [{ 'user.name': { $regex: params.qkey, $options: 'i' } }, { 'cust_service.customer.name': { $regex: params.qkey, $options: 'i' } }, { 'cust_service.creator.name': { $regex: params.qkey, $options: 'i' } }];
      }
      const opt = { lean: true, limit: 0, skip: 0 };
      const { page, size } = params;
      if (size) {
        opt.limit = parseInt(size);
      }
      if (page) {
        opt.skip = size * (page - 1);
      }


      // 默认以登记时间倒叙排序
      if (!params.sort) {
        opt.sort = { create_time: -1 };
      } else {
        opt.sort = params.sort;
      }


      const [ list, total ] = yield this.app.myutil.parallel([
        this.model.find(query, null, opt),
        this.model.count(query),
      ]);

      // 获取互动相关信息
      for (const one of list) {
        yield this._formateBill(one);
      }

      return { list, total };
    }


    /**
     * 取消订单
     * 返回取消结果 false：取消失败，true：取消成功
     * @author Tim
     * @param {any} bill 账单信息
     * @return {object} 取消结果 false：取消失败，true：取消成功
     * @memberof BillService
     */
    * cancel(bill) {
      const { _id, user } = bill;
      const tmpData = yield this.detail(_id);
      // 判断当前账单是否已开始支付
      if (tmpData.status === Const.reward.payStatus.process) {
        return false;
      }
      const operate = {
        user,
        action: Const.reward.action.cancel,
        content: '取消账单',
        time: Util.now(),
      };
      const result = yield this._operateList(_id, operate);
      // 取消支付
      const data = yield this.model.update({ _id }, { $set: { status: Const.reward.payStatus.cancel } });
      return true;
    }

    /**
     * 平台支付操作
     *
     * @author Tim
     * @param {any} _ids 账单id数组
     * @param {any} user 操作人
     * @memberof BillService
     */
    * platPay(_ids, user) {
      const operate = {
        user,
        action: Const.reward.action.platPay,
        content: '平台支付',
        time: Util.now(),
      };
      const plat_pay = {
        status: Const.reward.payStatus.yes,
        time: Util.now(),
        user,
      };
      const data = yield this.model.update({ _id: { $in: _ids } },
        {
          $set:
          {
            status: Const.reward.payStatus.yes,
            plat_pay,
          },
          $push: { operate_list: operate },
        });
    }

    /**
     * 4s店支付操作
     *
     * @author Tim
     * @param {any} _ids 账单id数组
     * @param {any} user 操作人
     * @memberof BillService
     */
    * shopPay(_ids, user) {
      const operate = {
        user,
        action: Const.reward.action.shopPay,
        content: '4s店支付',
        time: Util.now(),
      };
      const shop_pay = {
        status: Const.reward.payStatus.yes,
        time: Util.now(),
        user,
      };
      const data = yield this.model.update({ _id: { $in: _ids } },
        {
          $set:
          {
            status: Const.reward.payStatus.process, // 支付中状态
            shop_pay,
          },
          $push: { operate_list: operate },
        });
    }

    * detail(_id) {
      const data = yield this.model.findOne({ _id }, null, { lean: true });
      return data;
    }

    * billDetail(_id) {
      const data = yield this.detail(_id);
      return yield this._getBillCustInteract(data);
    }

    * delete(_id) {
      const data = yield this.model.update({ _id }, { delete: Const.delete.yes });
      return data;
    }

    /**
     *
     * 账单服务
     * 1. 解析客户服务信息
     * 2. 创建账单
     * 3. 响应客户服务
     * 4. 如果账单创建成果就更新提成奖励
     *
     * @author Tim
     * @param {any} custService 客户服务对象信息
     * @memberof BillService
     */
    * notifyCreateBill(custService) {
      const ackMsg = {
        id: custService._id,
        status: Const.status.success,
      };

      let bill = null;

      const logger = this.ctx.logger;

      logger.info('[BillSevice notifyCreateBill！');
      try {
        bill = yield this._billParse(custService);
        bill = yield this._create(bill);
      } catch (err) {
        logger.error('[BillSevice notifyCreateBill error]', err);
        ackMsg.status = Const.status.error;
        ackMsg.message = err.toString();
      } finally {
        // 响应状态
        const ackCustService = {
          status: Const.status.success,
          time: Util.now(),
        };
        try {
          // 响应服务
          yield app.mqPublisher.bill.createBillAck(ackMsg);
        } catch (err) {
          logger.error('[BillSevice notifyCreateBill createBillAck error!]', err);
          ackCustService.status = Const.status.error;
          ackCustService.message = err.toString();
        }
        // 更新响应状态
        yield this.model.update({ _id: bill._id }, { $set: { 'cust_service.ack': ackCustService } });
      }
      // 最后如果账单创建成功就更新提成奖励，同时更新账户
      try {
        if (ackMsg.status === Const.status.success) {
          bill = yield this.detail(bill._id); // 用于追加计算后的提成和收益字段
          logger.info(`[BillSevice notifyCreateBill _updateReward :${JSON.stringify(bill)}`);
          yield this._updateReward(bill);
        }
      } catch (err) {
        logger.error('[BillSevice notifyCreateBill _updateReward error！]', err);
      }
    }

    * notifyCancelBill(custService) {
      const ackMsg = {
        _id: custService._id,
        status: Const.status.success,
      };
      let bill = null;
      this.ctx.logger.info('[BillSevice notifyCancelBill！');
      try {
        const query = { 'cust_service.id': custService._id };
        bill = yield this.model.findOne(query, null, { lean: true });
      } catch (err) {
        this.ctx.logger.error('[BillSevice notifyCancelBill error]', err);
        ackMsg.status = Const.status.error;
        ackMsg.message = err.toString();
      } finally {
        // 响应状态
        const ackCustService = {
          status: Const.status.success,
          time: Util.now(),
        };
        try {
          // 响应服务
          yield app.mqPublisher.bill.cancelBillAck(ackMsg);
        } catch (err) {
          this.ctx.logger.error('[BillSevice notifyCancelBill error!]', err);
          ackCustService.status = Const.status.error;
          ackCustService.message = err.toString();
        }
        // 更新响应状态
        yield this.model.update({ _id: bill._id }, { $set: { 'cust_service.ack': ackCustService } });
      }

      try {
        if (ackMsg.status === Const.status.success) {
          // 账单作废，同时更新账户金额
          yield this._revokeBill(bill);
        }
      } catch (err) {
        this.ctx.logger.error('[BillSevice notifyCancelBill error！]', err);
      }
    }

    /**
     * 创建账单基本信息
     *
     * @author Tim
     * @param {any} bill 账单基本信息
     * @return {bill} 返回新增的账单信息
     * @memberof BillService
     */
    * _create(bill) {
      const logger = this.ctx.logger;
      logger.info(`[BillSevice 开始创建bill！bill:${bill}]`);
      bill.creator = {
        id: bill.cust_service.creator.id,
        name: bill.cust_service.creator.name,
        from: bill.cust_service.creator.from,
      };
      bill.create_time = Util.now();
      // 初始化支付状态
      bill.plat_pay = {
        status: Const.reward.payStatus.no,
      };
      bill.shop_pay = {
        status: Const.reward.payStatus.no,
      };
      bill.status = Const.reward.payStatus.no;
      const operate_list = [];
      operate_list.push({
        user: bill.creator,
        action: Const.reward.action.new,
        content: '创建账单',
        time: bill.create_time,
      });
      bill.operate_list = operate_list;
      const data = yield this.model.create(bill);
      logger.info(`[BillSevice 创建bill成功！id:${data._id}]`);
      return data;
    }

    /**
     * 更新账单提成信息
     *
     * @author Tim
     * @param {any} bill 账单信息
     * @memberof BillService
     */
    * _updateReward(bill) {
      const saleTime = bill.cust_service.sale_time;
      const shopId = bill.shop.id;
      // 获取4s店奖励规则
      let rule;
      if (app.reawardRule) {
        rule = app.reawardRule.get(shopId); // 返回结果为对象
      }

      if (!rule || rule.begin_time > saleTime) {
        // 返回结果为数组
        rule = yield this.ctx.getService('rewardRule').getRuleByDateAndShopId(new Date(saleTime), shopId);
        rule = rule[0];
      }

      const logger = this.ctx.logger;

      if (!rule) {
        bill.reward = [];
        bill.income = 0;
        logger.error('[BillSevice _updateReward  error: 未找到匹配规则！');
        // throw new SpruceError(ErrorStatus.matchRule);
      }

      if (rule) { // 计算奖励
        logger.info(`[BillSevice _updateReward  规则匹配成功:${rule}`);
        bill = yield this._computeReward(bill, rule);
      }


      yield this.model.update({ _id: bill._id }, { $set: { reward: bill.reward, income: bill.income } });
      logger.info(`[BillService] updateReward success!  id:${bill._id} user:${bill.user.name}`);

      // 更新账户金额
      yield this._updateAccountIncome(bill);
    }

    /**
     * 计算账单提成，返回提成计算完成后的bill信息
     * @author Tim
     * @param {any} bill 账单信息 必填
     * @param {any} rewardRule 提成规则  必填
     * @return {bill} 返回提成计算完成后的bill信息
     * @memberof BillService
     */
    * _computeReward(bill, rewardRule) {
      const logger = this.ctx.logger;
      logger.info('[BillSevice _computeReward  计算账单提成');
      if (bill.shop.id !== rewardRule.shop.id) {
        bill.income = 0;
        bill.reward = [];
        logger.error('[BillSevice _computeReward  error! 4s店规则不匹配');
        // throw new SpruceError(ErrorStatus.matchRule);
        return bill;
      }
      // 客户服务信息
      const cust_service = bill.cust_service;
      bill.income = 0;
      let income = 0;
      const base_num = Math.pow(10, 6);

      // 遍历订单明细
      const rewardArray = cust_service.list.map(function(element) {
        const reward = { category: element.category };
        // 匹配规则
        const flag = rewardRule.rule.some(function(rule) {
          if (rule.category === element.category) { // 找到匹配规则
            if (rule.mode === Const.reward.ruleMode.percent) { // 按比例
              reward.price = element.price;
              reward.income = element.price * rule.percent / 100;
              reward.rule = {
                id: rule._id,
                percent: rule.percent,
              };
            } else { // 按固定金额
              let price = element.price;
              // 国产车和进口车
              if (element.category === Const.custService.category.newCarSaleDomestic || element.category === Const.custService.category.newCarSaleImport) {
                // 售价
                if (rule.immobile.income_from === Const.reward.income_from.sale_price) {
                  price = element.price;
                }
                // 指导价
                if (rule.immobile.income_from === Const.reward.income_from.guide_price) {
                  price = element.guide_price;
                }
              }

              let ruleExists = false;

              rule.immobile.section.forEach(section => {
                // 匹配到规则
                if (section.floor <= price && section.upper > price) {
                  reward.price = price;
                  reward.income = section.value;
                  reward.rule = {
                    id: rule._id,
                    immobile: {
                      income_from: rule.immobile.income_from,
                      section,
                    },
                  };
                  ruleExists = true;
                }

                // 若已匹配到规则，不再查找
                if (ruleExists === true) {
                  return;
                }
                reward.price = price;
                reward.income = 0;
                reward.rule = {
                  id: rule._id,
                  income_from: rule.immobile.income_from,
                  section: null,
                };
                logger.error(`[BillSevice _computeReward  计算账单提成，价格：${price}，规则区间${section.floor}-${section.upper}不匹配，规则ID: ${rule._id}`);
              });

              // 未找到抛出异常
              // if (!ruleExist) throw new SpruceError(ErrorStatus.matchRule);
            }
            return true;
          }
          return false;
        });

        // 未找到抛出异常
        if (!flag) throw new SpruceError(ErrorStatus.matchRule);
        income += reward.income * base_num;
        bill.income = income / base_num;
        return reward;
      });
      bill.reward = rewardArray;
      logger.info('[BillSevice _computeReward  success!');
      return bill;
    }

    /**
     * 解析客户服务为单据对象
     *
     * @author Tim
     * @param {any} custService 客户服务信息
     * @return {bill} bill 单据信息
     * @memberof BillService
     */
    * _billParse(custService) {
      const logger = this.ctx.logger;
      logger.info(`[BillSevice billParse 开始解析客户服务信息！custService.id:${custService._id}]`);
      try {
        const category_name = yield this._getCustInteractCategoryName(custService.type);
        // console.log('互动类型：' + category_name);
        // console.log('------------------------------------');
        const bill = {
          user: {
            id: custService.cust_belong.id,
            name: custService.cust_belong.name,
            from: custService.cust_belong.from,
          },
          shop: {
            id: custService.shop._id,
            name: custService.shop.name,
          },
          cust_service: {
            id: custService._id,
            customer: {
              id: custService.cust_id,
              name: custService.cust_name,
            },
            sale_time: Moment(custService.interact_time).format('YYYY-MM-DD HH:mm:ss'),
            create_time: Moment(custService.create_time).format('YYYY-MM-DD HH:mm:ss'),
            creator: {
              id: custService.belong.id,
              name: custService.belong.name,
              from: custService.belong.from,
            },
            list: [],
          },
        };

        // 新车销售，区分进口车和国产车
        if (category_name === 'new_car_sell') {
          bill.cust_service.list.push({
            category: custService[category_name].import ? Const.custService.category.newCarSaleImport : Const.custService.category.newCarSaleDomestic,
            price: custService[category_name].car_price, // 售价
            guide_price: custService[category_name].car_guide_price, // 指导价
          });
        }

        // 二手车销售，按售价提成
        if (category_name === 'old_car_sell') {
          bill.cust_service.list.push({
            category: Const.custService.category.oldCarSale,
            price: custService[category_name].car_price,
          });
        }

        // 二手车收购，按收购价提成
        if (category_name === 'old_car_purchase') {
          bill.cust_service.list.push({
            category: Const.custService.category.oldCarBuy,
            price: custService[category_name].purchase_price, // 收购价
          });

        }

        // 二手车置换
        if (category_name === 'old_car_exchange') {
          bill.cust_service.list = [
            // [销售新车]，分为国产车和进口车
            {
              category: custService[category_name].import ? Const.custService.category.newCarSaleImport : Const.custService.category.newCarSaleDomestic,
              price: custService[category_name].car_price,
              guide_price: custService[category_name].car_guide_price,
            },
            // [置换] 二手车收购，提成按收购价计算
            {
              category: Const.custService.category.oldCarBuy, // 二手车收购
              price: custService[category_name].old.purchase_price, // 收购价
            },
          ];
        }

        // 维修保养
        if (category_name === 'repair_maintain') {
          // 维修，按维修价提成
          if (custService[category_name].repair) {
            bill.cust_service.list.push({
              category: Const.custService.category.repair,
              price: custService[category_name].repair.repair_money, // 维修价格
            });
          }

          // 保养，按保养价提成
          if (custService[category_name].maintain) {
            bill.cust_service.list.push({
              category: Const.custService.category.maintain, // 保养
              price: custService[category_name].maintain.maintain_money, // 保养费
            });
          }
        }

        // 事故车，按维修价提成
        if (category_name === 'accident_car_repair') {
          bill.cust_service.list.push({
            category: Const.custService.category.accident,
            price: custService[category_name].repair_money, // 维修价
          });
        }

        // console.log('解析后bill信息: ' + JSON.stringify(bill));
        // console.log('------------------------------------');
        logger.info(`[BillService] billParse success!  bill:${bill}`);
        return bill;
      } catch (err) {
        logger.error('[BillService] _billParse error!');
        console.log(err);
        throw new SpruceError(ErrorStatus.billParse);
      }
    }

    * _operateList(_id, operate) {
      const data = yield this.model.update({ _id }, { $push: { operate_list: operate } });
      return data;
    }

    * _updateAccountIncome(bill) {
      let shop_income = bill.income;
      let bee_income = bill.income;

      try {
        const bill_status = bill.status; // 账单状态

        // 账单作废
        if (bill_status === Const.reward.payStatus.cancel) {
          const bee_params = { _id: bill.user.id };
          const bee_req = new app.proxy.plat.BeeDetail(bee_params);
          const bee_result = yield bee_req.curl();
          if (bee_result.status !== Const.status.success) {
            this.ctx.logger.error('!!!get bee error :', JSON.stringify(bee_result));
            return null;
          }

          const shop_params = { _id: bill.shop.id };
          const shop_req = new app.proxy.shop.ShopDetail(shop_params);
          const shop_result = yield shop_req.curl();
          if (shop_result.status !== Const.status.success) {
            this.ctx.logger.error('!!!get shop error :', JSON.stringify(shop_result));
            return null;
          }

          shop_income = (shop_result.data.total_income ? shop_result.data.total_income : 0) - bill.income;
          bee_income = (bee_result.data.total_income ? bee_result.data.total_income : 0) - bill.income;

          this.ctx.logger.info(`shop原金额:${shop_result.data.total_income}，现金额:${shop_income}`);
          this.ctx.logger.info(`bee原金额:${bee_result.data.total_income}，现金额:${bee_income}`);
        }

        const shop_income_params = { _id: bill.shop.id, total_income: shop_income };
        const bee_income_params = { _id: bill.user.id, total_income: bee_income };
        const shop_income_req = new app.proxy.shop.ShopIncome(shop_income_params);
        const bee_income_req = new app.proxy.bee.BeeIncome(bee_income_params);

        const shop_income_result = yield shop_income_req.curl();
        if (shop_income_result.status !== Const.status.success) {
          this.ctx.logger.error('!!!update shop income error :', JSON.stringify(shop_income_result));
          return null;
        }

        const bee_income_result = yield bee_income_req.curl();
        if (bee_income_result.status !== Const.status.success) {
          this.ctx.logger.error('!!!update bee income error :', JSON.stringify(bee_income_result));
          return null;
        }

        this.ctx.logger.info('[BillService] updateAccountIncome success!');

      } catch (exception) {
        this.ctx.logger.error(`[BillSevice _revokeBill error:${exception}`);
        return null;
      }
    }

    * _getCustInteract(id) {
      const cust_interact = yield this.ctx.getService('custInteract').detailInteract({ _id: id });
      return cust_interact;
    }

    * _getBillCustInteract(data) {
      const info = { base: {}, bill: {}, reward: {} };
      const cust_interact = yield this._getCustInteract(data.cust_service.id);
      if (!cust_interact) {
        app.logger.error('!!!get cust_interact info error :');
      }
      const category_name = yield this._getCustInteractCategoryName(cust_interact.type);

      info._id = data._id;
      info.type = cust_interact.type; // 类型
      info.type_name = cust_interact.type_name;
      info.income = data.income; // 总收益

      info.base.customer = data.cust_service.customer; // 客户信息
      info.base.bee_user = data.user; // bee用户
      info.base.create_time = data.cust_service.create_time; // 登记时间
      info.base.interact_time = data.cust_service.sale_time; // 交易时间
      info.base.creator = data.cust_service.creator; // 登记人

      info.bill = cust_interact[category_name]; // 交易信息

      const rule_category = Const.custService.category;
      let flag = false;

      data.reward.forEach(one => {
        if (one.income >= 0 && one.rule.percent >= 0) {
          flag = true;
        }

        if (one.income >= 0 && one.rule.immobile && one.rule.immobile.section) {
          flag = true;
        }

        for (const [ k, v ] of Object.entries(rule_category)) {
          if (one.category === v && flag) {
            info.reward[k] = one;
          }
        }
      });

      if (data.status === Const.reward.payStatus.cancel) {
        info.cancel = {
          reason: cust_interact.invalid_reason,
          time: cust_interact.invalid_time,
          user: cust_interact.invalid_belong,
        };
      }

      return info;
    }

    * _getCustInteractCategoryName(type) {
      const cust_interact_category = Cust.interact_type; // 互动类型
      for (const [ k, v ] of Object.entries(cust_interact_category)) {
        if (type === v) { return k; }
      }
    }

    * _formateBill(data) {
      const cust_interact = yield this._getCustInteract(data.cust_service.id);
      if (!cust_interact) {
        app.logger.error('!!!get cust_interact info error :');
      }

      data.type = cust_interact.type; // 类型
      data.type_name = cust_interact.type_name;
      data.customer = data.cust_service.customer;
      data.bee_user = data.user;
      data.create_time = data.cust_service.create_time; // 登记时间
      data.creator = data.cust_service.creator; // 登记人
      data.interact_time = data.cust_service.sale_time; // 交易时间[客户服务的互动时间]
      delete data.cust_service;
      delete data.reward;
      delete data.user;
      delete data.operate_list;

      if (data.status === Const.reward.payStatus.cancel) {
        data.cancel = {
          reason: cust_interact.invalid_reason,
          time: cust_interact.invalid_time,
          user: cust_interact.invalid_belong,
        };
      }
    }

    * _revokeBill(bill) {
      const query = { _id: bill._id };
      const cust_interact = yield this._getCustInteract(bill.cust_service.id);
      const operate = {
        user: {
          id: cust_interact.invalid_belong.id,
          name: cust_interact.invalid_belong.name,
          from: cust_interact.invalid_belong.from,
        },
        action: Const.reward.action.cancel,
        content: '账单作废',
        time: Util.now(),
      };
      yield this.model.update(query, { status: Const.reward.payStatus.cancel, $push: { operate_list: operate } });
      this.ctx.logger.info('[BillSevice _revokeBill] cancelBill success !');

      // 更新账户收益
      yield this._updateAccountIncome(bill);
    }
  }
  return BillService;
};
