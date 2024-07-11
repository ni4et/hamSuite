console.clear();
require('dotenv').config();

// This is how items in user, system, and .env are accessed:
//console.log(process.env.DEBUG);

var createError = require('http-errors');
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

//var viewsRouter = require('./routes/views');
var livereload = require('livereload');
var connectLiveReload = require('connect-livereload');
const liveReloadServer = livereload.createServer();

// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Ping the browser

// https://dev.to/cassiolacerda/automatically-refresh-the-browser-on-node-express-server-changes-x1f680-1k0o
// https://github.com/livereload/livereload-js
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// ------------------
var app = express();
// ------------------

// Load the station settings file so that server rendering can use it.

stationSettings = require('./public/assets/stationSettings.json');
app.locals.stationSettings = stationSettings;

// Install live reload js:
app.use(connectLiveReload());

// This logs almost all requests.
// app.use(logger('dev'));
// This logs only response codes >=400.
app.use(
  logger('common', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

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

var qs = require('qs');
app.set('query parser', function (str) {
  return qs.parse(str, {
    /* custom options */
  });
});

app.post('/setCookies', (req, res) => {
  for (c in stationSettings) {
    val = req.body[c];

    // Turn returned values into cookies.
    // By not removing url encoding I can maybe use val as a key.

    res.cookie('stationSettings_' + c, val);
  }
  //  res.cookie('stationSettings', JSON.stringify(req.body));
  res.locals['result'] = 'good';
  res.render('submit');
});

app.post('/uploadADIF', (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/uploads/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.locals['result'] = uploadPath;
    res.render('submit');
  });
});

// Files in 'public' appear at the top level.
app.use(express.static(path.join(__dirname, 'public')));

// Serves node_modules as /assets/npm, to facilite popper and bootstrap.
// Urls for these are C/P with minimal editing.
app.use('/assets/npm', express.static(path.join(__dirname, 'node_modules')));

app.use('/', indexRouter);

/* GET file from views. */
app.get('/\\w+', function (req, res, next) {
  const view = req.url.substring(1);

  // render any ejs file in
  console.dir(req.cookies);
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

module.exports = app;
