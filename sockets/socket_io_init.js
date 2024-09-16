// https://socket.io/docs/v4/server-initialization/#with-express
const dbg = require("../lib/dbg");
dbgp = dbg.socket_io_init;

dbgp.enabled = false;
dbgp(" debug enabled!");

const { Server } = require("socket.io");
// Called from www
function initSocketIO(server) {
  var io = new Server(server, {
    /* options */
  });

  ///////

  // https://socket.io/docs/v4/server-application-structure/#each-file-registers-its-own-event-handlers
  // A js function in the client will initiate the connection message.
  // io.on will call registerXXX functions with the socket so that the events of interest can be registered.

  io.on("connection", (socket) => {
    dbgp("On connection");

    socket.on("chat message", (msg) => {
      // Leave in place for the sake of sanity checks for now.
      dbgp("msg " + msg);
    });

    // {registerXXXXX=require('xxxx');
    // registerXXXXX(io, socket);  -
    // event handlers that are needed will be resgistered in the xxxx module.
    // This makes the most sense with my application structure.

    registerWSJTX = require("./wsjt.js");
    registerWSJTX(io, socket);
  });
}

///////////////////
module.exports = initSocketIO;
