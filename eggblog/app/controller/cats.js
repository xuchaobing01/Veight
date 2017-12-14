'use strict';

const BaseController = require('../core/base');
const CatsValidate = require('../validate/cats');

class CatsController extends BaseController {
    /**
     * 获取栏目列表
     */
    async list() {
        // 校验参数
        this.validate(CatsValidate.list);
        // 组装参数
        // 调用 Server 进行业务处理
        const data = await this.getServer('cats').list(this.params);
        this.json(data);
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