'use strict';

const signature = {
  path: { type: 'string', required: true },
};

const deleteFile = {
  keys: { type: 'string', required: true },
};

module.exports = { signature, deleteFile };
