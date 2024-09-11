let dbg = require("debug");

// enable this way: dbg.app.enabled=true;
// set options this way: dbg.app.inspectOpts={depth:1};

//app = dbg("app"); // access as dbg.app
exports.app = dbg("app");
exports.route = dbg("route");
exports.www = dbg("www");
