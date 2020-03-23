/* eslint-disable consistent-return */

'use strict';

const fs = require('fs');
const { reader } = require('./next_line');

const init = async file => {
  const options = {
    file,
    fsWait: false,
    cursorPointer: 0,
  };

  let pointer = await reader(options.cursorPointer, options.file);
  options.cursorPointer = pointer + 1;
  fs.watch(options.file, async () => {
    if (options.fsWait) return Promise.resolve('done');
    options.fsWait = setTimeout(() => {
      options.fsWait = false;
    }, 100);

    if (md5Current === md5Previous) {
      return Promise.resolve('done');
    }

    md5Previous = md5Current;
    pointer = await reader(options.cursorPointer, options.file);
    options.cursorPointer = pointer + 1;
  });
};

module.exports = {
  init,
};
