'use strict';

const { SpruceError, ErrorStatus } = require('../common/spruce_error');
module.exports = () => {
  return function* errorHandler(next) {
    try {
      // throw new SpruceError(ErrorStatus.uriError);
      yield next;
      if (this.status !== 200) {
        if (!this.body) {
          switch (this.status) {
            case 404:
              this.body = ErrorStatus.notFound;
              this.body.errorDetail = this.request.path;
              break;
            default:
              // 默认内部错误
              this.body = ErrorStatus.internalError;
              this.body.errorDetail = this.body.message;
              break;
          }
        }
      }
    } catch (err) {
      // 注意：自定义的错误统一处理函数捕捉到错误后也要 `app.emit('error', err, this)`
      // 框架会统一监听，并打印对应的错误日志
      this.app.emit('error', err, this);
      this.logger.error(err);
      let errorStatus = ErrorStatus.systemError;
      let errorDetail = err.message;
      if (err instanceof EvalError) {
        errorStatus = ErrorStatus.evalError;
      } else if (err instanceof RangeError) {
        errorStatus = ErrorStatus.rangeError;
      } else if (err instanceof SyntaxError) {
        errorStatus = ErrorStatus.syntaxError;
      } else if (err instanceof TypeError) {
        errorStatus = ErrorStatus.typeError;
      } else if (err instanceof URIError) {
        errorStatus = ErrorStatus.uriError;
      } else if (err instanceof ReferenceError) {
        errorStatus = ErrorStatus.referenceError;
      } else if (err instanceof SpruceError) {
        errorStatus = err.toString();
      } else if (err.message === 'Validation Failed') {
        errorStatus = ErrorStatus.validateError;
        errorDetail = err.errors;
        // if (this.app.config.env !== 'prod') {
        //   errorStatus.message = err.errors;
        // }
      }
      const errorBody = errorStatus;
      errorBody.errorDetail = errorDetail;
      this.body = errorBody;
    }
  };
};
