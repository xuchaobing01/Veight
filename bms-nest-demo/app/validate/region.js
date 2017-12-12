'use strict';

const getCity = {
  code: { type: 'string', required: true }, // 省市code
};

const getArea = {
  code: { type: 'string', required: true }, // 市code
};

module.exports = { getCity, getArea };
