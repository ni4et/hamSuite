'use strict';

/**
 * Module dependencies.
 */
// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set
let log = () => {};
if (process.env.DEBUG) {
  const path = require('path');
  log = require('debug')(path.basename(__filename));
}

log('loading bin/www.js');

/**
 * Get port from environment and store in Express.
 */
const app = require('../app.js');
globalThis.app = app; // Make app available globally

const port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);

/**
 * Create HTTP httpServer.
 *
 */

const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();

////

/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port);
log(`Listening on port ${port}`);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

const io = new Server(httpServer, {
  /* options */
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

globalThis.io = io; // Make io available globally

///
io.on('connection', (socket) => {
  log('new socketio connection established');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  log(`normalizePort(${val})`);

  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP httpServer "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP httpServer "listening" event.
 */

function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  //debug('Listening on ' + bind);
}
