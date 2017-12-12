'use strict';
/**
 * 验证规则定义
 */


// 执行者验证
const user = {
  type: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    from: { type: 'string', required: true },
  },

};
// 上级
const leader = {
  type: 'object',
  required: false,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    from: { type: 'string', required: true },
  },

};


// 附件上传验证
const attach = {
  type: 'array',
  itemType: 'object',
  required: false,
  rule: {
    mole: { type: 'string', required: true }, // 类型
    url: { type: 'string', required: true },
  },
};
// 执行人
const executor = {
  type: 'array',
  itemType: 'object',
  required: true,
  rule: {
    user,
    leader,
  },
};
// 提醒
const reminder = {
  type: 'object',
  required: true,
  rule: {
    rule_key: { type: 'number', required: true },
  },

};


// 跟进
const track = {
  _id: { type: 'string', required: true },
  content: { type: 'string', required: true },
  attach,
};
// 查看（跟进/完成）
const operateDetail = {
  _id: { type: 'string', required: true },
  action: { type: 'number', required: true },
  userId: { type: 'string', required: true },
};
// 消息回复
const reply = {
  _id: { type: 'string', required: true },
  action: { type: 'number', required: false },
  content: { type: 'string', required: true },
};
// list
const list = {
  page: { type: 'number', required: true },
  size: { type: 'number', required: true },
};
// 搜索
const search = {
  message: { type: 'string', required: true },
  page: { type: 'number', required: true },
  size: { type: 'number', required: true },

};


// 新增验证
const create = {
  task: {
    type: 'object',
    required: true,
    rule: {
      content: { type: 'string', required: true }, // 内容描述
      end_time: { type: 'string', required: true }, // 截止时间
      attach, // 附件
      executor,
      reminder,
    },

  },


};
// 完成任务
const finish = {
  _id: { type: 'string', required: true },
  content: { type: 'string', required: true },
  attach,
};
// 修改任务
const modify = {
  task: {
    type: 'object',
    required: true,
    rule: {
      _id: { type: 'string', required: true },
      content: { type: 'string', required: true }, // 内容描述
      end_time: { type: 'string', required: true }, // 截止时间
      attach, // 附件
      executor,
      reminder,
    },
  },
};

// 查看明细
const detail = {
  _id: { type: 'string', required: true },
};

const id = detail;

module.exports = { id, create, track, operateDetail, reply, search, list, modify, finish };
