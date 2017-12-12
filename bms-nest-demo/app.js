'use strict';

const Paginate = require('./app/common/paginate');
const Const = require('./app/common/const');
const { SpruceError, ErrorStatus } = require('./app/common/spruce_error');

module.exports = app => {


  app.beforeStart(function* () {
    // 应用会等待这个函数执行完成才启动
    yield app.initApp();
  });


  /**
   * 对controller 进行扩展 ，便于操作
   */
  class BaseController extends app.Controller {

    /**
     * 构造方法
     * @param {object} ctx context 上下文
     * @memberof BaseController
     */
    constructor(ctx) {
      super(ctx);
      // 分页保留的关键字
      const page = this.ctx.request.body.page;
      const size = this.ctx.request.body.size;
      if (page) {
        this.ctx.request.body.page = parseInt(page);
      }
      if (size) {
        this.ctx.request.body.size = parseInt(size);
      }
      this.inputParam = {};
      if (this.paginate) {
        this.inParam.paginate = this.paginate;
      }
    }

    set inParam(inputParam) {
      let k,
        name;
      for (k in inputParam) {
        name = inputParam[k];
        const value = this.getParam(name);
        this.inputParam[k] = value;
      }
    }


    /**
     * 输入参数
     *
     * @memberof BaseController
     */
    get inParam() {
      return (!this.inputParam) ? {} : this.inputParam;
    }
    /**
     * 输入参数对象
     *
     * @memberof BaseController
     */
    get params() {
      return this.ctx.request.body;
    }

    /**
     * 获取参数值
     *
     * @author Tim
     * @param {any} name 参数名
     * @return {object} 参数值
     * @memberof BaseController
     */
    getParam(name) {
      let value = this.ctx.request.body[name];
      if (!value || (value === undefined)) {
        value = null;
      }
      return value;
    }

    /**
     * 根据名称获取service对象
     *
     * @author Tim
     * @param {string} name service名称
     * @return {service} service对象
     * @memberof BaseController
     */
    getService(name) {
      return this.ctx.service[name];
    }


    get paginate() {
      if (this.getParam('page')) {
        const paginate = new Paginate();
        paginate.page = parseInt(this.getParam('page'));
        paginate.size = parseInt(this.getParam('size'));
        return paginate;
      }
    }

    /**
     * response 成功响应
     *
     * @author Tim
     * @param {json} result 返回结果
     * @memberof BaseController
     */
    success(result) {
      const body = {};
      body.status = Const.status.success;
      if (typeof result === 'string') {
        body.message = result;
      } else {
        body.data = result;
      }
      this.ctx.body = body;
    }
    /**
     * response 错误响应
     *
     * @author Tim
     * @param {json} result 返回结果
     * @memberof BaseController
     */
    error(result) {
      let body = {};
      if (result && (result instanceof SpruceError)) {
        body = result.toString();
      } else {
        body = {
          status: ErrorStatus.systemError.status,
          message: result,
          errorDetail: result,
        };
      }
      this.ctx.body = body;
    }
    /**
     * response 404 not found
     *
     * @author Tim
     * @param {json} msg 返回结果
     * @memberof BaseController
     */
    notFound(msg) {
      msg = `${msg} not found!`;
      this.ctx.status = 404;
      this.ctx.body = {
        status: ErrorStatus.notFound.status,
        message: `${msg} ${ErrorStatus.notFound.message}`,
        errorDetail: msg,
      };
    }

    /**
   * validate data with rules
   *
   * @param  {Object} rules  - validate rule object,
   * @param  {Object} [data] - validate target, default to `this.request.body`
   */
    validate(rules, data) {
      this.ctx.validate(rules, data);
    }
  }

  /**
*  对Service 进行扩展
*/
  class BaseService extends app.Service {
    /**
     * 定义Service的logger的属性，相当于 this.ctx.logger
     */
    get logger() {
      return this.ctx.logger;
    }

    /**
   * 获取model
   * 根据 name 获取 mongo model
   * @author Tim
   * @param {string} name model名称
   * @return {model} 数据库model
   * @memberof BaseService
   */
    getModel(name) {
      return this.ctx.getModel(name);
    }
  }

  app.Service = BaseService;
  app.Controller = BaseController;
};

