'use strict';

module.exports = () => {
  return {
    /** *******************生产环境配置*************************/

    mongoose: {
      url: 'mongodb://192.168.0.240:27017/companys',
      options: {
        db: { native_parser: true },
        user: 'car4sstar',
        pass: 'b5be59d6a63ca538b3b4012f5b3f0e28',
      },
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

    rabbitmq: {
      url: 'amqp://admin:spruce_admin@172.26.0.9',
      socketOptions: '',
    },
    proxy: {
      usercenter: 'user.4sme.cn', // 用户中心服务地址
    },
    jwt: {
      secret: 'jwtsecret', // 指定生成token密钥
      options: {
        algorithm: 'HS256', // default HS256
        expiresIn: 60 * 60, // 过期时间时间戳格式 单位秒  Eg: 60, "2 days"
        audience: 'www.4sstar.com', // 接收该JWT的一方
        issuer: '4sone', // jwt签发者
        subject: 'admin@4sone.com', // 该JWT所面向的用户
      },
    },
    oss_access: {
      key_id: 'LTAIIBto8Tc4NBGg',
      key_secret: 'BbEu1B2k3eGzudqt4xNU6dxFuCErrf',
      host: 'devimg.4sstar.cn',
      bucket: 'image-develop',
      expiration: 3600 * 1000,
    },
    schedule: {
      timer_rule_task: '0 0 7 * * *', // 默认每天 7 点执行一次
      reaward_rule: '0 0 1 * * *', // 奖励提成  每天 1 点执行一次
    },
  };
};
