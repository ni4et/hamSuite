var express = require('express');
var router = express.Router();

/* GET file from views. */
router.get('/', function (req, res, next) {
  const view = req.url;
  console.log('Views.js: view=', view);
  //console.log('Views:cookies ', req.cookies);
  // Cookies will determine socketio urls as well as some displayed values

  res.render(view, { cookies: req.cookies });
  //console.log('in index,js', { cookies: req.cookies });
});
module.exports = router;
