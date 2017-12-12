'use strict';
const Const = require('../common/const');
const Util = require('../common/util');
const events = require('../common/event-type');
const System = Const.task.taskType.system;
module.exports = app => {
  class interactionTaskService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.getModel('task');
    }
    * interactionOrTask(task, interactionOrtask, user) {
      const taskType = task.task_type;
      // 根据任务类型判断所产生的互动和任务
      switch (taskType) {
        case System.buy_car_invitation:// 邀请购车
          yield this._buyCarInvitation(task, interactionOrtask, user);
          break;
        case System.buy_car_invitation_entry_shop:// 邀请进店
          yield this._buyInStoreTask(task, interactionOrtask, user);
          break;
        case System.buy_car_likeUp_invitation:// 沟通购车计划
          yield this._buyCarPlan(task, interactionOrtask, user);
          break;
        case System.replace_car_invitation:// 置换
          yield this._substitution(task, interactionOrtask, user);
          break;
        case System.replace_car_invitation_entry_shop:// 置换车辆触发的关联任务（置换车辆进店）
          yield this._inStoreTask(task, interactionOrtask, user);
          break;
        case System.replace_car_likeUp_invitation:// 沟通置换计划
          yield this._replacePlan(task, interactionOrtask, user);
          break;
        case System.sell_car_invitation:// 邀请出手车辆
          yield this._invitationPlan(task, interactionOrtask, user);
          break;
        case System.sell_car_invitation_entry_shop:// 邀请出手车辆进店任务（邀请出手车辆触发的关联任务）
          yield this._sellCarTask(task, interactionOrtask, user);
          break;
        case System.sell_car__likeUp_invitation:// 沟通出手计划
          yield this._likeUpSellCarPlan(task, interactionOrtask, user);
          break;
        case System.sell_car_likeUp_invitation_maintain:// 沟通出手车辆维修任务（沟通出手车辆触发的关联任务）
          yield this._orderMaintain(task, interactionOrtask, user);
          break;
        case System.usage_likeUp_invitation:// 沟通车辆使用情况
          yield this._likeUpUsage(task, interactionOrtask, user);
          break;
        case System.usage_likeUp_invitation_repair:// 沟通车辆使用情况维修任务（沟通车辆使用情况触发的关联任务）
          yield this._orderMaintain(task, interactionOrtask, user);
          break;
        case System.perfect_date_plan:// 完善客戶資料
          break;
        case System.birthday_reminder_plan:// 完善客戶資料
          break;
        default:
          throw new Error('任务类型错误');
      }
    }
    // 邀请购车任务
    * _buyCarInvitation(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      // 未进店，
      if (!interactionOrtask.is_entry && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._notInStore(user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店，未预约销售专家
      } else if (interactionOrtask.is_entry === true && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._inStore(user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店，预约销售专家
      } else if (interactionOrtask.is_entry === true && interactionOrtask.is_order === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._order(user, interactionOrtask);
        yield this.interaction(custid, interaction);
        const category = events.category.buy_car_to_saleman;
        // 获取最新的任务详情
        const context = {
          task,
          executor_id: user.id,
        };
        // 生成新任务
        yield this.createRelationTask(category, context);
      }
    }
    // 邀请购车任务触发的关联任务
    * _buyInStoreTask(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      // 未进店
      if (!interactionOrtask.is_entry) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._buyTaskNotInStore(user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店
      } else if (interactionOrtask.is_entry === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._buyTaskInStore(user, interactionOrtask);
        // 生成互动
        yield this.interaction(custid, interaction);
      }
    }
    // 进店任务
    * _inStoreTask(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      // 未进店
      if (!interactionOrtask.is_entry) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._soldTaskNotInStore(task, user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店
      } else if (interactionOrtask.is_entry === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._soldTaskInStore(user, interactionOrtask, task);
        // 生成互动
        yield this.interaction(custid, interaction);
      }
    }
    // 邀请出手车辆触发的关联任务
    * _sellCarTask(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      const oldCarId = task.extend.old_car[0]._id;
      // 获取已有车辆的信息
      const oldCarPlan = yield this.getCustOldCar(custid, oldCarId);
      const msgParam = {
        car_type: oldCarPlan[0].model_name,
      };
      // 未进店
      if (!interactionOrtask.is_entry) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._sellTaskNotInStore(msgParam, user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店
      } else if (interactionOrtask.is_entry === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._sellTaskInStore(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
      }
    }
    // 沟通购车计划任务任务
    * _buyCarPlan(task, interactionOrtask, user) {
      const car_plan = interactionOrtask.car_plan;// 购车计划
      const custid = task.extend.cust.id;// 客户id
      const carplanid = task.extend.car_plan.id;// 购车计划id
      // 购车计划是否改变
      const isPlan = yield this.isBuyCarOrReplacePlan('carplan', custid, carplanid, car_plan);
      if (isPlan === "PLAN_CHANGED") { // 购车计划改变
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._likeUpbuycarPlan(user);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 更新购车计划
        yield this.updateBuyCarOrReplacePlan(custid, carplanid, car_plan);
      } else if (isPlan === "NO_CHANGED") { // 购车计划未变
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._likeUpbuycarNotPlan(user);
        // 生成互动
        yield this.interaction(custid, interaction);
      }
    }
    // 置换任务
    * _substitution(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      // 未进店
      if (!interactionOrtask.is_entry && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._replaceNotInStore(user, interactionOrtask, task);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店，未预约销售专家
      } else if (interactionOrtask.is_entry === true && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._replaceInStore(user, interactionOrtask, task);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店，预约销售专家
      } else if (interactionOrtask.is_entry === true && interactionOrtask.is_order === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._replaceOrder(user, interactionOrtask, task);
        // 生成互动
        yield this.interaction(custid, interaction);
        const category = events.category.replace_car_to_saleman;
        const context = {
          task,
          executor_id: user.id,
        };
        // 生成新任务
        yield this.createRelationTask(category, context);
      }
    }
    // 沟通置换计划任务
    * _replacePlan(task, interactionOrtask, user) {
      const car_plan = interactionOrtask.car_plan;
      const custid = task.extend.cust.id;
      const carplanid = task.extend.car_plan.id;
      const interaction = this._interactionParams(task, user);// 互动需要的参数
      // 置换计划是否改变
      const isPlan = yield this.isBuyCarOrReplacePlan('carplan', custid, carplanid, car_plan);
      if (isPlan === 'PLAN_CHANGED') { // 置换计划改变
        interaction.abstract = this._replacePlanChange(user);
        yield this.interaction(custid, interaction); // 生成互动
      } else if (isPlan === 'TRANSFER_CAR_CHANGED') { // 置换车辆改变
        interaction.abstract = this._replaceCar(user);
        yield this.interaction(custid, interaction);// 生成互动
      } else if (isPlan === 'BOTH_CHANGED') { // 置换计划和车辆都改变
        interaction.abstract = this._replaceCarOrPlanChange(user);
        yield this.interaction(custid, interaction);// 生成互动
      } else if (isPlan === 'NO_CHANGED') { // 置换计划未变
        interaction.abstract = this._replacePlanNotChange(user);
        yield this.interaction(custid, interaction); // 生成互动
        return;
      }
      yield this.updateBuyCarOrReplacePlan(custid, carplanid, car_plan); // 更新置换计划
    }
    // 邀请出手车辆任务
    * _invitationPlan(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      const oldCarId = task.extend.old_car[0]._id;
      // 获取已有车辆的信息
      const oldCarPlan = yield this.getCustOldCar(custid, oldCarId);
      const msgParam = {
        car_type: oldCarPlan[0].model_name,
      };
      // 未进店
      if (!interactionOrtask.is_entry && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._invitationPlanNotInStore(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店，未预约销售专家
      } else if (interactionOrtask.is_entry === true && !interactionOrtask.is_order) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._invitationPlanInStore(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
        // 进店,预约销售专家
      } else if (interactionOrtask.is_entry === true && interactionOrtask.is_order === true) {
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._invitationPlanOrder(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
        const context = {
          executor: interactionOrtask.expert,
          bee: user.name,
          extend: {
            cust: task.extend.cust,
            old_car: oldCarPlan,
          },
        };
        const category = events.category.sell_car_to_saleman;
        // 生成新任务
        yield this.createRelationTask(category, context);
      }
    }
    // 沟通出手车辆
    * _likeUpSellCarPlan(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      const car_plan = { resell_date_type: interactionOrtask.sold_time };
      const sold_time = interactionOrtask.sold_time;
      const carplanid = task.extend.car_plan.id;
      const oldCarId = task.extend.old_car[0]._id;
      const interaction = this._interactionParams(task, user);// 互动所需要的参数
      // 获取已有车辆的信息
      const oldCarPlan = yield this.getCustOldCar(custid, oldCarId);
      const msgParam = {
        car_type: oldCarPlan[0].model_name,
      };
      const is_time = yield this.isBuyCarOrReplacePlan('owncar', custid, oldCarId, car_plan);
      // 不维修
      if (!interactionOrtask.is_maintain && !interactionOrtask.is_order) {
        // 计划出手时间未改变
        if (is_time === 'NO_CHANGED') {
          interaction.abstract = this._notMaintainOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 计划出手时间改变
        } else if (is_time === 'RESELL_DATE_CHANGED') {
          interaction.abstract = this._notMaintainOrTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 选择维修,不预约服务专家
      } else if (interactionOrtask.is_maintain === true && !interactionOrtask.is_order) {
        if (is_time === 'NO_CHANGED') { // 计划出手时间未改变
          interaction.abstract = this._maintainOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
        } else if (is_time === 'RESELL_DATE_CHANGED') { // 计划出手时间改变
          interaction.abstract = this._maintainOrTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 选择维修，预约服务专家
      } else if (interactionOrtask.is_maintain === true && interactionOrtask.is_order === true) {
        const category = events.category.care_car_to_server;
        const context = {
          executor: interactionOrtask.expert,
          bee: user.name,
          extend: {
            cust: task.extend.cust,
            old_car: oldCarPlan,
          },
        };
        if (is_time === 'NO_CHANGED') { // 计划出手时间不变
          interaction.abstract = this._orderExpertOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
        } else if (is_time === 'RESELL_DATE_CHANGED') { // 计划出手时间改变
          interaction.abstract = this._orderExpertOrTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 生成新任务
        yield this.createRelationTask(category, context);
      }
    }
    // 沟通车辆的使用情况
    * _likeUpUsage(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      const car_plan = { resell_date_type: interactionOrtask.sold_time };
      const sold_time = interactionOrtask.sold_time;
      const carplanid = task.extend.car_plan.id;
      const oldCarId = task.extend.old_car[0]._id;
      // 获取已有车辆的信息
      const oldCarPlan = yield this.getCustOldCar(custid, oldCarId);
      const msgParam = {
        car_type: oldCarPlan[0].model_name,
      };
      const is_time = yield this.isBuyCarOrReplacePlan('owncar', custid, oldCarId, car_plan);
      // 不维修
      if (!interactionOrtask.is_maintain && !interactionOrtask.is_order) {
        // 计划出手时间未改变
        if (!is_time) {
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskNotMaintainOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 计划出手时间改变
        } else {
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskNotMaintainOrAddTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 选择维修,不预约服务专家
      } else if (interactionOrtask.is_maintain === true && !interactionOrtask.is_order) {
        if (!is_time) { // 计划出手时间未改变
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskMaintainOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
        } else { // 计划出手时间改变
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskMaintainOrAddTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 选择维修，预约服务专家
      } else if (interactionOrtask.is_maintain === true && interactionOrtask.is_order === true) {
        const category = events.category.care_car_to_server;

        const context = {
          executor: interactionOrtask.expert,
          bee: user.name,
          extend: {
            cust: task.extend.cust,
            old_car: oldCarPlan,
          },
        };
        if (!is_time) { // 计划出手时间不变
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskOrderOrNotTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
        } else { // 计划出手时间改变
          const interaction = this._interactionParams(task, user);
          interaction.abstract = this._likeUpTaskOrderOrAddTime(user, interactionOrtask, msgParam);
          // 生成互动
          yield this.interaction(custid, interaction);
          // 更新车辆出手时间
          yield this.updateSellTime(custid, oldCarId, sold_time);
        }
        // 生成新任务
        yield this.createRelationTask(category, context);
      }
    }
    // 预约维修任务
    * _orderMaintain(task, interactionOrtask, user) {
      const custid = task.extend.cust.id;
      const oldCarId = task.extend.old_car[0]._id;
      // 获取已有车辆的信息
      const oldCarPlan = yield this.getCustOldCar(custid, oldCarId);
      const msgParam = {
        car_type: oldCarPlan[0].model_name,
      };
      if (!interactionOrtask.is_entry) { // 未进店
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._orderMaintainNotInStore(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
      } else if (interactionOrtask.is_entry === true && interactionOrtask.entry_time) { // 进店
        const interaction = this._interactionParams(task, user);
        interaction.abstract = this._orderMaintainInStore(user, interactionOrtask, msgParam);
        // 生成互动
        yield this.interaction(custid, interaction);
      }
    }
    // 互动内容所需的参数
    _interactionParams(task, user) {
      return {
        processor: user,
        type: 0,
        from_id: task.id,
        interact_time: Util.now(),
      };
    }
    // 不同的条件产生不同的互动内容
    // 邀请购车任务未进店
    _notInStore(user) {
      const megs = `${user.name}已邀请客户进店看车，但未成功`;
      return megs;
    }
    // 邀请购车任务进店
    _inStore(user) {
      const megs = `${user.name}邀请客户进店看车.购车。`;
      return megs;
    }
    // 邀请购车任务销售专家和客户预约
    _order(user, interactionOrtask) {
      const megs = `${user.name}已邀请了客户进店看车.购车,已选销售专家${interactionOrtask.expert.name}。`;
      return megs;
    }
    // 沟通购车计划计划未变
    _likeUpbuycarNotPlan(user) {
      const megs = `${user.name}和客户聊了购车计划,购车计划未变。`;
      return megs;
    }
    // 沟通购车计划计划变了
    _likeUpbuycarPlan(user) {
      const megs = `${user.name}和客户聊了购车计划,并更新了购车计划。`;
      return megs;
    }
    // 置换车辆未进店
    _replaceNotInStore(user, interactionOrtask, task) {
      let megs = null;
      const car_type = task.extend.old_car[0].name;// 车型
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      if (kilometer) {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type},但未成功。
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type},但未成功。`;
      }
      return megs;
    }
    // 置换车辆进店
    _replaceInStore(user, interactionOrtask, task) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const car_type = task.extend.old_car[0].name;// 车型
      if (kilometer) {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type}
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type}。`;
      }
      return megs;
    }
    // 置换车辆销售专家和客户预约
    _replaceOrder(user, interactionOrtask, task) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const car_type = task.extend.old_car[0].name;// 车型
      if (kilometer) {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type},已选销售专家${interactionOrtask.expert.name}。
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.置换${car_type},已选销售专家${interactionOrtask.expert.name}。`;
      }
      return megs;
    }
    // 置换车辆计划变了
    _replacePlanChange(user) {
      return `${user.name}和客户聊了置换计划,并更新了购车计划。`;
    }
    // 置换车辆置换计划未变
    _replacePlanNotChange(user) {
      return `${user.name}和客户聊了置换计划,置换计划未变。`;
    }
    // 置换车辆车辆改变
    _replaceCar(user) {
      return `${user.name}和客户聊了置换计划,并更新了已有车辆。`;
    }
    // 置换车辆计划和车辆改变
    _replaceCarOrPlanChange(user) {
      return `${user.name}和客户聊了置换计划,并更新了购车计划和已有车辆。`;
    }
    // 邀请出手车辆未进店
    _invitationPlanNotInStore(user, interactionOrtask, msgParam) {
      let megs = null;
      const { car_type } = msgParam;// 车型
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      if (kilometer) {
        megs = `${user.name}已邀请客户进店评估.出手${car_type},但未成功。
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.出手${car_type},但未成功。`;
      }
      return megs;
    }
    // 邀请出手车辆进店
    _invitationPlanInStore(user, interactionOrtask, msgParam) {
      let megs = null;
      const { car_type } = msgParam;// 车型
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      if (kilometer) {
        megs = `${user.name}已成功邀请客户进店评估.出手${car_type}。
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.出手${car_type}。`;
      }
      return megs;
    }
    // 邀请出手车辆客户与销售专家预约
    _invitationPlanOrder(user, interactionOrtask, msgParam) {
      let megs = [];
      const { car_type } = msgParam;// 车型
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      if (kilometer) {
        megs = `${user.name}已成功邀请客户进店评估.出手${car_type},已选销售专家:${interactionOrtask.expert.name}。
        车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}已成功邀请客户进店评估.出手${car_type},已选销售专家:${interactionOrtask.expert.name}。`;
      }
      return megs;
    }
    // 沟通出手车辆任务不维修计划时间不变
    _notMaintainOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。`;
      }
      return megs;
    }
    // 不维修计划出手时间改变
    _notMaintainOrTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并跟新了计划出手时间。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并跟新了计划出手时间。`;
      }
      return megs;
    }
    // 维修计划出手时间不变
    _maintainOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养。`;
      }
      return megs;
    }
    // 维修计划出手时间改变
    _maintainOrTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养。`;
      }
      return megs;
    }
    // 预约服务专家且计划出手时间不变
    _orderExpertOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}
          车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}`;
      }
      return megs;
    }
    // 预约服务专家且计划出手时间改变
    _orderExpertOrTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}
          车辆已行驶里程：${kilometer}公里`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）任务不维修计划时间不变
    _likeUpTaskNotMaintainOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划。`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）任务不维修添加计划出手时间
    _likeUpTaskNotMaintainOrAddTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划，并添加了计划出手时间。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划，并添加了计划出手时间`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）未添加计划出手时间 维修
    _likeUpTaskMaintainOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划。客户预计一周内进店维修保养。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划。客户预计一周内进店维修保养。`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）添加计划出手时间 维修
    _likeUpTaskMaintainOrAddTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并添加了计划出手时间。客户预计一周内进店维修保养。
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并添加了计划出手时间。客户预计一周内进店维修保养。`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）添加计划出手时间 预约服务专家
    _likeUpTaskOrderOrAddTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并添加了计划出手时间。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}.
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,并添加了计划出手时间。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}.`;
      }
      return megs;
    }
    // 沟通车辆使用情况（未填写出售时间）未添加添加计划出手时间 预约服务专家
    _likeUpTaskOrderOrNotTime(user, interactionOrtask, msgParam) {
      let megs = null;
      const kilometer = interactionOrtask.kilometer;// 已行驶公里数
      const { car_type } = msgParam;// 车型
      if (kilometer) {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}.
          车辆已行驶里程：${kilometer}`;
      } else {
        megs = `${user.name}和客户聊了${car_type}使用情况和出手计划,客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}.`;
      }
      return megs;
    }
    // 预约任务未进店
    _orderMaintainNotInStore(user, interactionOrtask, msgParam) {
      const { car_type } = msgParam;// 车型
      const megs = `服务专家${user.name}已预约客户进店维修保养${car_type}，但未成功`;
      return megs;
    }
    // 预约任务进店
    _orderMaintainInStore(user, interactionOrtask, msgParam) {
      const { car_type } = msgParam;// 车型
      const entryTime = Util.dateFormat(interactionOrtask.entry_time, Const.DATE_FORMAT);
      const megs = `服务专家${user.name}已预约客户进店维修保养${car_type}，进店时间为${entryTime}`;
      return megs;
    }
    // 邀请购车任务触发的进店任务(未进店)
    _buyTaskNotInStore(user) {
      const megs = `销售专家${user.name}已预约客户进店看车.购车,但未成功`;
      return megs;
    }
    // 邀请购车任务，触发的进店任务(进店)
    _buyTaskInStore(user, interactionOrtask) {
      const entryTime = Util.dateFormat(interactionOrtask.entry_time, Const.DATE_FORMAT);
      const megs = `销售专家${user.name}已预约客户进店看车.购车,进店时间为${entryTime}`;
      return megs;
    }

    // 邀请置换任务触发的进店任务(未进店)
    _soldTaskNotInStore(task, user) {
      const car_type = task.extend.old_car[0].name;// 车型
      const megs = `销售专家${user.name}已预约客户进店评估.置换${car_type},但未成功`;
      return megs;
    }
    // 邀请置换任务触发的进店任务(进店)
    _soldTaskInStore(user, interactionOrtask, task) {
      const car_type = task.extend.old_car[0].name;// 车型
      const entryTime = Util.dateFormat(interactionOrtask.entry_time, Const.DATE_FORMAT);
      const megs = `销售专家${user.name}已预约客户进店评估.置换${car_type},进店时间为${entryTime}`;
      return megs;
    }
    // 邀请出手车辆任务触发的进店任务(未进店)
    _sellTaskNotInStore(msgParam, user) {
      const { car_type } = msgParam;// 车型
      const megs = `销售专家${user.name}已预约客户进店评估.出售${car_type},但未成功`;
      return megs;
    }
    // 邀请出手车辆任务触发的进店任务(进店)
    _sellTaskInStore(user, interactionOrtask, msgParam) {
      const { car_type } = msgParam;// 车型
      const entryTime = Util.dateFormat(interactionOrtask.entry_time, Const.DATE_FORMAT);
      const megs = `销售专家${user.name}已预约客户进店评估.出售${car_type},进店时间为${entryTime}`;
      return megs;
    }
    // 创建进店任务（触发的关联任务）
    * createRelationTask(category, context) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] createRelationTask  category:' + category + ',' + JSON.stringify(context));
        yield this.ctx.getService('eventEngine').process(category, context);
        logger.info(`[interactionTaskService] createRelationTask success! category:${category}`);
      } catch (e) {
        console.error(`[interactionTaskService] notifyTrack error! category:${category}`);
        console.error(e);
      }
    }
    // 互动
    * interaction(custid, interaction) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] interaction  custid:' + custid + JSON.stringify(interaction));
        yield this.ctx.getService('cust').addTimeline(custid, interaction);
        logger.info(`[interactionTaskService] interaction success! category:${interaction.type}`);
      } catch (e) {
        console.error(`[interactionTaskService] interaction error! category:${interaction.type}`);
        console.error(e);
      }
    }
    // 购车/置换计划是否改变
    * isBuyCarOrReplacePlan(caption, cust_id, planId, current_data) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] isBuyCarOrReplacePlan :' + cust_id);
        const data = yield this.ctx.getService('cust').checkDataChanged(caption, cust_id, planId, current_data);
        logger.info(`[interactionTaskService] isBuyCarOrReplacePlan success! custId:${cust_id}`);
        return data;
      } catch (e) {
        console.error(`[interactionTaskService] isBuyCarOrReplacePlan error! custId:${cust_id}`);
        console.error(e);
      }
    }
    // 更新购车/置换计划
    * updateBuyCarOrReplacePlan(custid, carplanid, carPlan) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] updateBuyCarOrReplacePlan : custid' + custid + JSON.stringify(carPlan));
        yield this.ctx.getService('cust').updateCarPlan(custid, carplanid, carPlan);
        logger.info(`[interactionTaskService] updateBuyCarOrReplacePlan success! custId:${custid}`);
      } catch (e) {
        console.error(`[interactionTaskService] updateBuyCarOrReplacePlan error! custId:${custid}`);
        console.error(e);
      }
    }
    // 更新出手时间 custId oldCarId time
    * updateSellTime(custid, oldCarId, time) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] updateSellTime :' + custid);
        yield this.ctx.getService('cust').updateOwnCarResell(custid, oldCarId, time);
        logger.info(`[interactionTaskService] updateSellTime success! custId:${custid}`);
      } catch (e) {
        console.error(`[interactionTaskService] updateSellTime error! custId:${custid}`);
        console.error(e);
      }
    }
    // 获取客户资料已购车辆
    * getCustOldCar(custid, oldCarId) {
      const logger = this.ctx.logger;
      try {
        logger.info('[interactionTaskService] ----------------------- custid:' + custid);
        logger.info('[interactionTaskService] ----------------------- oldCarId:' + oldCarId);
        const cust = yield this.ctx.getService('cust').getCustDetail(custid);
        logger.info('[interactionTaskService] ----------------------- getCust cust:' + JSON.stringify(cust));
        const oldCarPlan = cust.own_car.filter(v => {
          logger.info('[interactionTaskService] ' + v._id + '----' + oldCarId + '比较结果：' + (v._id.toString() === oldCarId));
          return v._id.toString() === oldCarId;
        });
        logger.info('[interactionTaskService] ----------------------- getCust oldCarPlan:' + JSON.stringify(oldCarPlan[0]));
        return oldCarPlan;

      } catch (e) {
        console.error(`[interactionTaskService] getCust error! custId:${custid}`);
      }
    }
  }
  return interactionTaskService;
};
