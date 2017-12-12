'use strict';

const Const = require('../common/const');
const Util = require('../common/util');

module.exports = app => {
  class NotifyService extends app.Service {

    // 对任务，生成提醒
    * taskNotity(task, action, executor_id = null) {
      const logger = this.ctx.logger;
      if (typeof (action) === 'string') {
        action = parseInt(action);
      }
      logger.info('!!!! notify service -- taskNotity:', task._id, action, executor_id);

      return yield this._taskNotity(task, action, executor_id);
    }

    // 扫描持续延期，生成提醒
    * scanLaterOverdueTaskNotity() {
      const logger = this.ctx.logger;
      logger.info('!!! notify service -- scanLaterOverdueTaskNotity:');

      let msgs = null;
      try {
        const tasks = yield this._scanLaterOverdue();
        const toTasks = tasks.map(task => {
          return this._taskNotity(task, Const.TaskAction.laterOverdue);
        });

        msgs = yield app.myutil.parallel(toTasks, 5);
        // this.ctx.logger.info('notify_overdue ok-end');
      } catch (ex) {
        this.ctx.logger.error('notify_overdue exception :', ex);
      }
      return msgs;
    }

    * _scanLaterOverdue() {
      const taskModel = this.ctx.getModel('task');
      const yestdayTime = Util.dateFormat(Date.now() - 24 * 60 * 60 * 1000); // 昨天的当前时间

      const tasks = yield taskModel.find({
        end_time: {
          $lt: yestdayTime,
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
      return tasks;
    }

    // 对任务，生成提醒
    * _taskNotity(task, action, executor_id) {

      // 构建消息
      const msgs1 = this._makeMsgs(task, action, executor_id);
      const msgs = msgs1.filter(v => {
        return v.receviver.id;
      });

      // 增加微信标记
      const userService = this.ctx.getService('user');

      const tousers = msgs.map(msg => {
        return userService.detail(msg.receviver, { wechat: 1 });
      });
      const users = yield app.myutil.parallel(tousers, 5);

      msgs.forEach((v, i) => {
        v.open_id = (users[i] && users[i].wechat && users[i].wechat.open_id) ? users[i].wechat.open_id : null;
      });

      // 发布消息
      if (msgs.length > 0) {
        const toPubs = msgs.map(function(msg) {
          if (msg.receviver.from === 'bee_user') {
            return app.mqPublisher.notifyBee.notify(msg);
          } else if (msg.receviver.from === 'shop_user') {
            return app.mqPublisher.notifyShop.notify(msg);
          }
          return app.mqPublisher.notifyPlat.notify(msg);

        });

        yield app.myutil.parallel(toPubs, 5);
      }

      return msgs;
    }

    // 构建消息
    _makeMsgs(task, action, executor_id) {
      const creator = task.creator;
      const executors = task.executor;
      const task_id = task._id.toString();

      let msgs;
      switch (action) {
        case Const.TaskAction.new:
          msgs = this._newMsg(creator, executors, task_id);
          break;
        case Const.TaskAction.update:
          msgs = this._updateMsg(creator, executors, task_id);
          break;
        case Const.TaskAction.finish:
          msgs = this._finishMsg(task, executor_id);
          break;
        case Const.TaskAction.end:
          msgs = this._endMsg(creator, executors, task_id);
          break;
        case Const.TaskAction.msg:
          msgs = this._msgMsg(task);
          break;
        case Const.TaskAction.to_track:
          msgs = this._to_trackMsg(task);
          break;
        case Const.TaskAction.ahead:
          msgs = this._aheadMsg(task);
          break;
        case Const.TaskAction.overdue:
          msgs = this._overdueMsg(creator, executors, task_id);
          break;
        case Const.TaskAction.laterOverdue:
          msgs = this._laterOverdueMsg(creator, executors, task_id);
          break;
        default:
          msgs = [];
      }

      return msgs;
    }

    // 2个时间的分钟差
    _beforeMinute(to, from = null) {
      if (from === null) {
        from = Util.now();
      }

      return parseInt((new Date(to) - new Date(from)) / 1000 / 60);
    }

    // 创建初始消息
    _newInitMsg(task_id) {
      const msg = {
        notify_type: null,
        notify_content: null,
        time: Util.now(),
        receviver: null,
        task_id,
        tlt_id: 1,
      };
      msg.task_id = task_id;
      return msg;
    }

    // 新任务提醒
    _newMsg(creator, executors, task_id) {


      // 要提醒的执行人
      let execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      let msgs1 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '新任务';
        msg.notify_content = `${creator.name}给你发了一个任务`;
        msg.receviver = executor.user;
        return msg;
      });
      // 如果是自建任务才提醒上级，系统创建任务不提醒
      if (creator.id !== Const.system.id) {
        // 要提醒的上级
        execs = executors.filter(function(executor) {
          return executor.leader && executor.leader.id && executor.status !== Const.TaskStatus.finish && creator.id !== executor.leader.id;
        });
        const leaders = [];
        execs.forEach(function(value) {
          const in_leader = leaders.find(function(l) {
            return l.l.id === value.leader.id;
          });

          if (in_leader === undefined) {
            const t = {
              l: value.leader,
              u: [ value.user.name ],
            };
            leaders.push(t);
          } else {
            in_leader.u.push(value.user.name);
          }
        });

        const msgs2 = leaders.map(leader => {
          const msg = this._newInitMsg(task_id);
          const userNames = leader.u.join();
          msg.notify_type = '新任务';
          msg.notify_content = `${creator.name}给${userNames}创建了一个任务`;
          msg.receviver = leader.l;
          return msg;
        });
        msgs1 = msgs1.concat(msgs2);
      }
      return msgs1;
    }

    // 修改任务提醒
    _updateMsg(creator, executors, task_id) {
      // 要提醒的执行人
      let execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      const msgs1 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务修改';
        msg.notify_content = `${creator.name}修改了任务`;
        msg.receviver = executor.user;
        return msg;
      });

      // 要提醒的上级
      execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish && creator.id !== executor.leader.id;
      });

      const msgs2 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务修改';
        msg.notify_content = `${creator.name}给${executor.user.name}修改了任务`;
        msg.receviver = executor.leader;
        return msg;
      });

      return msgs1.concat(msgs2);
    }

    // 结束任务提醒
    _endMsg(creator, executors, task_id) {
      // 要提醒的执行人
      let execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      const msgs1 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务结束';
        msg.notify_content = `${creator.name}将任务标记为结束`;
        msg.receviver = executor.user;
        return msg;
      });

      // 要提醒的上级
      execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish && creator.id !== executor.leader.id;
      });

      const msgs2 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务结束';
        msg.notify_content = `${creator.name}将发给${executor.user.name}的任务标记为结束`;
        msg.receviver = executor.leader;
        return msg;
      });

      return msgs1.concat(msgs2);
    }

    // 逾期任务提醒
    _overdueMsg(creator, executors, task_id) {
      // 要提醒的执行人
      const execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      let msgs1 = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务逾期';
        msg.notify_content = '任务已经逾期';
        msg.receviver = executor.user;
        return msg;
      });

      // 要提醒的发起人（发起人是系统则不要提醒）
      if (creator.id !== Const.system.id) {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务逾期';
        msg.notify_content = '任务已经逾期';
        msg.receviver = creator;
        msgs1 = msgs1.concat([ msg ]);
      }
      return msgs1;
    }

    // 完成任务提醒
    _finishMsg(task, executor_id) {
      const msgs = [];

      // 执行人
      const executor = task.executor.find(function(value) {
        return value.user.id === executor_id;
      });

      if (!executor) {
        return msgs;
      }

      // 自建任务时提醒发起人，系统任务不提醒
      if (task.creator.id !== Const.system.id) {
        const msg = this._newInitMsg(task._id);
        msg.receviver = task.creator;
        if (executor.finish_time && executor.finish_time > task.end_time) {
          msg.notify_type = '任务逾期完成';
          msg.notify_content = `${executor.user.name}逾期完成了任务`;
          msgs.push(msg);
        } else { // 非系统任务
          msg.notify_type = '任务完成';
          msg.notify_content = `${executor.user.name}完成了任务`;
          msgs.push(msg);
        }
      }

      // 要提醒的上级
      if (executor.leader.id !== task.creator.id) {
        const msg = this._newInitMsg(task._id);
        msg.receviver = executor.leader;
        if (executor.finish_time && executor.finish_time > task.end_time) {
          msg.notify_type = '任务处理通知';
          msg.notify_content = `${executor.user.name}逾期完成了${task.creator.name}分配的任务`;
          msgs.push(msg);
        } else if (task.creator.id !== Const.system.id) {
          msg.notify_type = '任务完成';
          msg.notify_content = `${executor.user.name}完成了${task.creator.name}分配的任务`;
          msgs.push(msg);
        }
      }

      return msgs;
    }

    // 留言任务提醒
    _msgMsg(task) {
      const message = task.message[task.message.length - 1];
      if (!message || !message.user) {
        return [];
      }

      // 所有相关人，除了自己（和系统）
      let users = task.executor.map(function(value) {
        return value.user;
      });
      if (task.creator.id !== Const.system.id) {
        users.push(task.creator);
      }
      users = users.filter(function(value) {
        return value.id !== message.user.id;
      });

      const msgs = users.map(value => {
        const msg = this._newInitMsg(task._id);
        msg.receviver = value;
        msg.notify_type = '任务留言';

        let ct = message.content;
        if (message.content.length > 30) {
          ct = message.content.substr(0, 30) + '...';
        }

        msg.notify_content = `${message.user.name}：${ct}`;
        return msg;
      });

      return msgs;
    }

    // 提前任务提醒
    _aheadMsg(task) {
      // 要提醒的执行人
      const execs = task.executor.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      // const diff = this._beforeMinute(new Date(task.end_time));
      const diff = Const.RuleName[task.reminder.rule_key];
      let msgs1 = execs.map(executor => {
        const msg = this._newInitMsg(task.id);
        msg.notify_type = '任务提醒';
        msg.notify_content = `${task.creator.name}发给你的任务距离截止时间还有${diff}，请尽快完成`;
        msg.receviver = executor.user;
        return msg;
      });

      // 要提醒的发起人(发起人是系统则不需要修改)
      if (task.creator.id !== Const.system.id) {
        const msg = this._newInitMsg(task.id);
        msg.notify_type = '任务提醒';
        msg.notify_content = `你发起的任务距离截止时间还有${diff}，还有${execs.length}人未完成任务，点击查看详情`;
        msg.receviver = task.creator;
        msgs1 = msgs1.concat([ msg ]);
      }
      return msgs1;
    }

    // 后续逾期任务提醒
    _laterOverdueMsg(creator, executors, task_id) {
      // 要提醒的执行人
      const execs = executors.filter(function(executor) {
        return executor.status !== Const.TaskStatus.finish;
      });

      const msgs = execs.map(executor => {
        const msg = this._newInitMsg(task_id);
        msg.notify_type = '任务逾期';
        msg.notify_content = '任务已逾期，请尽快完成';
        msg.receviver = executor.user;
        return msg;
      });

      return msgs;
    }

    // 跟进任务提醒
    _to_trackMsg(task) {

      // 要跟进的上级
      const tracks = task.follower.filter(function(follower) {
        return follower.status !== Const.task.status.track && follower.tracke_level === task.tracke_level && follower.tracked.length > 0;
      });

      const msgs = tracks.map(track => {
        const msg = this._newInitMsg(task._id.toString());
        const execNames = track.tracked.map(v => {
          return v.name;
        }).join('、');

        const followNames = track.tracked_follower.map(v => {
          return v.name;
        }).join('、');
        msg.notify_type = '任务跟进';
        if (task.tracke_level === 1) {
          msg.notify_content = `${task.creator.name}发给${execNames}的任务已逾期，请尽快跟进`;
        } else {
          msg.notify_content = `${task.creator.name}发给${execNames}的任务已逾期，${followNames}未跟进，请尽快跟进`;
        }
        msg.receviver = track.user;
        return msg;
      });

      return msgs;
    }
  }

  return NotifyService;
};
