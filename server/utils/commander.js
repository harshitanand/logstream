/* eslint-disable no-undef */

'use strict';

const cmd = require('commander');

cmd
  .arguments('<filepath>')
  .version(require('../../package.json').version)
  .usage('[options] file')
  .helpOption('--help')
  .option('-h, --host <host>', 'hostname for app default listen IP, default 0.0.0.0', String, '0.0.0.0')
  .option('-p, --port <port>', 'port for app default listen socket, default 50051', Number, 50051)
  .option('-l, --lines <lines>', 'number on lines stored in browser, default 2000', Number, 2000)
  .option('-U, --user <username>', 'Basic Auth username, option works only along with -P option', String, false)
  .option('-P, --password <password>', 'Basic Auth password, option works only along with -U option', String, false)
  .option(
    '-k, --key <key.pem>',
    'Private Key for HTTPS connections on app, option works only along with -c option',
    String,
    false
  )
  .option(
    '-c, --certificate <cert.pem>',
    'Certificate for HTTPS connections on app, option works only along with -k option',
    String,
    false
  )
  .option('--url-path <path>', 'URL route pattern for client app, default /', String, '/');

module.exports = cmd;
