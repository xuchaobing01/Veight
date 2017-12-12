'use strict';

module.exports = app => {
  class CarService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.ctx.getModel('car');
    }

    * doSearch(qkey, size = 20) {
      if (!qkey) return {};
      const query = { name: { $regex: `.*${qkey}.*`, $options: 'i' } };
      const data = yield this.model.find(query).limit(size);
      return { list: data };
    }

    * getBrandList() {
      const groupargs = {
        _id: { initial: '$brand_initial', id: '$brand_id' },
        name: { $first: '$brand_name' },
      };
      const sortargs = { '_id.initial': 1, name: 1 };
      const data = yield this.model.aggregate()
        .group(groupargs)
        .sort(sortargs)
        .exec();

      const brandlist = {};
      let info;
      for (const brand of data) {
        info = { id: brand._id.id, name: brand.name };
        if (!brandlist[brand._id.initial]) {
          brandlist[brand._id.initial] = [ info ];
        } else {
          brandlist[brand._id.initial].push(info);
        }
      }

      return brandlist;
    }

    * getTypeListById(brandid) {
      brandid = brandid.toString();
      const matchargs = { brand_id: brandid };
      const groupargs = {
        _id: { sub_brand_name: '$sub_brand_name', id: '$type_id' },
        name: { $first: '$type_name' },
      };
      const sortargs = { '_id.sub_brand_name': 1, name: 1 };
      const data = yield this.model.aggregate()
        .match(matchargs)
        .group(groupargs)
        .sort(sortargs)
        .exec();

      const typelist = {};
      let info;
      for (const type of data) {
        info = { id: type._id.id, name: type.name };
        if (!typelist[type._id.sub_brand_name]) {
          typelist[type._id.sub_brand_name] = [ info ];
        } else {
          typelist[type._id.sub_brand_name].push(info);
        }
      }

      return typelist;
    }

    * getModelListById(typeid) {
      typeid = typeid.toString();
      const matchargs = { type_id: typeid };
      const groupargs = {
        _id: { year: '$year', id: '$id' },
        name: { $first: '$name' },
      };
      const sortargs = { '_id.year': -1, name: 1 };
      const data = yield this.model.aggregate()
        .match(matchargs)
        .group(groupargs)
        .sort(sortargs)
        .exec();

      const modellist = {};
      let info,
        year_name;
      for (const model of data) {
        year_name = model._id.year + '款';
        info = { id: model._id.id, name: model.name };
        if (!modellist[year_name]) {
          modellist[year_name] = [ info ];
        } else {
          modellist[year_name].push(info);
        }
      }

      return modellist;
    }

  }

  return CarService;
};
