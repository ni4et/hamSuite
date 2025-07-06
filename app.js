//const dbg = require("./lib/dbg");
//dbg.app.enabled = true;
//dbg.app("App debug enabled!"); //console.clear();
require('dotenv').config();

// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set
let log = () => {};
if (process.env.DEBUG) {
  const path = require('path');
  log = require('debug')(path.basename(__filename));
}
// End of debug utility

console.log(`debugging:${process.env.DEBUG}`);

// Model for making an async function in a non-module

/* 
(async () => {
  console.log('that');
})();
*/

// This is how items in user, system, and .env are accessed:
//console.log(process.env.DEBUG);

const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routers in /routes
const indexRouter = require('./routes/index');
const dataRouter = require('./routes/data');

// Dubugging stuff
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const liveReloadServer = livereload.createServer();
// https://dev.to/cassiolacerda/automatically-refresh-the-browser-on-node-express-server-changes-x1f680-1k0o
// https://github.com/livereload/livereload-js
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// socket.io setup
const { Server } = require('socket.io');
const io = new Server(globalThis.server, {
  /* options */
});
globalThis.io = io; // Make io available globally

// Get the station information, equipment, and network locations.
// global scope
const stationSettings = require('./public/assets/stationSettings.json');
const stationSettingsDefault = {};

for (let keya in stationSettings) {
  // list of settings
  let vala = stationSettings[keya]; // details of settings
  if (vala.list) {
    // if vala.list exists then vala[0] is the default option
    stationSettingsDefault['stationSettings_' + keya] = vala.list[0].name;
  }
}
// stationSettingsDefault will be merged with cookies for rendering
//console.log(stationSettingsDefault);

// ------------------
const app = express();
// ------------------

// Load the station settings file so that server rendering can use it.
globalThis.stationSettings = stationSettings; // Make stationSettings available globally
app.locals.stationSettings = stationSettings;

// Install live reload js:
app.use(connectLiveReload());

if (process.env.TRACEHTTP === 'all') {
  // This logs almost all requests.
  app.use(logger('dev'));
}
// This logs only response codes >=400.
else if (process.env.TRACEHTTP === 'errors') {
  app.use(
    logger('dev', {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );
}

// Serve favicon https://expressjs.com/en/resources/middleware/serve-favicon.html
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// view engine setup
// EJS is preferred since C/P links all provide straight HTML.
// Besides: VSCode does most of what pug would do in the editor.
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Merge the set cookies with the defaults so that everything will
// have a setting when rendered whether or not a cookie was
// actually set.

app.use(function (req, res, next) {
  let tmp = { ...stationSettingsDefault, ...req.cookies };
  req.cookies = tmp;

  next();
});

const qs = require('qs');
const { enableCompileCache } = require('module');

app.set('query parser', function (str) {
  return qs.parse(str, {
    /* custom options */
  });
});

// Files in 'public' appear at the top level.
app.use(express.static(path.join(__dirname, 'public')));

// Serves node_modules as /assets/npm, to facilite popper and bootstrap.
// Urls for these are C/P with minimal editing.
app.use('/assets/npm', express.static(path.join(__dirname, 'node_modules')));

// Just do a no-op get in order to sync the server's cookies with the client.
// the event callback in the view does this as the last thing after
// setting the cookie on the client. TODO less expensive way to do this?
app.get(
  '/refreshCookies',

  function (req, res) {
    res.send('Thank You!');
  }
);
app.use('/', indexRouter);

app.use('/data', dataRouter); // Database lives under here!

/* GET file from views. */
app.get('/\\w+', function (req, res, next) {
  const view = req.url.substring(1);

  // render any ejs file in

  res.render(view, {
    cookies: req.cookies,
    title: 'HamSuite (app.js)',
    view: view,
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
log('App loading sub applications...');

const wsjtInit = require('./sockets/wsjt');
wsjtInit();

const pollRadioInit = require('./sockets/pollRadio');
pollRadioInit();
log('App done loading sub applications...');
io.of('/chat'); //
const namespaces = Array.from(io._nsps.keys());
log(namespaces); // e.g., [ '/', '/chat', '/admin', '/a/b/c' ]

module.exports = app;
