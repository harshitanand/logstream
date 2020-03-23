'use strict';

const fs = require('fs');
const md5 = require('md5');

const init = filePath => {
  const md5Previous = undefined;
  const md5Current = md5(fs.readFileSync(filePath));
  return { md5Previous, md5Current };
};

module.exports = init;
