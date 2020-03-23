'use strict';

const fs = require('fs');
const readline = require('readline');

const reader = async (n, file) =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    if (n < 0 || n % 1 !== 0) return reject(new RangeError(`Invalid line number`));

    let cursor = 0;
    const input = fs.createReadStream(file);
    const rl = readline.createInterface({ input });

    rl.on('line', line => {
      cursor += 1;
      if (cursor >= n) {
        event.emit('parse:message', `${cursor} ${line}`);
      }
    });

    rl.on('error', reject);

    input.on('end', () => {
      rl.close();
      input.close();
      resolve(cursor);
      // reject(outOfRangeError(filepath, n));
    });
  });

module.exports = {
  reader,
};
