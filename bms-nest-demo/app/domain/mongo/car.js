'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const carSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    initial: String,
    productionstate: String,
    sizetype: String,
    brand_id: String,
    brand_name: String,
    sub_brand_id: String,
    sub_brand_name: String,
    type_id: String,
    type_name: String,
    import: Number,
    year: String,
  });

  return mongoose.model('car', carSchema);
};
