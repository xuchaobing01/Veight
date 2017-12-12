'use strict';
module.exports = app => {

  const authMe = app.middlewares.authMe();

  // 任務管理
  app.post('/task/create', authMe, 'task.task.create');// 创建任务
  app.post('/task/delete', authMe, 'task.task.delete');// 删除任务
  app.post('/task/finish', authMe, 'task.task.finishTask');//  执行人完成任务
  app.post('/task/track', authMe, 'task.task.track');// 任务跟进
  app.post('/task/operateDetail', authMe, 'task.task.operateDetail');// 查看（跟进/完成）情况
  app.post('/task/reply', authMe, 'task.task.reply');// 消息回复
  app.post('/task/detail', authMe, 'task.task.detail');// 任务详情
  app.post('/task/modifyTask', authMe, 'task.task.modifyTask');// 修改任务
  app.post('/task/end', authMe, 'task.task.endTask');// 创建人结束任务
  app.post('/task/allList', authMe, 'task.task.allList');// 全部的任务列表
  app.post('/task/sendList', authMe, 'task.task.sendList');// 派发任务列表
  app.post('/task/receiveList', authMe, 'task.task.receiveList');// 收到任务列表
  app.post('/task/followerList', authMe, 'task.task.followerList');// 关注人的任务列表
  app.post('/task/deleteList', authMe, 'task.task.deleteList');// 回收站任务的列表
  app.post('/task/search', authMe, 'task.task.search');// 搜索

  // 学校
  app.post('/region/list', authMe, 'region.region.list');
  app.post('/region/getCity', authMe, 'region.region.getCity');
  app.post('/region/getArea', authMe, 'region.region.getArea');
  app.post('/school/list', authMe, 'region.school.list');

  // oss
  app.post('/oss/signature', authMe, 'oss.oss.signature');
  app.post('/oss/delete', authMe, 'oss.oss.delete');


  // 奖励提成
  app.post('/reward/rule/shopRules', authMe, 'reward.rule.shopRules');
  app.post('/reward/rule/historyRules', authMe, 'reward.rule.historyRules');
  app.post('/reward/rule/update', authMe, 'reward.rule.update');
  app.post('/reward/rule/detail', authMe, 'reward.rule.detail');
  app.post('/reward/rule/latestRule', authMe, 'reward.rule.latestRule');
  // 账单
  app.post('/reward/bill/list', authMe, 'reward.bill.list');
  app.post('/reward/bill/detail', authMe, 'reward.bill.detail');
  app.post('/reward/bill/delete', authMe, 'reward.bill.delete');
  app.post('/reward/bill/cancel', authMe, 'reward.bill.cancel');
  app.post('/reward/bill/beeList', authMe, 'reward.bill.beeList');

  // 客户-基础
  app.post('/cust/save', authMe, 'cust.cust.save'); // 保存客户信息
  app.post('/cust/list', authMe, 'cust.cust.list'); // 查询客户列表
  app.post('/cust/delete', authMe, 'cust.cust.delete'); // 删除
  app.post('/cust/detail', authMe, 'cust.cust.detail'); // 获取客户详情
  app.post('/cust/search', authMe, 'cust.cust.search'); // 按名称搜索客户
  app.post('/cust/getconf', authMe, 'cust.cust.getConf');
  // 客户-已有车辆
  app.post('/cust/owncar', authMe, 'cust.cust.getOwnCar'); // 获取客户已有车辆列表
  app.post('/cust/getonecar', authMe, 'cust.cust.getOneCar'); // 获取该客户一台车
  app.post('/cust/updonecar', authMe, 'cust.cust.updateOneCar'); // 获取该客户一台车
  app.post('/cust/delowncar', authMe, 'cust.cust.delOwnCar'); // 删除已有车辆
  app.post('/cust/addowncar', authMe, 'cust.cust.addOwnCar'); // 增加已有车辆
  // 客户-购车计划
  app.post('/cust/addcarplan', authMe, 'cust.cust.addCarPlan'); // 增加购车计划
  app.post('/cust/updcarplan', authMe, 'cust.cust.updateCarPlan'); // 更新购车计划
  app.post('/cust/delcarplan', authMe, 'cust.cust.delCarPlan'); // 删除购车计划
  app.post('/cust/carplan', authMe, 'cust.cust.getCarPlan'); // 删除购车计划

  // 客户服务
  app.post('/cust/interact/create', authMe, 'cust.interact.create'); // 创建互动
  app.post('/cust/interact/list', authMe, 'cust.interact.list'); // 创建互动
  app.post('/cust/interact/detail', authMe, 'cust.interact.detail'); // 互动详情
  app.post('/cust/interact/type', authMe, 'cust.interact.getType'); // 互动类型
  app.post('/cust/interact/invalid', authMe, 'cust.interact.invalid'); // 作废互动

  // 车型库
  app.post('/car/search', authMe, 'car.car.search'); // 车型搜索
  app.post('/car/getbrands', authMe, 'car.car.getBrandList'); // 品牌
  app.post('/car/gettypes', authMe, 'car.car.getTypeList'); // 车系
  app.post('/car/getmodels', authMe, 'car.car.getModelList'); // 车型

  // 用户统计
  app.post('/statistics/user/index', authMe, 'statistics.user.index');


};
