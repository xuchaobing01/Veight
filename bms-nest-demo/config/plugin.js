'use strict';

// const path = require('path');
module.exports = {
  static: true,

  mongoose: {
    enable: true,
    package: 'spruce-mongoose',
  },

  myutil: {
    enable: true,
    package: 'spruce-util',
  },

  proxy: {
    enable: true,
    package: 'spruce-proxy',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },
  logrotator: true,

  validate: {
    enable: true,
    package: 'spruce-validate',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  rabbitmq: {
    enable: true,
    package: 'spruce-rabbitmq',
  },
};
