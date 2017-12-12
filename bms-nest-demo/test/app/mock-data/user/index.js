'use strict';
// bee
const BEE = require('./bee');

// plat
const PLAT = {
  admin: require('./plat-admin'),
  shop_admin: require('./plat-shop-admin'),
};

// shop
const SHOP = {
  admin: require('./shop-admin'),
  financer: require('./shop-financer'),
};

const sessionToken = function* (ctx, user) {
  const token = ctx.helper.generateToken(user);
  yield ctx.helper.setUserCache(token, JSON.stringify(user));
  return token;
};

module.exports.BEE = ctx => sessionToken(ctx, BEE);

module.exports.PLAT = {
  admin: ctx => sessionToken(ctx, PLAT.admin),
  shop_admin: ctx => sessionToken(ctx, PLAT.shop_admin),
};

module.exports.SHOP = {
  admin: ctx => sessionToken(ctx, SHOP.admin),
  financer: ctx => sessionToken(ctx, SHOP.financer),
};
