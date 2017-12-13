'use strict';

const Service = require('egg').Service;

class CatsService extends Service {
    /**
     * 栏目列表
     */
    async list(params) {
        const cats = await this.app.mysql.select('cat',{
            columns:['cat_id','catname','num'],
            orders:[['cat_id','asc']],
            ...params
        });
        return cats;
    }

    /**
     * 栏目详情
     */
    async show() {

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

module.exports = CatsService;