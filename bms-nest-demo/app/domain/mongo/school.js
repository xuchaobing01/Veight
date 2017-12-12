'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const SchoolSchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
    city: { type: String },
  });
  SchoolSchema.index({ name: 1, city: 1 });
  return mongoose.model('school', SchoolSchema);
};
