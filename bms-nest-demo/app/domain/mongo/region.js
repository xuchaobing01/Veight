'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const RegionSchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
    category: { type: String }, // 类别，province、city、area
    parent: { type: String, ref: 'region' },
    ancestors: [ String ], // 上级
  });
  RegionSchema.index({ code: 1 });
  return mongoose.model('region', RegionSchema);
};
