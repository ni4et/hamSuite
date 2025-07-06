// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set

// =============================================
// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set
let log = () => {};
if (process.env.DEBUG) {
  const path = require('path');
  log = require('debug')(path.basename(__filename));
}
// ==============================================
log('loading pollRadio.js');
// End of debug utility
// End of debug utility
const io = globalThis.io; // Use the global io instance from bin/www.js
log(`io=${io}`);

function pollRadioInit() {
  // Things to ask the radio:
  const QUERIES = [
    { type: 'TX', set: 'T', get: 't' },
    { type: 'Frequency', set: 'set_freq', get: 'f' },
    { type: 'Mode', set: 'set_mode', get: 'm' },
    { type: 'Power', get: 'l RFPOWER_METER_WATTS' },
    { type: 'SWR', get: 'l SWR' },
  ];

  const { stat } = require('fs');

  log('starting pollRadio');
  // log.extend('section') -- add finer grained debugging

  const net = require('net');

  const SERVERS = globalThis.stationSettings.hamlib.list;

  // Set up namespaces for each server
  SERVERS.forEach((serverInfo) => {
    const namespaceID = `/hamLib/${serverInfo.name}`;

    const nsp = io.of(namespaceID);

    const hamlibSocket = new net.Socket();
    hamlibSocket.counter = 0;
    hamlibSocket.setNoDelay(true); // Disable Nagle's algorithm.

    nsp.on('connection', (socket) => {
      log(`User connected to  ${namespaceID}`, socket.id);
      if (nsp.sockets.size == 1) {
        // First one:
        hamlibSocket.connect(serverInfo.port, serverInfo.host, () => {
          console.log(`Connected to: ${serverInfo.host}:${serverInfo.port}`);
        });
        hamlibSocket.setNoDelay(true); // Disable Nagle's algorithm.
      }
      ///
      socket.on(
        'disconnect',
        () => {
          log(`User disconnected from ${namespaceID}:`, socket.id);
          if (nsp.sockets.size == 0) {
            // First one:
            hamlibSocket.connect(serverInfo.port, serverInfo.host, () => {
              console.log(`disconnect: ${serverInfo.host}:${serverInfo.port}`);
              hamlibSocket.destroy();
              hamlibSocket = null;
            });
          }
        } /*ends socket.on disconnect callback */
      ) /* ends socket.on disconnect */;
      //
    });
    /* ends nsp.on connect callback*/
  }); // ends SERVERS.forEach
}

module.exports = pollRadioInit;
