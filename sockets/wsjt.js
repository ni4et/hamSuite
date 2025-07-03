let debugPrint = debug('wsjt.js');
debugPrint('starting wsjt-x socket server');

function wsjtInit() {
  const { Server } = require('socket.io');
  const io = new Server();
  let socket = null; // Initialize socket variable

  // TODO setup a namespace for wsjt-x

  io.on('connection', (socket) => {
    console.log('A client connected to wsjt-x socket server:', socket.id);
    socket = socket; // Make socket available in the scope

    // Register 'on' methods for events from the client.
    // none at this time.

    socket.on('disconnect', () => {
      console.log('Client disconnected from wsjt-x socket server:', socket.id);
    });
  });

  //console.log('wsjt-x socket server starting...');
  //const cluster = require('node:cluster');
  const dgram = require('node:dgram');
  const server = dgram.createSocket('udp4');
  const parser = require('../lib/wsjt-x-parser');

  var clientInfo;

  //console.log(server);
  server.on('error', (err) => {
    console.error(`server error\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    decodedMsg = parser.decode(msg);
    if (decodedMsg.type == 'decode') {
      clientInfo = rinfo;
      //console.log(decodedMsg, rinfo);
      //console.log(`from: ${rinfo.address}:${rinfo.port}`);
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

      //console.log(decode);
    } else if (decodedMsg.type == 'status') {
      dbgp(decodedMsg);
      if (socket) {
        decodedMsg.freqency = Number(decodedMsg.freqency);
        socket.emit('status', decodedMsg);
        dbgp(decodedMsg.time);
      }
    }
  });

  server.on('listening', () => {
    const address = server.address();
    debugPrint(`server listening ${address.address}:${address.port}`);
  });

  server.bind(2237, '0.0.0.0');
  module.exports = registerWSJTX;
  function registerWSJTX() {
    dbgp('registerWSJTX');

    // Register 'on' methods for events from the client.
    // none at this time.
  }

  setTimeout(() => {}, 1000);
}

module.exports = wsjtInit;
