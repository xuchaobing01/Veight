'use strict';

module.exports = app => {
  const OPS = app.myutil.OPS;
  const prevOps = {};

  prevOps.custInteract = [ OPS.create ];

  return prevOps;
};
