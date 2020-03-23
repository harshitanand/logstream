'use strict';

const fileWatcher = require('./file_watcher');
const nextLine = require('./next_line');

module.exports = {
  ...fileWatcher,
  ...nextLine,
};
