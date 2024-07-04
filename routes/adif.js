var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'public/adif/' });

const app = express();

app.post('/adif', upload.single('adif'), function (req, res, next) {
  // req.file is, argument 1 is the field name.
  // req.body will hold the text fields, if there were any
});

module.exports = router;
