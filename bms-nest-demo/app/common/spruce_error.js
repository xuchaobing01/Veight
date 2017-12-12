'use strict';
const ErrorStatus = require('./error_status');
/**
 * 自定义异常
 *
 * @author Tim
 * @class SpruceError
 * @extends {Error}
 */
class SpruceError extends Error {
  /**
   * Creates an instance of SpruceError.
   * @author Tim
   * @param {any} arg arg 支持构造方式:
   * SpruceError(message)、SpruceError(errorStatus,message) 、SpruceError(errorStatus,message,detail) 、SpruceError({errorStatus,message,detail})
   * @memberof SpruceError
   */
  constructor(...arg) {
    if (typeof arg[0] === 'object') {
      const { status, message, detail } = arg[0];
      super(message);
      this.status = status;
    } else {
      let { status, message, detail } = ErrorStatus.systemError;
      switch (arg.length) {
        case 0:
          // 不做任何操作,使用默认值
          break;
        case 1:
          message = arg[0];
          detail = message;
          break;
        case 2:
          status = arg[0];
          message = arg[1];
          detail = message;
          break;
        default:
          status = arg[0];
          message = arg[1];
          detail = arg[2];
          break;
      }
      super(message);
      this.status = status;
      this.errorDetail = detail;
    }
  }

  // 重写toString 方法
  toString() {
    return {
      status: this.status,
      message: this.message,
      errorDetail: this.message,
    };
  }
}
/**
 * SpruceError 定义
 * new SpruceError('输入信息错误!')
 * new SpruceError(ErrorStatus.internalError)
 */

module.exports = { SpruceError, ErrorStatus };
