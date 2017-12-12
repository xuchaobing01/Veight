'use strict';

const mm = require('egg-mock');
describe('test/index.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'app',
    });
    return app.ready();
  });

  afterEach(mm.restore);
});
