'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log(this.ctx.request.body);
    console.log(this.ctx.request.query);
    this.ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
