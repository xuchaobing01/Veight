'use strict';

module.exports = {

  get isIOS() {
    const iosReg = /iphone|ipad|ipod/;
    return iosReg.test(this.get('user-agent'));
  },

  get isAndroid() {
    const androidReg = /Android|android/;
    return androidReg.test(this.get('user-agent'));
  },

  get isPC() {
    return !(this.isIOS || this.isAndroid);
  },

  get acceptJSON() {
    // if (this.get('x-request-with') === 'XMLHttpRequest') return 'json';
    // return 'html';
    return 'json';
  },

  set me(user) {
    this.currentUser = user;
    this.shopId = user.shop_id;
    this.userId = user._id;
  },
  get me() {
    return this.currentUser;
  },

  // // 4s店id
  // set shopId(shop_id) {
  //   this.shop_id = shop_id;
  // },
  // get shopId() {
  //   return this.shop_id;
  // },
  // 用户id
  set userId(user_id) {
    this.user_id = user_id;
  },
  get userId() {
    return this.user_id;
  },
  /**
   * 根据name获取mongo model
   *
   * @author Tim
   * @param {string} name model名稱
   * @return {model} mongo model
   */
  getMongoModel(name) {

    const model = this.app.mongoose.models[name];
    // 继承于BaseSchema的shcema需要设置当前用户信息
    // if (model && model.schema instanceof BaseSchema) {
    //   // 这是当前 schema的shopId
    //   console.info('shop_id:' + this.shopId);
    //   const field = {
    //     shop_id: this.shopId,
    //     // model : model,
    //     user_id: this.userId,
    //     schemaName: name,
    //   };
    //   model.schema.field = field;
    // }
    return model;
  },

  getOps(ops) {
    const user_ops = [];
    const me = this.me;
    if (me) {
      for (const prev of me.prev) {
        if (ops[prev]) {
          if (ops[prev] instanceof Array) {
            user_ops.push(...ops[prev]);
          } else {
            user_ops.push(ops[prev]);
          }
        }
      }
    }
    return Array.from(new Set(user_ops));
  },

  // /**
  //  * 根据name获取world库的model
  //  *
  //  * @author Tim
  //  * @param {string} name model名稱
  //  * @return {model} world庫model
  //  */
  // getWorldModel(name) {
  //   const domain = this.getConfig('sequelize').domain;
  //   return this.app[domain.name][name];
  // },

  /**
   * 获取model
   * 根据 name 获取 mongo和mysql model
   * model定义不允许重名，获取顺序mongo、company、world
   * @author Tim
   * @param {string} name model名称
   * @return {model} 数据库model
   */
  getModel(name) {
    // 先从mongo中查找model
    const model = this.getMongoModel(name);
    return model;
  },
  /**
     * 根据名称获取service对象
     *
     * @author Tim
     * @param {string} name service名称
     * @return {service} service对象
     * @memberof
     */
  getService(name) {
    return this.service[name];
  },
  /**
   * 获取 config
   * 根据 name 获取 config
   * @author Tim
   * @param {string} name 配置项名称
   * @return {value} 配置项
   */
  getConfig(name) {
    // console.info('ctx :'+name);
    return this.app.config[name];
  },

};
