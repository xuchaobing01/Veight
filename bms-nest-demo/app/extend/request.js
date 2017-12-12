'use strict';

module.exports = {
  get token() {
    // const token = this.get('x-request-token');
    const token = (this.body.token) ? this.body.token : this.query.token;
    return token;
  },
};
