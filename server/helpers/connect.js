'use strict';

const connect = require('connect');
const fs = require('fs');
const serveStatic = require('serve-static');
const expressSession = require('express-session');
const basicAuth = require('basic-auth-connect');

class Connect {
  constructor(urlPath) {
    this.app = connect();
    this.urlPath = urlPath;
  }

  auth(username, password) {
    this.app.use(
      this.urlPath,
      basicAuth((incomingUser, incomingPass) => username === incomingUser && password === incomingPass)
    );

    return this;
  }

  index(path, file, fileNamespace) {
    this.app.use(this.urlPath, (req, res) => {
      fs.readFile(path, (err, data) => {
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
        res.end(
          data
            .toString('utf-8')
            .replace(/__TITLE__/g, file)
            .replace(/__NAMESPACE__/g, fileNamespace)
            .replace(/__PATH__/g, this.urlPath),
          'utf-8'
        );
      });
    });

    return this;
  }

  session(secret) {
    this.app.use(
      this.urlPath,
      expressSession({
        secret,
        resave: false,
        saveUninitialized: true,
      })
    );
    return this;
  }

  static(path) {
    this.app.use(this.urlPath, serveStatic(path));
    return this;
  }

  build() {
    return this.app;
  }
}

module.exports = urlPath => new Connect(urlPath);
