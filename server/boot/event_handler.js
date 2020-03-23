'use strict';

module.exports = () => {
  // eslint-disable-next-line global-require
  const { EventEmitter } = require('events');
  const eventEmitter = new EventEmitter();
  return eventEmitter;
};
