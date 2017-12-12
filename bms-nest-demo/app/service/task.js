'use strict';
const Const = require('../common/const');
const Util = require('../common/util');

module.exports = app => {
  class TaskService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.getModel('task');
    }
    /**
     * 构建关注人
     *
     * @author Tim
     * @param {any} task 任务
     * @return {data} 对象
     * @memberof TaskService
     */
    * followerMap(task) {
      const executor = task.executor;
      const followerMap = executor.reduce(function(map, item) {
        const leader = item.leader;
        // 如果上级存在,并且不为创建人
        if (leader && leader.id !== task.creator.id) {
          let follow = map.get(leader.id);
          if (!follow) {
            // 关注人信息初始化
            follow = {
              status: Const.task.status.inProgress,
              tracke_level: 1,
              tracked: [],
              tracked_follower: [],
              create_time: Util.now(),
              user: {
                id: leader.id,
                name: leader.name,
                from: leader.from,
              },
            };
          }
          // 被跟进人
          const trackUser = {
            id: item.user.id,
            name: item.user.name,
            from: item.user.from,
          };
          // 去重判断
          const exist = follow.tracked.some(function(element) {
            return element.id === trackUser.id;
          });
          if (!exist) {
            follow.tracked.push(trackUser);
          }
          map.set(leader.id, follow);
        }
        return map;
      }, new Map());
      return followerMap;

    }

    /**
     * 构建执行人（执行人里面不能有创建人）
     *
     * @author Su Shengxi
     * @param {any} executor 执行者
     * @param {any} userId  创建人的id
     * @return {array} 数组里面没有创建人
     * @memberof TaskService
     */
    * executorMap(executor, userId) {
      const result = executor.filter(function(element) {
        return (element.user.id !== userId);
      });
      return result;
    }
    /**
     * 创建任务
     *
     * @author Tim
     * @param {any} task 任务对象
     * @return {task} task 新创建的任务对象
     * @memberof TaskService
     */
    * create(task) {
      const logger = this.ctx.logger;
      logger.info('[TaskService] create:' + JSON.stringify(task));
      // 在执行人里面不能有创建人
      task.executor = yield this.executorMap(task.executor, task.creator.id);
      let alert_time = null;
      // 构建关注人
      const followerMap = yield this.followerMap(task);
      // 关注人信息
      const follower = [ ...followerMap.values() ];
      task.follower = follower;
      // 执行数量
      task.execute = {
        count: task.executor.length,
        finish_count: 0,
      };
      task.tracke_level = 0;
      task.create_time = Util.now();
      // 计算提醒规则alert_time
      // '不提醒', '十五分钟', '三十分钟', '一小时', '三小时', '一天'
      const reminderTime = parseInt(task.reminder.rule_key);
      const end_time = task.end_time;
      const endTime = new Date(end_time);
      alert_time = this.changeAlterTime(endTime, reminderTime);
      const tracke_time = Util.dateAddSecond(endTime, Const.task.overdueLimit);
      task.tracke_time = Util.dateFormat(tracke_time);
      task.end_time = Util.dateFormat(endTime);
      // 任务类型
      if (!task.task_type) {
        task.task_type = Const.task.taskType.manual;
      }
      task.reminder = {
        rule_key: task.reminder.rule_key,
        alert_time: Util.dateFormat(alert_time),
      };
      task.message = [{
        user: task.creator,
        time: task.create_time,
        content: `${task.creator.name}创建了任务`,
        action: Const.TaskAction.new,
      }];
      task = yield this.model.create(task);
      logger.info('[TaskService] create success!');
      yield this.replyNotity({ task, action: Const.TaskAction.new });
      return task;
    }
    /**
     * 转换时间
     *
     * @author Su Shengxi
     * @param {any} time 任务结束时间
     * @param {any} ruleKey 提醒规则
     * @return {task} alert_time 提醒时间
     * @memberof TaskService
     */
    changeAlterTime(time, ruleKey) {
      let alert_time = null;
      const Time = new Date(time);
      if (ruleKey === Const.task.reminder.fifMinute) {
        alert_time = Util.dateAddMinute(Time, -15);
      } else if (ruleKey === Const.task.reminder.thirtyMinute) {
        alert_time = Util.dateAddMinute(Time, -30);
      } else if (ruleKey === Const.task.reminder.oneHour) {
        alert_time = Util.dateAddMinute(Time, -60);
      } else if (ruleKey === Const.task.reminder.threeHour) {
        alert_time = Util.dateAddMinute(Time, -180);
      } else if (ruleKey === Const.task.reminder.oneDay) {
        alert_time = Util.dateAddDays(Time, -1);
      } else if (ruleKey === Const.task.reminder.fiveHour) {
        alert_time = Util.dateAddMinute(Time, -300);
      } else {
        alert_time = null;
      }
      return alert_time;

    }

    // 删除任务
    * delete(_id, userId) {
      const logger = this.ctx.logger;
      logger.info(`[TaskService] delete taskId:${_id}`);
      yield this.model.update({ _id, 'creator.id': userId }, { $inc: { delete: 1 } });
      yield this.model.update({ _id, 'executor.user.id': userId }, { $inc: { 'executor.$.delete': 1 } });
      yield this.model.update({ _id, 'follower.user.id': userId }, { $inc: { 'follower.$.delete': 1 } });
      return true;
    }
    // 全部列表
    * allList(params) {
      const { userId, page, size } = params;
      const skip = size * (page - 1);
      const data = yield this.model.find({
        $or: [
          { executor: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } },
          { 'creator.id': userId, delete: Const.task.delete.default },
          { follower: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } },
        ],
      }).sort({ create_time: -1 }).limit(size)
        .skip(skip);
      return data;
    }
    // 派发的任务列表
    * receiveList(params) {
      const { userId, size, page } = params;
      const skip = size * (page - 1);
      const data = yield this.model.find({ executor: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } }).sort({ create_time: -1 }).limit(size)
        .skip(skip);
      return data;
    }


    // 收到的任务列表
    * sendList(params) {
      const { userId, size, page } = params;
      const skip = size * (page - 1);
      const data = yield this.model.find({ 'creator.id': userId, delete: Const.task.delete.default }).sort({ create_time: -1 }).limit(size)
        .skip(skip);
      return data;
    }
    // 关注的任务列表
    * followerList(params) {
      const { userId, size, page } = params;
      const skip = size * (page - 1);
      const data = yield this.model.find({ follower: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } }).sort({ create_time: -1 }).limit(size)
        .skip(skip);
      return data;
    }
    // 回收站的任务列表
    * deleteList(params) {
      const { userId, size, page } = params;
      const skip = size * (page - 1);
      const data = yield this.model.find({
        $or: [
          { executor: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.delete } } },
          { 'creator.id': userId, delete: Const.task.delete.delete },
          { follower: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.delete } } },
        ],
      }).sort({ create_time: -1 }).limit(size)
        .skip(skip);
      return data;
    }


    /**
     * 详情
     *
     * @author Tim
     * @param {any} _id 任务id
     * @return {task} task 任务对象
     * @memberof TaskService
     */
    * detail(_id) {
      const data = yield this.model.findOne({ _id });
      return data;
    }


    /**
     * 根据任务id获取子任务
     *
     * @author Tim
     * @param {any} _id 任务id
     * @memberof TaskService
     * @return {data} data 子任务列表
     */
    * subTask(_id) {
      const data = yield this.model.find({ from_task: _id });
      return data;
    }
    /**
     *
     * 更新执行者的已读状态
     *
     * @author Tim
     * @param {any} _id 任务id
     * @param {any} userId  执行者id
     * @return {obj} obj 更新结果
     * @memberof TaskService
     */
    * updateIsRead(_id, userId) {
      const read_time = Util.now();
      const data = yield this.model.update({ _id, 'executor.user.id': userId }, { $set: { 'executor.$.is_read': Const.read.yes, 'executor.$.read_time': read_time } });
      return data;
    }

    /**
     * 关注人跟进操作
     *
     * @author Tim
     * @param {any} params 任务对象
     * @return {data} 任务对象
     * @memberof TaskService
     */
    * track(params) {
      const logger = this.ctx.logger;
      logger.info(`[TaskService] track :${JSON.stringify(params)}`);
      const { _id, user, time, content, attach } = params;
      // // 获取tracker跟进人
      // const data = yield this.model.update(
      //   { 'follower.user.id': user.id, 'follower.status': Const.task.status.inProgress, _id },
      //   {
      //     $set: {
      //       'follower.$.finish_time': time,
      //       'follower.$.status': Const.task.status.track,
      //       'follower.$.content': content,
      //       'follower.$.attach': attach,
      //     },
      //   });
      // // 删除被关注人升级触发数组
      // yield this.model.update({ 'follower.tracked_follower.id': user.id, _id },
      //   { $pull: { 'follower.$.tracked_follower': { id: user.id } } });
      // 生成message消息
      const task = yield this.model.findOne({ _id });
      let tracked = [];
      task.follower.forEach(function(element, i, array) {
        // 处理跟进操作
        if (element.user.id === user.id && element.status === Const.task.status.inProgress) {
          element.finish_time = Util.now();
          element.status = Const.task.status.track;
          element.content = content;
          element.attach = attach;
          // 被跟进人
          tracked = element.tracked.map(function(user) {
            return user.name;
          });
        }
        // 处理清除tracked_follower操作
        let tracked_follower = element.tracked_follower;
        if (tracked_follower) {
          const tem = tracked_follower.filter(follower => {
            return follower.id !== user.id;
          });
          tracked_follower = tem;
        }
        element.tracked_follower = tracked_follower;
        array[i] = element;
      });
      // 获取tracker跟进人
      const data = yield this.model.update({ _id }, { $set: { follower: task.follower } });
      logger.info(`[TaskService] track :${JSON.stringify(task)}`);
      const messageReply = {
        _id,
        user,
        time,
        content: `${user.name}跟进了${tracked.toString()}的逾期任务`,
        action: Const.TaskAction.track,
      };
      yield this.reply(messageReply, task);
      return task;
    }
    /**
     * 查看(跟进/完成)情况
     *
     * @author Tim
     * @param {any} params 任务对象
     * @return {data} 任务对象
     * @memberof TaskService
     */
    * operateDetail(params) {
      const { _id, action, userId } = params;
      const data = yield this.model.findOne({ _id });
      let content = null;
      if (data) {
        let user = null;
        if (parseInt(action) === Const.TaskAction.finish) {
          user = data.executor;
        } else if (parseInt(action) === Const.TaskAction.overdue) {
          user = data.follower;
        } else if (parseInt(action) === Const.TaskAction.track) {
          user = data.follower;
        }
        const exist = user.some(function(item) {
          const flag = (item.user.id === userId);
          if (flag) {
            content = {
              contet: item.content,
              attach: item.attach,
            };
          }
          return flag;
        });
      }
      return content;
    }
    /**
     * 消息回复
     *
     * @author Tim
     * @param {any} params 消息内容
     * @param {any} task 任务
     * @return {obj} data 回复结果
     * @memberof TaskService
     */
    * reply(params, task = null) {
      const logger = this.ctx.logger;
      const { _id, time, content, user, entry, action } = params;
      logger.info(`[TaskService] reply :${JSON.stringify(params)}`);
      if (user) {
        yield this.model.update({ _id }, {
          $addToSet: {
            message: {
              user,
              content,
              action,
              time,
              entry,
            },
          },
        });
      }
      const data = yield this.model.findOne({ _id });
      logger.info('[TaskService] reply success!');
      if (!task) {
        task = yield this.model.findOne({ _id });
      }
      const executor_id = (action === Const.TaskAction.finish) ? user.id : null;
      yield this.replyNotity({ task, action, executor_id });
      return data;
    }


    // 执行人完成任务
    * finishTask(params) {
      const logger = this.ctx.logger;
      const finish_time = Util.now();
      const { _id, user, content, attach, interactionOrtask } = params;
      let task = yield this.model.findOne({ _id, 'executor.user.id': user.id });
      // 将字符串转为布尔值
      const bools = [ 'is_entry', 'is_order', 'is_maintain' ];
      if (interactionOrtask) {
        bools.forEach(v => {
          if (interactionOrtask[v]) {
            interactionOrtask[v] = Util.stringToBool(interactionOrtask[v]);
          }
        });
      }
      if (!task) {
        logger.info(`[TaskServer] finishTask 未找到要执行的任务！taskId:${_id}   executor.user.id:${user.id}`);
        return false;
      }
      const flag = task.executor.some(function(item) {
        return (item.user.id === user.id && item.status === Const.task.status.finish);
      });
      if (flag) {
        logger.info('[TaskServer] finishTask 不能重复进行完成操作！');
        return false;
      }
      // 完成操作
      const data = yield this.model.update({ 'executor.user.id': user.id, _id },
        {
          $set: {
            'executor.$.status': Const.task.status.finish,
            'executor.$.finish_time': finish_time,
            'executor.$.content': content,
            'executor.$.attach': attach,
            'executor.$.extend': interactionOrtask,
          },
        });
      // 清除被跟进信息
      if (task.follower) {
        task.follower.forEach((element, i, array) => {
          // 处理清除tracked操作
          let tracked = element.tracked;
          if (tracked) {
            const tem = tracked.filter(item => {
              return item.id !== user.id;
            });
            tracked = tem;
          }
          element.tracked = tracked;
          array[i] = element;
        });
      }
      // 更新跟进人信息和完成人数量
      yield this.model.update({ _id }, {
        $set: { follower: task.follower },
        $inc: { 'execute.finish_count': 1 },
      });
      logger.info(`[TaskServer] finishTask success！taskId:${_id}   executor.user.id:${user.id}`);
      // 更新message
      const template = task.status === Const.task.status.overdule ? `${user.name}超时完成了任务` : `${user.name}完成了任务`;
      const messageReply = {
        _id,
        user,
        time: finish_time,
        content: template,
        action: Const.TaskAction.finish,
      };
      // 重新获取最新的任务详情
      task = yield this.model.findOne({ _id, 'executor.user.id': user.id });
      yield this.reply(messageReply, task);
      // 任务类型为系统任务
      if (task.task_type !== Const.task.taskType.manualTask) {
        // 任务和互动
        yield this.interactionOrTask(task, interactionOrtask, user);
        // 事件任务后发布自动完成或者重新开始发布周期
        yield this.autoCompleted(task.extend.event_task);

      }
      // 如果任务的创建者是系统 系统任务执行人（只有一个）完成任务就是这个结束这个任务
      if (task.creator.id === Const.SYS_USER.id) {
        yield this.model.update({ _id }, {
          $set: {
            finish_time, status: Const.task.status.finish,
          },
        });
      }
      return task;
    }
    /**
     * 创建人结束任务
     *
     * @author Tim
     * @param {any} params 结束条件
     * @return {data} data 任务执行结果
     * @memberof TaskService
     */
    * creatorFinishTask(params) {
      const logger = this.ctx.logger;
      const { _id, user } = params;
      const finish_time = Util.now();
      logger.info(`[TaskService] creatorFinishTask :${JSON.stringify(params)}`);
      const messageReply = {
        _id,
        user,
        time: finish_time,
        content: `${user.name}将任务标记为结束`,
        action: Const.TaskAction.end,
      };
      const data = yield this.model.update({ _id, 'creator.id': user.id }, {
        $set: {
          finish_time, status: Const.task.status.finish,
        },
      });
      yield this.reply(messageReply);
      return data;
    }
    /**
     * 搜索
     *
     * @author Su Shengxi
     * @param {any} params 参数对象
     * @return {data} data 搜索结果
     * @memberof TaskService
     */
    * search(params) {
      const { message, userId, page, size } = params;
      if (!message) {
        return [];
      }
      const skip = size * (page - 1);
      const reg = new RegExp(message);
      const data = yield this.model.find({
        $or: [
          { $or: [{ 'creator.name': reg }, { content: reg }, { 'extend.cust.name': reg }, { 'extend.old_car.name': reg }], executor: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } },
          { $or: [{ 'creator.name': reg }, { content: reg }, { 'extend.cust.name': reg }, { 'extend.old_car.name': reg }], 'creator.id': userId, delete: Const.task.delete.default },
          { $or: [{ 'creator.name': reg }, { content: reg }, { 'extend.cust.name': reg }, { 'extend.old_car.name': reg }], follower: { $elemMatch: { 'user.id': userId, delete: Const.task.delete.default } } },
        ],
      }).limit(size).skip(skip);
      return data;
    }

    /**
     * 修改
     *
     * @author Su Shengxi
     * @param {any} task 任务信息
     * @return {data} data
     * @memberof TaskService
     */
    * modifyTask(task) {
      const logger = this.ctx.logger;
      logger.info(`[TaskService] modifyTask :${JSON.stringify(task)}`);
      const { _id, user, content, end_time, attach, executor, update_time, reminder } = task;
      let alert_time = null;
      const data = yield this.model.findOne({ _id });
      const reminderTime = parseInt(reminder.rule_key);
      const endTime = Util.dateFormat(new Date(end_time));
      let tracke_time = Util.dateAddSecond(new Date(end_time), Const.task.overdueLimit);
      tracke_time = Util.dateFormat(tracke_time);
      const executors = yield this.executorMap(executor, user.id);
      alert_time = this.changeAlterTime(endTime, reminderTime);
      reminder.alert_time = Util.dateFormat(alert_time);
      const finishCount = data.execute.finish_count;
      // 如果有人完成任务 和当前人不是创建人 返回错误信息
      if (finishCount > 0 || user.id !== data.creator.id) {
        return false;
      }
      // 添加creator是构建关注人时需要creator的信息
      task.creator = user;
      const MapFollower = yield this.followerMap(task);
      const follower = [ ...MapFollower.values() ];
      // 修改数量
      const execute = {
        count: executor.length,
        finish_count: 0,
      };
      yield this.model.update({ _id }, {
        $set: {
          content,
          attach,
          follower,
          execute,
          update_time,
          reminder,
          tracke_time,
          end_time: endTime,
          executor: executors,
        },
      });
      logger.info('[TaskService] modifyTask success!');
      const messageReply = {
        _id,
        user,
        time: update_time,
        content: `${user.name}修改了任务`,
        action: Const.TaskAction.update,
      };
      yield this.reply(messageReply);
      return data;

    }


    /**
     * 任务作废
     *
     * @author Su Shengxi
     * @param {relatedId} relatedId 客户id/购车计划id/已有车辆id
     * @param {taskType} taskType 任务类型
     * @memberof TaskService
     */
    * makeInvalid(relatedId, taskType) {
      const logger = this.ctx.logger;
      logger.info('[TaskService] makeInvalid relatedId:' + relatedId + '-------------taskType:' + taskType);
      if (!relatedId && !taskType) {
        new Error('参数错误');
      }
      yield this.model.update({ 'extend.event_task.related.id': relatedId, task_type: taskType, status: { $ne: 40 } }, {
        $set: { status: Const.task.status.cancellation },
      }, { multi: true });
      logger.info('[TaskService] makeInvalid success!');
    }

    /**
         * 跟进通知
         *
         * @author Tim
         * @param {any} task 任务
         * @memberof TaskService
         */
    * notifyTrack(task) {
      const logger = this.ctx.logger;
      logger.info(`[TaskService] notifyTrack task:${JSON.stringify(task)}`);
      const _id = task._id;
      let follower = task.follower;
      let level = task.tracke_level;
      // 升级跟进级别
      if (level > 0) {
        logger.info(`[TaskService] notifyTrack ------------------------- 跟进升级 -------------------------- taskId:${task._id}`);
        // 跟进升级
        const result = yield this.trackUpgrade(task);
        // 设置最终级别和关注人
        level = result.level;
        follower = result.follower;
        logger.info('[TaskService] notifyTrack ------------------------- 跟进升级完成！ --------------------- result:' + JSON.stringify(result));
      } else {
        // 设置最终级别和关注人
        level++;
        // 需要对上级也是执行人时进行特殊处理，上级也逾期时就不需要通知跟进了
        const executor = task.executor;
        logger.info('[TaskService] -------------------  notifyTrack 上级也是执行人处理 ----------------------');
        executor.forEach(item => {
          // 逾期未完成
          if (item.status === Const.task.status.inProgress && item.leader && item.leader.id !== null) {
            const leaderOverDue = executor.some(exec => {
              // 上级未也未完成
              return (exec.user.id === item.leader.id && exec.status === Const.task.status.inProgress);
            });
            // 上级也逾期,将该执行人从上级的follower.tracked数组中清除
            if (leaderOverDue) {
              logger.info(`[TaskService] notifyTrack 上级逾期:${JSON.stringify(item.leader)}`);
              // 重置关注人信息
              follower.forEach((followUser, i, array) => {
                // 找到上级关注人
                if (followUser.user.id === item.leader.id) {
                  logger.info(`[TaskService] notifyTrack tracked 原执行人:${followUser.tracked}`);
                  // 清除下级执行人
                  const tracked = followUser.tracked.filter(track => {
                    return track.id !== item.user.id;
                  });
                  logger.info(`[TaskService] notifyTrack tracked 更改后执行人:${tracked}`);
                  followUser.tracked = tracked;
                  array[i] = followUser;
                }
              });
            }
          }
        });
        logger.info(`[TaskService] -------------------  notifyTrack 上级也是执行人处理结束！ ---------------------- taskId:${task._id}`);
      }
      // 确认最终跟进时间，用以判断是否还需继续升级跟进
      let tracke_time = task.tracke_time;
      // 判断是否还需要继续升级跟进
      if (level > task.tracke_level) {
        // 更新下次跟进时间
        tracke_time = Util.dateAddSecond(new Date(tracke_time), Const.task.overdueLimit);
        tracke_time = Util.dateFormat(tracke_time);
      }
      logger.info('[TaskService] notifyTrack tracke_time:' + tracke_time);
      // 升级跟进级别
      yield this.model.update({ _id }, {
        $set: { tracke_level: level, tracke_time, follower },
      });
      logger.info(`[TaskService] notifyTrack success! taskId:${task._id}`);
      task = yield this.model.findOne({ _id });
      yield this.replyNotity({ task, action: Const.TaskAction.to_track });
    }
    /**
     * 跟进升级
     *
     * @author Tim
     * @param {any} task 任务信息
     * @return {data} {follower,level} follower:跟进升级后的所有关注人对象 level:最终跟进级别
     * @memberof TaskService
     */
    * trackUpgrade(task) {
      const logger = this.ctx.logger;
      const follower = task.follower;
      // 是否升级标识
      let isUpgrade = false;
      // 待升级跟进人
      const upgradeFollower = [];
      // 已跟进或不需跟进的人，包括所有status为已跟进或follower.tracked为空的关注人
      const needlessTrackedFollower = [];
      // 需要跟进的人，不包括follower.tracked为空的关注人
      const notTrackedFollowerMap = new Map();
      // 初始化跟进人数组
      follower.forEach(item => {
        // 不需跟进的人
        if (item.status === Const.task.status.track || (!item.tracked) || item.tracked.length === 0) {
          needlessTrackedFollower.push(item);
        } else { // 需要跟进的人
          notTrackedFollowerMap.set(item.user.id, item);
          // 待升级跟进的人
          if (item.tracke_level === task.tracke_level) {
            upgradeFollower.push(item);
          }
        }
      });
      logger.info(`[TaskService] trackUpgrade 待升级跟进人:${upgradeFollower}`);
      logger.info(`[TaskService] needlessTrackedFollower 已跟进或不需跟进的人:${needlessTrackedFollower}`);
      logger.info(`[TaskService] notTrackedFollowerMap 需要跟进的人:${[ ...notTrackedFollowerMap.values() ]}`);
      const userService = this.ctx.getService('user');
      const fields = {
        _id: 1,
        username: 1,
        leader: 1,
      };
      // 构建新的关注人
      for (let i = 0; i < upgradeFollower.length; i++) {
        const item = upgradeFollower[i];
        const tmpUser = yield userService.detail(item.user, fields);
        // 上级不存在或者上级为创建人时
        if (!tmpUser || !tmpUser.leader || tmpUser.leader._id === task.creator.id) {
          logger.info(`[TaskService] upgradeFollower 用户leader不存在或leader是创建人!${JSON.stringify(tmpUser)}`);
          continue;
        }
        const leader = {
          id: tmpUser.leader._id,
          name: tmpUser.leader.name,
          from: tmpUser.leader.from,
        };
        // logger.info(`[TaskService] upgradeFollower user:${JSON.stringify(tmpUser)}`);
        let follow = {
          status: Const.task.status.inProgress,
          tracke_level: task.tracke_level + 1,
          tracked: item.tracked,
          // 将当前跟进人的tracked_follower和当前人追加到上级tracked_follower中
          tracked_follower: item.tracked_follower.concat(item.user),
          create_time: Util.now(),
          user: leader,
        };
        logger.info(`[TaskService] upgradeFollower 构建新关注人:${JSON.stringify(follow)}`);
        const element = notTrackedFollowerMap.get(leader.id);
        // logger.info(`[TaskService] upgradeFollower 查询关注人:${JSON.stringify(element)}`);
        if (element) { // 如果存在需要执行合并操作
          element.tracke_level = follow.tracke_level;
          element.tracked = this.merge(element.tracked, follow.tracked);
          element.tracked_follower = this.merge(element.tracked_follower, follow.tracked_follower);
          follow = element;
          logger.info(`[TaskService] upgradeFollower 合并关注人:${JSON.stringify(follow)}`);
        }
        // 确认升级
        isUpgrade = true;
        notTrackedFollowerMap.set(follow.user.id, follow);
      }
      let level = task.tracke_level;
      // 确定是否升级
      if (isUpgrade)++level;
      // 合并所有跟进人
      const notTrackedFollower = [ ...notTrackedFollowerMap.values() ];
      logger.info(`[TaskService] trackUpgrade 最终需要跟进的人:${[ ...notTrackedFollower ]}`);
      logger.info(`[TaskService] needlessTrackedFollower 最终已跟进人:${needlessTrackedFollower}`);
      return { follower: needlessTrackedFollower.concat(notTrackedFollower), level };
    }
    // 合并用户数组
    merge(dest, src) {
      const all = dest.concat(src);
      const result = all.reduce((map, item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
        return map;
      }, new Map());
      return [ ...result.values() ];
    }

    /**
     * 逾期通知
     *
     * @author Tim
     * @param {any} task 任务信息
     * @memberof TaskService
     */
    * notifyOverDue(task) {
      const logger = this.ctx.logger;
      logger.info(`[TaskService] notifyOverDue taskId:${task._id}`);

      const status = Const.task.status.overdule;
      const { _id } = task;
      yield this.model.update({ _id }, { $set: { status } });

      // 逾期message
      // 找出执行用户
      let user = null;
      const exist = task.executor.some(function(element) {
        const status = element.status === Const.task.status.inProgress;
        if (status) {
          user = element.user.name;
        }
        return status;
      });
      const messageReply = {
        _id,
        time: Util.now(),
        // content: `${user.toString()}的任务已逾期`,
        action: Const.TaskAction.overdue,
      };
      if (user) {
        messageReply.content = `${user.toString()}的任务已逾期`;
      }

      yield this.reply(messageReply, task);
      logger.info(`[TaskService] notifyOverDue success! taskId:${task._id}`);

    }

    * replyNotity(obj) {
      const logger = this.ctx.logger;
      const { task, action, executor_id } = obj;
      try {
        logger.info('[TaskService] replyNotity :' + JSON.stringify(task));
        yield this.ctx.getService('notify').taskNotity(task, action, executor_id);
        logger.info(`[TaskService] replyNotity success! taskId:${task._id}`);
      } catch (e) {
        logger.error(`[TaskService] notifyTrack error! taskId:${task._id}`, e);
        return false;
      }
      return true;
    }

    // 互动和任务
    * interactionOrTask(task, interactionOrtask, user) {
      const logger = this.ctx.logger;
      try {
        yield this.ctx.getService('interactionTask').interactionOrTask(task, interactionOrtask, user);
      } catch (e) {
        logger.error(e);
      }

    }
    // 事件任务后发布自动完成或者重新开始发布周期
    * autoCompleted(eventTask) {
      const logger = this.ctx.logger;
      try {
        logger.info('[TaskService] autoCompleted :' + JSON.stringify(eventTask));
        yield this.ctx.getService('eventEngine').autoCompleted(eventTask);
        logger.info('[TaskService] autoCompleted  success!:' + JSON.stringify(eventTask));
      } catch (e) {
        logger.error('[TaskService] autoCompleted error! autoCompleted:' + JSON.stringify(eventTask), e);
      }
    }
  }
  return TaskService;
};
