'use strict';

const list = {
  school: {
    type: 'object',
    required: true,
    rule: {
      name: { type: 'string', required: false }, // 学校名称
      city: { type: 'string', required: false }, // 学校所在省
    },
  },
};

const detail = {
  _id: { type: 'string', required: true },
};

module.exports = { list, detail };
