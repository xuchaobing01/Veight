'use strict';
const moment = require('moment');
moment.locale('zh-cn');

const Const = require('./const');
const { DATETIME_FORMAT, DAY_BEGIN_FORMAT, DAY_END_FORMAT } = Const;
const taskConst = Const.task;

/**
 * 工具类
 *
 * @class Util
 */
class Util {
  static merge(dest, src) {
    const slice = [].slice;
    console.info('dest:' + JSON.stringify(dest));
    console.info('src:' + JSON.stringify(src));
    src = slice.call(arguments, 1);
    let j,
      key,
      len,
      object,
      value;
    for (j = 0, len = src.length; j < len; j++) {
      object = src[j];
      for (key in object) {
        value = object[key];
        dest[key] = value;
      }
    }
    console.info('merge:' + JSON.stringify(dest));
    return dest;
  }
  static isEmptyObject(obj) {
    return !obj || (Object.keys(obj).length === 0);
  }

  static getIPAdress() {
    const interfaces = require('os').networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  /**
   * 获得已格式化的当前时间
   *
   * @author Tim
   * @static
   * @return  {date} 格式化后的日期
   * @memberof Util
   */
  static now() {
    return moment().format(DATETIME_FORMAT);
  }
  /**
   * 获得一天的格式化后开始时间 2017-05-11 00:00:00
   * @param {any} date 日期
   * @author Tim
   * @static
   * @return  {date} 格式化后的日期
   * @memberof Util
   */
  static dayStart(date) {
    return moment(date || new Date()).format(DAY_BEGIN_FORMAT);
  }
  /**
   * 获得一天的格式化后结束时间 2017-05-11 23:59:59
   * @param {any} date 日期
   * @author Tim
   * @static
   * @return  {date} 格式化后的日期
   * @memberof Util
   */
  static dayEnd(date) {
    return moment(date || new Date()).format(DAY_END_FORMAT);
  }
  /**
   * 日期格式化
   *
   * @author Tim
   * @static
   * @param {any} data 日期
   * @param {any} fmt 格式化字符串 默认'yyyy-mm-dd HH:MM:ss'
   * @return {date} 格式化后的日期
   * @memberof Util
   */
  static dateFormat(data, fmt) {
    if (data === null) {
      return null;
    }
    return moment(data).format(fmt || DATETIME_FORMAT);
  }
  /**
   * 日期加减秒数
   *
   * @author Tim
   * @static
   * @param {any} date 日期
   * @param {any} second  单位：秒
   * @return {date} date 新的日期时间
   * @memberof Util
   */
  static dateAddSecond(date, second) {
    const newDate = date.valueOf() + second * 1000;
    return new Date(newDate);
  }
  /**
   * 日期加减天数
   *
   * @author Tim
   * @static
   * @param {any} date 日期
   * @param {any} days  单位：天
   * @return {date} date 新的日期时间
   * @memberof Util
   */
  static dateAddDays(date, days) {
    const second = days * 24 * 60 * 60;
    return Util.dateAddSecond(date, second);
  }

  /**
   * 日期加减小时
   *
   * @author Tim
   * @static
   * @param {any} date 日期
   * @param {any} minutes  单位：分钟
   * @return {date} date 新的日期时间
   * @memberof Util
   */
  static dateAddMinute(date, minutes) {
    const second = minutes * 60;
    return Util.dateAddSecond(date, second);
  }


  /**
   * 日期加减年份
   *
   * @author Tim
   * @static
   * @param {any} date 日期
   * @param {any} year  单位：年
   * @return {date} date 新的日期时间
   * @memberof Util
   */
  static dateAddYear(date, year) {
    date.setFullYear(date.getFullYear() + year);
    return date;
  }
  /**
   * 数组去重
   *
   * @author Tim
   * @static
   * @param {any} arr 数组
   * @return {array} 数组
   * @memberof Util
   */
  static unqiue(arr) {
    const result = [];
    const hash = {};
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i].user.name;
      if (!hash[elem]) {
        result.push(arr[i]);
        hash[elem] = true;
      }
    }
    return result;
  }
  /**
  * 获取当前用户在任务中的状态
   *
   * @author Tim
    * @static
    * @param {any } userId  用户id
    * @param {any } task  任务对象
    * @return {obj} {role:参与角色,status:状态,isRead:是否已读,isOverdule:是否逾期}
    * @memberof Util
   */
  static userInTask(userId, task) {
    let result = {
      role: null, // 当前角色
      other_role: [], // 其他角色
      status: null, // 当前状态
      isOverdule: null, // 是否逾期
    };
    if (!task || !userId) {
      console.log(`Util.userInTask error! \n userId:${userId} \n task:${JSON.stringify(task)}`);
      return result;
    }
    // 如果是作废任务直接返回不需要判断角色,是否逾期
    if (task.status === Const.task.status.cancellation) {
      result.status = Const.task.status.cancellation;
      return result;
    }
    // 判断创建者
    if (userId === task.creator.id) {
      result = {
        role: taskConst.role.creator,
        other_role: [],
        status: task.status,
        isOverdule: task.status === taskConst.status.overdule,
      };
    } else {
      const users = task.executor;
      // 判断是否是执行者
      const isExecutor = users.some(function(executor) {
        const exist = (executor.user.id === userId);
        if (exist) {
          result = {
            role: taskConst.role.executor,
            other_role: [],
            status: executor.status,
            isRead: executor.is_read,
            // 是否逾期。任务已完成就不算逾期；逾期：任务未完成并且已逾期
            isOverdule: ((task.status === taskConst.status.finish) || (executor.status === taskConst.status.finish)) ?
              false : (task.status === taskConst.status.overdule),
          };
        }
        return exist;
      });
      if (!isExecutor || (isExecutor && result.status === taskConst.status.finish)) {
        // 是否是关注人
        let isFollower = false;
        // 关注者中查找
        task.follower.forEach(follower => {
          if (userId === follower.user.id) {
            // 关注人可能会出现多次，如果存在未跟进的情况需要指出当前用户需要跟进
            if (!isFollower || follower.status === taskConst.status.inProgress) {
              result = {
                role: taskConst.role.follower,
                status: follower.status,
                other_role: [],
                // 是否逾期。任务已完成就不算逾期；逾期：被跟进人为空说明已全部完成任务
                isOverdule: ((task.status === taskConst.status.finish) || (!follower.tracked) || follower.tracked.length === 0) ?
                  false : (task.status === taskConst.status.overdule),
              };
            }
            isFollower = true;
          }
        });
        // 处理双重角色身份
        if (isExecutor) {
          result.other_role.push(taskConst.role.executor);
        }
      }
    }
    return result;
  }
  /*
   * 判断是否是定时器执行节点
   */
  static isTimerNode(ctx) {
    if (process.env.IS_TIMER_NODE === 'yes' ||
      ctx.app.config.env === 'local' ||
      ctx.app.config.env === 'unittest') {
      return true;
    }
    return false;
  }
  /*
   * json对象 值比较
   */
  static jsonValueEqual(a, b) {
    const keys = Object.keys(a);
    if (keys.length === 0) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    let aValue,
      bValue,
      key;
    for (key of keys) {
      aValue = a[key];
      bValue = b[key];
      if (typeof aValue === 'object' && typeof bValue === 'object') {
        return Util.jsonValueEqual(aValue, bValue);
      } else if (aValue !== bValue) {
        return false;
      }
    }
    return true;
  }
  /*
   * 克隆对象
   */
  static clone(a) {
    return Object.assign({}, a);
  }
  /**
   * 与当前时间比较
   *
   * @author Su Shengxi
   * @param {any} dateValue 日期字符串 支持'yyyy-mm-dd HH:MM:ss' 、'yyyy/mm/dd HH:MM:ss'
   * @return {string} string
   * @memberof Util
   */
  static agoTime(dateValue) {
    try {
      let date = new Date(dateValue);
      const nowTime = new Date();
      const yearNow = nowTime.getFullYear();
      let dayNow = nowTime.getDate();
      let d_seconds = null;
      let d_minutes = null;
      let d_hours = null;
      let d_days = null;
      let d = null;
      const Y = date.getFullYear();
      let M = date.getMonth() + 1;
      let D = date.getDate();
      let H = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      // 小于10的在前面补0
      if (M < 10) {
        M = '0' + M;
      }
      if (D < 10) {
        D = '0' + D;
      }
      if (H < 10) {
        H = '0' + H;
      }
      if (m < 10) {
        m = '0' + m;
      }
      if (s < 10) {
        s = '0' + s;
      }
      if (dayNow < 10) {
        dayNow = '0' + dayNow;
      }
      const timeNow = parseInt(nowTime.getTime() / 1000);
      date = date / 1000;
      d = timeNow - date;
      d_days = parseInt(d / 86400);
      d_hours = parseInt(d / 3600);
      d_minutes = parseInt(d / 60);
      d_seconds = parseInt(d);
      if (d_seconds < 60) { // 小于60秒
        return '刚刚';
      } else if (d_minutes < 60 && d_minutes >= 1) { // 大于60秒小于1分钟
        return d_minutes + '分钟前';
      } else if (d_days < 1 && D !== dayNow) { // 大于60分钟过了24:00
        return '昨天' + H + ':' + m;
      } else if (d_minutes > 60 && d_days < 1 && dayNow === D) { // 大于60分钟小于1天
        return '今天' + H + ':' + m;
      } else if (d_days >= 1 && d_days < 2 && (dayNow - D === 1 || D - dayNow === 30 || D - dayNow === 29)) { // 1天以上2天内
        return '昨天' + H + ':' + m;
      } else if (Y === yearNow && (dayNow - D === 2 || D - dayNow === 29 || D - dayNow === 28)) { // 大于2天
        return '3天前';
      } else if ((dayNow - D >= 3 || D - dayNow <= 27 || D - dayNow <= 28 || D - dayNow <= 27) && Y === yearNow) { // 大于3天且是当年
        return M + '月' + D + '日' + H + ':' + m;
      } else if (Y < yearNow) {
        return Y + '.' + M + '.' + D;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * 字符串转布尔
     *
     * @author Su Shengxi
     * @param {any} t 字符串 布尔值 ..'
     * @return {boole} boolean
     * @memberof Util
     */
  static stringToBool(t) {
    if (t && typeof (t) === 'string') {
      if (t === 'true') {
        return true;
      } else if (t === 'false') {
        return false;
      }
    }
    return t;
  }

  // 对象比较
  // 已对_id作特殊处理
  static deepcmp(newdata, olddata) {
    const rest = { c: 0, ds: [] };
    function compare(newdata, olddata) {
      if (typeof newdata === 'object') {
        if (Array.isArray(newdata) !== Array.isArray(olddata)) {
          rest.c = 1;
          rest.ds.push({ des: 'not all array', value: [ newdata, olddata ] });
          return;
        }
        if (Array.isArray(newdata) && (newdata.length !== olddata.length)) {
          rest.c = 1;
          rest.ds.push({ des: 'diff array length', value: [ newdata, olddata ] });
          return;
        }
        for (const [ k, v ] of Object.entries(newdata)) {
          if (k === '_id') {
            compare(v.toString(), olddata[k].toString());
          } else {
            compare(v, olddata[k]);
          }
        }
      } else {
        if (!Object.is(newdata, olddata)) {
          rest.c = 1;
          rest.ds.push({ des: 'diff value', value: [ newdata, olddata ] });
        }
      }
    }
    compare(newdata, olddata);
    console.log('deepcmp\'s result:',
      JSON.stringify(newdata), JSON.stringify(olddata), JSON.stringify(rest));
    return rest;
  }

  // 前段传的参数与数据库不匹配时，对象属性改名
  static objrename(obj, oldNames, newNames) {
    if (!obj) return;
    for (const [ i, oldname ] of Object.entries(oldNames)) {
      if (!obj[oldname] && obj[newNames[i]]) {
        console.log(' objrename error %s::%s::%s', oldname, newNames[i], JSON.stringify(obj));
        throw new Error('对象属性改名失败');
      }
      obj[newNames[i]] = obj[oldname];
      delete obj[oldname];
    }
    return obj;
  }


}
module.exports = exports = Util;
