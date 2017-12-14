'use strict';

const { Controller } = require('egg');

class BaseController extends Controller {
    /**
     * 构造函数
     * @param {*} ctx 
     */
    constructor(ctx) {
        super(ctx);
        // 分页保留的关键字
        const page = this.ctx.request.body.page;
        const size = this.ctx.request.body.size;
        if (page) {
            this.ctx.request.body.page = parseInt(page);
        }
        if (size) {
            this.ctx.request.body.size = parseInt(size);
        }
    }
    /**
     * 获取参数
     */
    get params() {
        return this.ctx.request.body;
    }
    /**
     * 获取指定参数
     * @param {*} name 
     */
    getParam(name){
        let value = this.ctx.request.body[name];
        if(!value || (undefined === value) ){
            value = null;
        }
        return value;
    }
    getServer(name){
        return this.ctx.service[name];
    }

    validate(rule) {
        this.ctx.validate(rule);
    }

    json(body) {
        this.ctx.body = body;
    }
    
    

}

module.exports = BaseController;