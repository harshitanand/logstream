'use strict';

const cookie = require('cookie');
const SocketIO = require('socket.io');
const cookieParser = require('cookie-parser');

const init = (path, appServer, doAuthorization, sessionSecret) => {
  const io = new SocketIO({ path: `${path}/socket.io` });
  io.attach(appServer);

  if (doAuthorization) {
    io.use((sock, next) => {
      const ping = sock.request;
      if (ping.headers.cookie) {
        const cookieData = cookie.parse(ping.headers.cookie);
        const sessionCookie = cookieData['connect.sid'];
        if (!sessionCookie) {
          return next(new Error('Session cookie not provided'), false);
        }
        const sessionId = cookieParser.signedCookie(sessionCookie, sessionSecret);
        if (sessionId) {
          return next(null);
        }
        return next(new Error('Wrong cookie data'), false);
      }

      return next(new Error('No cookie found'), false);
    });
  }
  return io;
};

module.exports = init;
