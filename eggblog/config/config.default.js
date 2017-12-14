'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512998913945_8748';

  // add your config here
  config.middleware = [];

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: '',
      // database
      database: 'veight',    
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.security = {
    csrf: false,
    // cors 跨域访问白名单
    //domainWhiteList: [ 'loc.4sme.cn', 'www.dev.4sme.cn', 'www.dev2.4sme.cn' ],
  };
  

  return config;
};
