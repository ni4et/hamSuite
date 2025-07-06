// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set
let log = () => {};
if (process.env.DEBUG) {
  const path = require('path');
  log = require('debug')(path.basename(__filename));
}
// End of debug utility

function wsjtInit() {
  const io = globalThis.io; // Use the global io instance from bin/www.js

  let socket = null; // Initialize socket variable

  // TODO setup a namespace for wsjt-x
  nsp = io.of(`/wsjtx/localhost`);

  nsp.on('connection', (socket) => {
    log('A client connected to wsjt-x socket server:', socket.id);
    socket = socket; // Make socket available in the scope

    // Register 'on' methods for events from the client.
    // none at this time.

    socket.on('disconnect', () => {
      log('Client disconnected from wsjt-x socket server:', socket.id);
    });
  });

  //log('wsjt-x socket server starting...');
  //const cluster = require('node:cluster');
  const dgram = require('node:dgram');
  const server = dgram.createSocket('udp4');
  const parser = require('../lib/wsjt-x-parser');

  var clientInfo;

  //log(server);
  server.on('error', (err) => {
    console.error(`server error\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    decodedMsg = parser.decode(msg);
    if (decodedMsg.type == 'decode') {
      clientInfo = rinfo;
      //log(decodedMsg, rinfo);
      //log(`from: ${rinfo.address}:${rinfo.port}`);
      //console.dir(decodedMsg);
      let decode = {
        snr: decodedMsg.snr,
        delta_frequency: decodedMsg.delta_frequency,
        message: decodedMsg.message,
        type: decodedMsg.message_decode.type,
        time: decodedMsg.time,
        de_call: decodedMsg.de_call,
      };
      socket.emit('decode', decode);

      //log(decode);
    } else if (decodedMsg.type == 'status') {
      log(decodedMsg);
      if (socket) {
        decodedMsg.freqency = Number(decodedMsg.freqency);
        socket.emit('status', decodedMsg);
        log(decodedMsg.time);
      }
    }
  });

  server.on('listening', () => {
    const address = server.address();
    log(`server listening ${address.address}:${address.port}`);
  });

  server.bind(2237, '0.0.0.0');
  module.exports = registerWSJTX;
  function registerWSJTX() {
    log('registerWSJTX');

    // Register 'on' methods for events from the client.
    // none at this time.
  }

  setTimeout(() => {}, 1000);
}

module.exports = wsjtInit;
