'use strict';

const globalInit = require('./global');

const init = async filePath => {
  await globalInit(filePath);
  return Promise.resolve('Boot init done !!');
};

module.exports = init;
