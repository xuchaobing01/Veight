'use strict';

const Controller = require('../core/base');
const CatsValidate = require('../validate/cats');

class CatsController extends Controller {
    /**
     * 获取栏目列表
     */
    async list() {
        // 校验参数
        this.validate(CatsValidate.list);
        // 组装参数
        const req = {
            limit: this.getParam('size'),
            offset: (this.getParam('page') - 1 ) * this.getParam('size')
        }
        // 调用 Server 进行业务处理
        const data = await this.getServer('cats').list(req);
        if(data){
            this.success(data);
        }else{
            this.error('获取列表失败！');
        }
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