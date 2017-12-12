'use strict';

module.exports = proxy => {
  class Me extends proxy.UserCenter {
    get module() { return 'user'; }
    get name() { return 'me'; }
    get path() { return '/me'; }
  }
  return Me;
};
