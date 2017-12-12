'use strict';

// 任务
module.exports = app => {
  const mongoose = app.mongoose;
  const { ObjectId } = mongoose.Schema.Types;
  const historySchema = new mongoose.Schema({
    /* mole:{ type: String },//类型
    id:{ type: ObjectId },//id*/
    relate_user: [{
      form: { type: String }, // 类型
      id: { type: ObjectId }, // id
      name: { type: String }, // name
      total: { type: String },

    }],
  });

  return mongoose.model('history', historySchema);
};
