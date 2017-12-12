'use strict';

const path = require('path');
module.exports = appInfo => {
  const logDir = `${appInfo.root}/logs/${appInfo.name}`;
  return {
    /** *******************系统默认配置*************************/


    // cache 设置 可以定义多个cache 例如 ['user','carType']
    // 通过user.set get 方法访问
    tokenRedis: {
      name: 'token', // 指定redis配置名称
      maxAge: 1800 * 1000, // maxAge 单位毫秒，
    },

    cacheRedis: 'cache', // 指定redis配置名称

    middleware: ['authToken', 'errorHandler'],

    errorHandler: {
      // 非 `/api/` 路径不在这里做错误处理，留给默认的 onerror 插件统一处理
      match: '/',
    },

    httpclient: {
      request: {
        timeout: 20 * 1000,
      },
    },

    logger: {
      dir: `${logDir}`,
      consoleLevel: 'DEBUG',
      appLogName: `${appInfo.name}-info.log`,
      coreLogName: 'core-info.log',
      agentLogName: 'agent-agent.log',
      errorLogName: 'common-error.log',
    },
    customLogger: {
      visitLogger: {
        file: path.join(`${logDir}`, 'visit.log'),
      },
    },
    logrotator: {
      // 按小时分割文件
      // filesRotateByHour: [
      //   path.join(`${logDir}`, 'core-info.log'),
      //   path.join(`${logDir}`, 'visit.log'),
      //   path.join(`${logDir}`, `${appInfo.name}-info.log`),
      // ], // list of files that will be rotated by hour
      filesRotateBySize: [
        path.join(`${logDir}`, 'common-error.log'),
      ], // list of files that will be rotated by size
      maxFileSize: 10 * 1024 * 1024, // Max file size to judge if any file need rotate
      maxFiles: 10, // pieces rotate by size
      rotateDuration: 60000, // time interval to judge if any file need rotate
      maxDays: 31 * 6, // keep max days log files, default is `31`. Set `0` to keep all logs
    },
    /**
     * rabbitmq  rabbitmqServer 配置
     * 在云杉系统启动时会在app下注册一个mq服务
     */
    rabbitmqServer: {
      // 发布服务
      publisher: {
        // name 发布服务名，通过app.${name}或app[name]访问
        name: 'mqPublisher',
        // dir 发布服务定义文件夹
        dir: 'app/mq/publisher',
      },
      // 消费服务
      consumer: {
        // name 消费服务名，通过app.${name}或app[name]访问
        name: 'mqConsumer',
        // dir 消费服务定义文件夹
        dir: 'app/mq/consumer',

        server: [/** 服务定义 */
          // {
          //   exchange: 'notify',
          //   queue: 'notify',
          //   router: [ 'notify' ],
          // },
          // {
          //   exchange: 'bmsOrder',
          //   queue: 'bmsOrder',
          //   router: [ 'newCar' ],
          // },
          // {
          //   exchange: 'bmsTask',
          //   queue: 'bmsTask',
          //   router: [ 'newCarTask' ],
          // },
          {
            exchange: 'bill',
            router: ['createBill', 'createBillAck', 'cancelBill', 'cancelBillAck'],
          },
          {
            exchange: 'bmsRuleTask',
            router: ['create'],
          },
        ],
      },
    },

    keys: '${appInfo.name}',

    secret: 'spruce',

    serverInfoPath: '/serverInfo',
  };
};
