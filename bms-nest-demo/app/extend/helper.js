'use strict';
const Const = require('../common/const');
const crypto = require('crypto');
module.exports = {
  /**
   * 获取token的cache
   * @author Tim
   * @return {Object} 缓存
   */
  getTokenCache() {
    const tokenRedisConfig = this.app.config.tokenRedis;
    const name = tokenRedisConfig.name;
    const cache = this.app.redis.get(name);
    return cache;
  },

  /**
   * 缓存用户信息
   *
   * @author Tim
   * @param {String} token 用户token
   * @param {Object} user 用户信息
   */
  * setUserCache(token, user) {
    const cache = this.getTokenCache();
    // 设置token 有效时长
    const maxAge = this.getUserMaxAge();
    const key = this.reduceToken(token);
    cache.set(key, user, 'PX', maxAge);
  },

  hiddenPhone(phone) {
    if (!phone) {
      return null;
    }
    const length = phone.length;
    const data = phone.substr(0, length - 8) + '****' + phone.substr(length - 4);
    return data;
  },

  encryptPassword(password) {
    if (!password) {
      return null;
    }
    const encryption = crypto.createHmac('sha1', this.app.config.secret).update(password).digest();
    const pwd = encryption.toString('base64');
    return pwd;
  },

  /**
   * 根据token获取缓存中用户信息
   *
   * @author Tim
   * @param {String} token token值
   * @return {Object} 用户信息
   */
  * getUserCache(token) {
    if (!token) return;
    const key = this.reduceToken(token);
    const user = yield this.getTokenCache().get(key);
    // console.log('helper   getUserCache:'+JSON.stringify(user));
    return user;
  },
  /**
   *  user cache  根据token获取用户信息
   *
   * @author Tim
   * @param {string} token 用户token
   * @return {json} 用户信息
   */
  * getUser(token) {
    if (!token) return;
    let user = yield this.getUserCache(token);
    // console.log('helper   getUser:' + user);
    // console.log('app.proxy   :' + this.app.proxy);
    // 如果未找到用户信息并且设置了代理服务就使用代理服务获取me信息
    // 此处在BMS 中只允许Gateway 使用，其他业务子系统不允许使用
    if (!user && (this.app.isGateway)) {
      const service = new this.app.proxy.user.me({ token });
      const result = yield service.curl();
      // console.info('login user :' + JSON.stringify(result));
      // 认证失败
      if (result.status === Const.status.error) {
        console.error('login error :' + JSON.stringify(result));
        return;
      }
      user = JSON.stringify(result.data);
    }
    return user;
  },

  /**
   * @author liuzl
   * @param {String} token 用户token
   * @return {*} 合法返回json token 不合法返回false
   * @description 验证token是否合法
   */
  authToken(token) {
    const secret = this.app.config.jwt.secret;
    const options = this.app.config.jwt.verify_options;
    return this.app.myutil.authToken(token, secret, options);
  },


  /**
   * @author liuzl
   * @param {Object} payload - 数据元素data
   * @return {*} - 返回包含数据元素的token
   */
  generateToken(payload) {
    // const payload = {
    //   shopId: 1,
    //   userId: 2
    // };
    const secret = this.app.config.jwt.secret;
    const options = this.app.config.jwt.options;
    return this.app.myutil.generateToken(payload, secret, options);
  },

  /**
   * 為了便於緩存，將token名稱進行簡化處理
   *
   * @author Tim
   * @param {String} token 原始的token名
   * @return {String} 簡化后的token名
   */
  reduceToken(token) {
    return token.split('.')[2];
  },
  getUserMaxAge() {
    const tokenRedisConfig = this.app.config.tokenRedis;
    // 设置token 有效时长
    const maxAge = tokenRedisConfig.maxAge;
    return maxAge;
  },
  /**
   * 刷新用户缓存
   *
   * @author Tim
   * @param {String} token token信息
   */
  flushUserCache(token) {
    if (!token) return;
    const key = this.reduceToken(token);
    const cache = this.getTokenCache();
    // console.info(`******************FLUSH CACHE**********************`);
    cache.pexpire(key, this.getUserMaxAge());
  },
};
