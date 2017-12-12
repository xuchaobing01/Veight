'use strict';

const ValidateTask = require('../../validate/task');
const Util = require('../../common/util');
const Const = require('../../common/const');
const { SpruceError, ErrorStatus } = require('../../common/spruce_error');
module.exports = app => {
  class TaskContoller extends app.Controller {

    /**
     * 创建任务
     *
     * @author Su Shengxi
     * @memberof TaskContoller
     */
    * create() {
      this.validate(ValidateTask.create);
      const task = this.params.task;
      // 创建者信息
      task.creator = this.getCurrentUser();
      const data = yield this.getService('task').create(task);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }
    // 获取当前用户信息
    getCurrentUser() {
      return {
        id: this.ctx.me._id,
        name: this.ctx.me.info.name,
        from: this.ctx.me.from,
      };

    }
    /**
        * 删除任务
        *
        * @author Su Shengxi
        * @memberof TaskContoller
        */
    * delete() {
      this.validate(ValidateTask.id);
      const userId = this.ctx.me._id;
      const _id = this.params._id;
      const data = yield this.getService('task').delete(_id, userId);
      if (data) {
        this.success('成功');
      } else {
        this.error('失败');
      }

    }

    /**
         * 全部任务列表
         *
         * @author Su Shengxi
         * @memberof TaskContoller
         */
    * allList() {
      this.validate(ValidateTask.list);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').allList(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.errot('失败');
      }
    }

    /**
        * 收到的任务列表
        *
        * @author Su Shengxi
        * @memberof TaskContoller
        */
    * receiveList() {
      this.validate(ValidateTask.list);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').receiveList(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.errot('失败');
      }
    }


    /**
        * 派发的任务列表
        *
        * @author Su Shengxi
        * @memberof TaskContoller
        */
    * sendList() {
      this.validate(ValidateTask.list);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').sendList(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }

    /**
        * 关注的任务列表
        *
        * @author Su Shengxi
        * @memberof TaskContoller
        */
    * followerList() {
      this.validate(ValidateTask.list);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').followerList(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }

    /**
        * 回收站任务列表
        *
        * @author Su Shengxi
        * @memberof TaskContoller
        */
    * deleteList() {
      this.validate(ValidateTask.list);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').deleteList(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }


    /**
    * 任务详情
    *
    * @author Su Shengxi
    * @memberof TaskContoller
    */
    * detail() {
      this.validate(ValidateTask.id);
      const _id = this.params._id;
      let data = yield this.getService('task').detail(_id);
      if (!data) {
        this.error('未找到数据');
        return;
      }
      const userId = this.ctx.me._id;
      const is_read = data.executor.some(v => {
        return v.user.id === userId && v.read_time;
      });
      const userInTask = Util.userInTask(userId, data);
      // 执行人时更新已读状态
      if (userInTask.role === Const.task.role.executor && is_read !== true) {
        yield this.getService('task').updateIsRead(_id, userId);
      }
      // 子任务
      const subTask = yield this.getService('task').subTask(_id);
      if (data) {
        // 将message的按time的倒序显示
        data.message.sort(function(a, b) {
          return a.time < b.time ? 1 : -1;
        });
        data = {
          task: data,
          userInTask,
          subTask,
          end_time_format: Util.dateFormat(data.end_time, Const.DATE_WEEK_FORMAT),
        };
        this.success(data);
      }
    }
    /**
     * 处理当前用户在任务中的状态和end_time的格式
     *
     * @author Tim
     * @param {any} userId 用户id
     * @param {any} list 任务列表
     * @return {list} 任务信息
     * @memberof TaskContoller
     */
    transformation(userId, list) {
      const allData = [];
      if (list) {
        list.forEach(function(element) {
          try {
            const data = {};
            const userInTask = Util.userInTask(userId, element);
            data.task = element;
            data.userInTask = userInTask;
            data.agoTime = Util.agoTime(element.create_time);
            data.end_time_format = Util.dateFormat(element.end_time, Const.DATE_WEEK_FORMAT);
            allData.push(data);
          } catch (err) {
            console.error(err);
          }
        }, this);
      }
      return allData;
    }
    /**
    * 修改任务
    *
    * @author Su Shengxi
    * @memberof TaskContoller
    */
    * modifyTask() {
      this.validate(ValidateTask.modify);
      const task = this.params.task;
      task.user = this.getCurrentUser();
      task.update_time = Util.now();
      const data = yield this.getService('task').modifyTask(task);
      if (data) {
        this.success('成功');
      } else {
        const error = new SpruceError(ErrorStatus.cannotModify);
        this.error(error);
      }


    }


    /**
    * 任务跟进
    *
    * @author Su Shengxi
    * @memberof TaskContoller
    */
    * track() {
      this.validate(ValidateTask.track);
      this.params.time = Util.now();
      this.params.user = this.getCurrentUser();
      const data = yield this.getService('task').track(this.params);
      if (data) {
        this.success('成功');
      } else {
        this.error('失败');
      }
    }


    /**
    * 查看(跟进/完成)情况
    *
    * @author Su Shengxi
    * @memberof TaskContoller
    */
    * operateDetail() {
      this.validate(ValidateTask.operateDetail);
      const data = yield this.getService('task').operateDetail(this.params);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }


    /**
     * 消息回复
     *
     * @author Su Shengxi
     * @memberof TaskContoller
     */

    * reply() {
      this.validate(ValidateTask.reply);
      this.params.time = Util.now();
      this.params.user = this.getCurrentUser();
      const data = yield this.getService('task').reply(this.params);
      if (data) {
        this.success('成功');
      } else {
        this.error('失败');
      }
    }


    /**
     * 执行人完成任务
     *
     * @author Su Shengxi
     * @memberof TaskContoller
     */
    * finishTask() {
      this.validate(ValidateTask.finish);
      this.params.user = this.getCurrentUser();
      const data = yield this.getService('task').finishTask(this.params);
      if (data) {
        this.success('成功');
      } else {
        this.error('失败');
      }
    }
    /**
     * 创建人结束任务
     *
     *
     * @author Su Shengxi
     * @memberof TaskContoller
     */
    * endTask() {
      this.validate(ValidateTask.id);
      this.params.finish_time = Util.now();
      this.params.user = this.getCurrentUser();
      const data = yield this.getService('task').creatorFinishTask(this.params);
      if (data) {
        this.success('成功');
      } else {
        this.error('失败');
      }
    }

    /**
     * 搜索
     *
     *
     * @author Su Shengxi
     * @memberof TaskContoller
     */
    * search() {
      this.validate(ValidateTask.search);
      this.params.userId = this.ctx.me._id;
      let data = yield this.getService('task').search(this.params);
      data = this.transformation(this.ctx.me._id, data);
      if (data) {
        this.success(data);
      } else {
        this.error('失败');
      }
    }


  }
  return TaskContoller;
};
