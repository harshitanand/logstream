'use strict';

const evHandler = require('./event_handler');
const fileChecksum = require('./file_checksum');

const init = async filePath => {
  global.event = evHandler();
  const { md5Current, md5Previous } = await fileChecksum(filePath);
  global.md5Current = md5Current;
  global.md5Previous = md5Previous;
  return Promise.resolve('App level globals set');
};

module.exports = init;
