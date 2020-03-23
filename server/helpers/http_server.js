'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');

class Server {
  constructor() {
    this._host = null;
    this._port = 9001;
  }

  build() {
    if (this._key && this._cert) {
      const options = {
        key: this._key,
        cert: this._cert,
      };
      return https.createServer(options, this._callback).listen(this._port, this._host);
    }

    return http.createServer(this._callback).listen(this._port, this._host);
  }

  host(host) {
    this._host = host;
    return this;
  }

  port(port) {
    this._port = port;
    return this;
  }

  secure(key, cert) {
    try {
      this._key = fs.readFileSync(key);
      this._cert = fs.readFileSync(cert);
    } catch (e) {
      throw new Error('No key or certificate file found');
    }

    return this;
  }

  use(callback) {
    this._callback = callback;
    return this;
  }
}

module.exports = () => new Server();
