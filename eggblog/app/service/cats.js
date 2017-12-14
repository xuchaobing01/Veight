'use strict';

const Service = require('egg').Service;

class CatsService extends Service {
    /**
     * 栏目列表
     */
    async list(params) {
        const limit = params.size;
        const offset = (params.page - 1) * params.size;

        let whereStr = '';
        let where = {}
        if (params.searchText && params.searchText != '') {
            whereStr = `catname like '%${params.searchText}%' `;
            where = {catname:`like '%${params.searchText}%'`};
        }

        const totalSql = `select count(*) as total from cat where ${whereStr}`;
        console.log(totalSql);
        const [total, rows] = await Promise.all([
            this.app.mysql.query(totalSql),
            this.app.mysql.select('cat', {
                where: {catname:"人生"},
                columns: ['cat_id', 'catname', 'num'],
                orders: [['cat_id', 'desc']],
                limit: limit,
                offset: offset
            })
        ]);

        if(rows){
            rows.map((item)=>{
                item.goods=item.catname;
            });
        }

        return { total: total[0].total, rows };
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