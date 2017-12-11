'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/cat/list',controller.cats.list);
  router.get('/cat/detail',controller.cats.show);
  router.get('/cat/create',controller.cats.create);
  router.get('/cat/edit',controller.cats.edit);  
  router.get('/cat/del',controller.cats.del);
  
};
