'use strict';

module.exports = {

  /** *******************公共开发环境配置*************************/
  mongoose: {
    url: 'mongodb://192.168.0.240:27017/test',
    options: {
      db: { native_parser: true },
      user: 'test',
      pass: 'test',
    },
    domain: {
      path: 'app/domain/mongo',
    },
    debug: true,
  },
  redis: {
    clients: {
      // cache 的配置
      cache: {
        host: '192.168.0.240',
        port: '6379',
        password: '$apr1$CXNy/Ob5$m.FIUANVJOjaBQgnKB8G3',
        db: '11',
      },
      // token cache的配置
      token: {
        host: '192.168.0.240',
        port: '6379',
        password: '$apr1$CXNy/Ob5$m.FIUANVJOjaBQgnKB8G3',
        db: '12',
      },
    },
  },
  security: {
    csrf: false,
    // cors 跨域访问白名单
    domainWhiteList: [ 'loc.4sme.cn', 'www.dev.4sme.cn', 'www.dev2.4sme.cn' ],
  },
  jwt: {
    secret: 'jwtsecret_dev', // 指定生成token密钥
    options: {
      algorithm: 'HS256', // default HS256
      expiresIn: 60 * 60, // 过期时间时间戳格式 单位秒  Eg: 60, "2 days"
      audience: 'www.4sme.cn', // 接收该JWT的一方
      issuer: '4sme', // jwt签发者
      subject: 'admin@4sone.com', // 该JWT所面向的用户
    },
    verify_options: {
      ignoreExpiration: true,
    },
  },
  /**
   * rabbitmq 配置
   * 在云杉系统启动时会在app下注册一个mq服务
   */
  rabbitmq: {
    url: 'amqp://admin:spruce_admin@172.26.0.9',
    socketOptions: '',
  },
  proxy: {
    usercenter: 'user.dev.4sme.cn', // 用户中心服务地址
    nestcenter: 'nest.dev.4sme.cn', // 业务中心服务地址
    bmswechat: 'wx.dev.4sme.cn', // 微信服务地址
  },
  oss_access: {
    key_id: 'LTAIIBto8Tc4NBGg',
    key_secret: 'BbEu1B2k3eGzudqt4xNU6dxFuCErrf',
    host: 'devimg.4sstar.cn',
    bucket: 'image-develop',
    expiration: 3600 * 1000,
  },

  schedule: {
    timer_rule_task: '0 */10 * * * *', // 本地开发，测试环境每10分钟一次
    cycle_event_task: '0 */10 * * * *', // 本地开发，测试环境每10分钟一次
    reaward_rule: '0 0 1 * * *', // 奖励提成 本地开发
  },
};
