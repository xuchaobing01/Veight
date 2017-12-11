'use strict';

const Controller = require('egg').Controller;

class CatsController extends Controller {
    /**
     * 获取栏目列表
     */
    async list() {
        const list = await this.service.cats.list();
        this.ctx.body = { code: 0, msg: '获取成功！', data: list }
        this.ctx.status = 200;
    }

    /**
     * 栏目详情
     */
    async show() {
        this.ctx.body = { code: 0, msg: '获取成功！', data: '' }
        this.ctx.status = 200;
    }

    /**
     * 添加栏目
     */
    async create() {

    }

    /**
     * 编辑栏目
     */
    async edit() {

    }

    /**
     * 删除栏目
     */
    async del() {

    }
}

module.exports = CatsController;