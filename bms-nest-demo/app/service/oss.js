'use strict';

const moment = require('moment');
const crypto = require('crypto');
const request = require('superagent');

module.exports = app => {
  class OssService extends app.Service {

    * signature(path) {
      const data = {};
      data.key_id = app.config.oss_access.key_id;
      data.url = app.config.oss_access.host;

      const policy = yield this.buildPolicy();
      const policyBuffer = new Buffer(policy);
      data.policy = policyBuffer.toString('base64');
      data.signature = yield this.createSignture(data.policy);
      data.path = path;

      return data;
    }

    * deleteFile(param) {
      const xml = yield this.bulidDelXml(param);

      const initData = {
        AccessKeyId: app.config.oss_access.key_id,
        AccessKeySecret: app.config.oss_access.key_secret,
        Host: 'img.4sone.com?delete',
        Bucket: 'spruceimage',
        API: 'DeleteMultiple',
        Content: xml,
      };
      const OssData = yield this.bulidOssData(initData);
      // 请求远程接口，删除附件
      const result = yield this.buildDeleteRequest(initData.Host, xml, OssData);
    }

    * buildPolicy() {
      const date_number = app.config.oss_access.expiration + new Date().getTime();
      const formate_date = moment(date_number).format('YYYY-MM-DD\THH:mm:ss\.000') + '\Z';// 2017-08-02T16:38:32.000Z

      const policy = {
        expiration: formate_date,
        conditions: [[ 'content-length-range', 0, 5242880 ]],
      };

      const content = JSON.stringify(policy);
      return content;
    }

    * createSignture(param) {
      const Signture = crypto.createHmac('sha1', app.config.oss_access.key_secret);// 定义加密方式
      Signture.update(param);
      const signture = Signture.digest().toString('base64');// 生成的密文后将再次作为明文再通过pbkdf2算法迭代加密；
      return signture;
    }

    * bulidDelXml(param) {
      const keys = param.keys;
      let strs = new [].constructor();
      strs = keys.split(','); // 字符分割

      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<Delete>';
      xml += '<Quiet>true</Quiet>';

      let i;
      for (i = 0; i < strs.length; i++) {
        xml += '<Object>';
        xml += '<Key>' + strs[i] + '</Key>';
        xml += '</Object>';
      }

      xml += '</Delete>';

      return xml;
    }

    * bulidOssData(param) {
      const data = {};

      data.VERB = 'POST';
      data.ContentType = 'text/xml';
      data.ContentLength = param.Content.length;

      // 先md5加密再base64编码
      const md5 = crypto.createHash('md5');
      data.ContentMD5 = md5.update(param.Content).digest().toString('base64');

      const date_number = new Date().getTime();
      data.Date = moment(date_number).format('D, d M Y H:i:s') + ' GMT';
      data.Resource = '/' + param.Bucket + '/?delete';

      const signature_str = '{' + data.VERB + '\n\r' + data.ContentMD5 + '\n\r' + data.ContentType + '\n\r' + data.Date + ',' + data.OSSHeaders + '\n\r' + data.Resource + '}';
      const signature = yield this.createSignture(signature_str);
      data.Authorization = 'OSS' + param.AccessKeyId + ':' + signature;

      return data;
    }

    * buildDeleteRequest(host, xml, info) {
      request.post(host + '/?delete')
        // 设置请求头
        .set('Date', info.Date)
        .set('Content-Type', info.ContentType)
        .set('Content-Length', info.ContentLength)
        .set('Content-MD5', info.ContentMD5)
        .set('Authorization', info.Authorization)
        // 超时时间
        .timeout(5184000)
        .type('xml')
        .send(xml)
        .withCredentials()
        .end(function(err, res) {
          if (res.error) {
            console.log('oh no ' + res.error.message);
          } else {
            console.log('got ' + res.status + ' response');
          }
        });
    }
  }
  return OssService;
};
