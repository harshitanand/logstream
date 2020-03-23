/* eslint-disable no-console */

'use strict';

const path = require('path');
const crypto = require('crypto');

const sock = require('./server/helpers/socket');
const boot = require('./server/boot');
const { init } = require('./server/utils');
const connect = require('./server/helpers/connect');
const appServer = require('./server/helpers/http_server');
const cmd = require('./server/utils/commander');

cmd.parse(process.argv);
if (cmd.args.length === 0) {
  console.error('Arguments needed, use --help');
  process.exit(1);
}

const isAuthorized = !!(cmd.user && cmd.password);
const isSecured = !!(cmd.key && cmd.certificate);
const sessionSecret = String(+new Date()) + Math.random();
const file = cmd.args.join(' ');
const urlPath = cmd.urlPath.replace(/\/$/, '');

const filesNamespace = crypto
  .createHash('md5')
  .update(file)
  .digest('hex');

const appBuilder = connect(urlPath);
if (isAuthorized) {
  appBuilder.session(sessionSecret);
  appBuilder.auth(cmd.user, cmd.password);
}
appBuilder
  .static(path.join(__dirname, 'client', 'assets'))
  .index(path.join(__dirname, 'client', 'index.html'), file, filesNamespace, cmd.theme);

const builder = appServer();
if (isSecured) {
  builder.secure(cmd.key, cmd.certificate);
}
const server = builder
  .use(appBuilder.build())
  .port(cmd.port)
  .host(cmd.host)
  .build();

boot(process.argv[2]).then(res => {
  console.log(res);
  const io = sock(urlPath, server, isAuthorized, sessionSecret);
  io.of(`/${filesNamespace}`).on('connection', socket => {
    init(process.argv[2]);

    socket.emit('linescount', cmd.lines);
    event.on('parse:message', data => {
      socket.emit('line', data);
    });
  });
});

const cleanExit = () => {
  process.exit();
};
process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
