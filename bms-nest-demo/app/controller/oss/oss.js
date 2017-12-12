'use strict';
const ValidateOss = require('../../validate/oss');
module.exports = app => {
  class OssController extends app.Controller {

    * signature() {
      // this.validate(ValidateOss.signature);
      // const path = this.params.path;
      const path = 'compay/';
      const data = yield this.getService('oss').signature(path);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }

    * delete() {
      this.validate(ValidateOss.deleteFile);
      const param = this.params;
      const data = yield this.getService('oss').deleteFile(param);
      this.success('删除成功');
    }
  }

  return OssController;
};
