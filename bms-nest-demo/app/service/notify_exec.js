'use strict';

const Const = require('../common/const');
const Util = require('../common/util');

module.exports = app => {
  class NotifyExecService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.timerType = 'notify_timer';
    }

    // 扫描任务，生成提醒
    * scanTaskNotity() {
      const logger = this.ctx.logger;
      logger.info('!!! notify_exec service -- scanTaskNotity');

      this._initTimerExec();

      try {

        // 设置任务执行
        yield this._setTimeRngBegin();

        // 到提醒时间的任务
        const aheadTask = yield this.aheadNotify();

        // 逾期的任务
        const overdueTask = yield this.overdueNotify();

        // 需要跟进的任务
        const trackTask = yield this.trackNotify();

        yield this._end();
        return {
          aheadTask,
          overdueTask,
          trackTask,
        };
      } catch (ex) {
        logger.error('notify_timer exception-end | ', ex);
        yield this._expetionEnd();

        return {
          aheadTask: [],
          overdueTask: [],
          trackTask: [],
        };
      }

    }

    // 初始化执行对象
    _initTimerExec() {
      const now = Util.now();
      this.timeExec = {
        timer_type: this.timerType,
        exec_time: {
          begin: now,
          end: null,
        },
        desc: '',
        time_rng: {
          begin: null,
          end: now,
        },
        stage: 1,
      };
    }

    // 获取最后执行的截止时间
    * _setTimeRngBegin() {
      const timerExecModel = this.ctx.getModel('timer_exec');

      const timerExec = yield timerExecModel.findOne({
        timer_type: this.timerType,
      }, {}, {
        sort: {
          'exec_time.end': -1,
        },
      });
      this.timeExec.time_rng.begin = (timerExec != null) ? timerExec.time_rng.end : Const.LastTime;
    }

    // 提前提醒
    * aheadNotify() {
      const q = {
        'reminder.alert_time': {
          $gte: this.timeExec.time_rng.begin,
          $lt: this.timeExec.time_rng.end,
        },
        status: {
          $in: [ Const.task.status.default,
            Const.task.status.inProgress,
            Const.task.status.overdule,
            Const.task.status.track ],
        },
        delete: {
          $eq: Const.task.delete.default,
        },
      };

      const taskModel = this.ctx.getModel('task');
      const notifyService = this.ctx.getService('notify');

      let tasks = yield taskModel.find(q);

      // 过滤掉已经逾期
      tasks = tasks.filter(v => {
        return (new Date(v.end_time) > new Date(this.timeExec.time_rng.end));
      });

      const toNotifys = tasks.map(function(task) {
        return notifyService.taskNotity(task, Const.TaskAction.ahead);
      });

      yield this.app.myutil.parallel(toNotifys, 5);

      const taskIds = this._taskIds(tasks);
      this.timeExec.desc += `ahead toNotifys ok,count:${tasks.length},taskid:${taskIds};`;
      return tasks;
    }

    _taskIds(tasks) {
      const tIds = tasks.map(t => { return t._id.toString(); });
      return tIds.join();
    }

    // 逾期提醒
    * overdueNotify() {
      const taskModel = this.ctx.getModel('task');

      const tasks = yield taskModel.find({
        end_time: {
          $gte: this.timeExec.time_rng.begin,
          $lt: this.timeExec.time_rng.end,
        },
        status: {
          $in: [ Const.task.status.default,
            Const.task.status.inProgress,
            Const.task.status.overdule,
            Const.task.status.track ],
        },
        delete: {
          $eq: Const.task.delete.default,
        },
      });


      const toTasks = tasks.map(task => {
        return this._catchNotifyOverDue(task);
      });

      yield this.app.myutil.parallel(toTasks, 5);

      const taskIds = this._taskIds(tasks);
      this.timeExec.desc += `overdue toTasks ok,count:${tasks.length},taskid:${taskIds};`;
      return tasks;
    }

    * _catchNotifyOverDue(task) {
      const taskService = this.ctx.getService('task');
      let msgs = null;
      try {
        msgs = yield taskService.notifyOverDue(task);
      } catch (exception) {
        this.ctx.logger.error(`### taskService.notifyOverDue error,task_id:${task._id}`);
        this.ctx.logger.error(exception);
        this.timeExec.desc += `o!:${task._id},`;
      }
      return msgs;
    }

    // 跟进提醒
    * trackNotify() {
      const taskModel = this.ctx.getModel('task');

      const tasks = yield taskModel.find({
        tracke_time: {
          $gte: this.timeExec.time_rng.begin,
          $lt: this.timeExec.time_rng.end,
        },
        status: {
          $in: [ Const.task.status.default,
            Const.task.status.inProgress,
            Const.task.status.overdule,
            Const.task.status.track ],
        },
        delete: {
          $eq: Const.task.delete.default,
        },
      });

      const toTasks = tasks.map(task => {
        return this._catchNotifyTrack(task);
      });

      yield this.app.myutil.parallel(toTasks, 5);

      const taskIds = this._taskIds(tasks);
      this.timeExec.desc += `task toTasks ok,count:${tasks.length},taskid:${taskIds};`;
      return tasks;
    }

    * _catchNotifyTrack(task) {
      const taskService = this.ctx.getService('task');
      let msgs = null;
      try {
        msgs = yield taskService.notifyTrack(task);
      } catch (exception) {
        this.ctx.logger.error(`### taskService.notifyTrack error ,task_id:${task._id}`);
        this.ctx.logger.error(exception);
        this.timeExec.desc += `t!:${task._id},`;
      }
      return msgs;
    }

    * _end() {
      this.timeExec.stage = 2;
      this.timeExec.exec_time.end = Util.now();

      const timerExecModel = this.ctx.getModel('timer_exec');
      yield timerExecModel.create(this.timeExec);
    }

    * _expetionEnd() {
      this.timeExec.stage = 3;
      this.timeExec.exec_time.end = Util.now();

      const timerExecModel = this.ctx.getModel('timer_exec');
      yield timerExecModel.create(this.timeExec);
    }
  }

  return NotifyExecService;
};
