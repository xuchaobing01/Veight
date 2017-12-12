'use strict';

/**
 * 系统错误代码定义，以下为各模块错误代码区间定义
 * 1    - 1000 系统错误
 * 1000 - 1999 用户模块
 * 2000 - 2999 任务模块
 * 3000 - 3999 奖励提成模块
 * 4000 - 4999 账单模块
 * 5000 - 5999 客户模块
 * 6000 - 6999 图书馆模块
 */
module.exports = {
  /** ****************************************************
   * 1 - 1000 系统错误 开始
   ******************************************************/
  systemError: {
    status: 1,
    message: '系统错误!',
  },
  notLoginError: {
    status: 2,
    message: '未登录!',
  },
  evalError: {
    status: 11,
    message: '运算错误!',
  },
  rangeError: {
    status: 12,
    message: '范围越界!',
  },
  syntaxError: {
    status: 13,
    message: '语法错误!',
  },
  typeError: {
    status: 14,
    message: '类型错误!',
  },
  uriError: {
    status: 15,
    message: 'uri错误!',
  },
  referenceError: {
    status: 16,
    message: '无效引用!',
  },
  internalError: {
    status: 500,
    message: '内部错误!',
  },
  notFound: {
    status: 404,
    message: '未找到资源!',
  },
  validateError: {
    status: 600,
    message: '字段验证失败!',
  },
  unsupport: {
    status: 700,
    message: '服务未实现!',
  },
  unproxy: {
    status: 701,
    message: '未发现该代理服务!',
  },
  /** ****************************************************
   * 1 - 1000 系统错误 结束
   ******************************************************/

  /** ****************************************************
   * 1000 - 1999 用户模块 开始
   ******************************************************/
  loginFailed: {
    status: 1000,
    message: '登陆失败!',
  },
  /** ****************************************************
   * 1000 - 1999 用户模块 结束
   ******************************************************/

  /** ****************************************************
 * 2000 - 2999 任务模块 开始
 ******************************************************/
  cannotModify: {
    status: 2000,
    message: '不能修改!',
  },


  /** ****************************************************
   * 2000 - 2999 任务模块 结束
   ******************************************************/


  /** ****************************************************
* 4000 - 4999 账单模块 开始
******************************************************/
  matchRule: {
    status: 4000,
    message: '规则不能匹配!',
  },
  billParse: {
    status: 4001,
    message: '账单解析错误!',
  },

  /** ****************************************************
   * 4000 - 4999 账单模块 结束
   ******************************************************/


  /** ****************************************************
   * 5000 - 5999 客户模块 开始
   ******************************************************/
  args_error: {
    status: 5000,
    message: '传参错误!',
  },
  timeline_fail: {
    status: 5001,
    message: '时间线添加失败!',
  },
  trigger_fail: {
    status: 5002,
    message: '任务触发失败!',
  },
  carplan_exists: {
    status: 5003,
    message: '购车计划已存在!',
  },
  carplan_errdata: {
    status: 5004,
    message: '购车计划数据异常!',
  },
  relatedcust_notfound: {
    status: 5005,
    message: '无法匹配客户对应关系',
  },
  cust_notfound: {
    status: 5006,
    message: '客户不存在',
  },
  interact_errtype: {
    status: 5007,
    message: '互动类型错误',
  },
  interact_exchange: {
    status: 5008,
    message: '该购车计划不是置换',
  },
  interact_invalidError: {
    status: 5009,
    message: '作废互动失败',
  },
  owncar_no_edit: {
    status: 5010,
    message: '该车处于置换状态, 无法编辑',
  },
  owncar_not_found: {
    status: 5011,
    message: '该车不存在',
  },
  /** ****************************************************
   * 5000 - 5999 客户模块 结束
   ******************************************************/
};