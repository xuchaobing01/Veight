'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/cat/list',controller.cats.list);
  router.post('/cat/detail',controller.cats.show);
  router.post('/cat/create',controller.cats.create);
  router.post('/cat/edit',controller.cats.edit);  
  router.post('/cat/del',controller.cats.del);
  
};
