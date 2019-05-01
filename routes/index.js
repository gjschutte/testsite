var express = require('express');
var router = express.Router();

// Get environment variable
const { TESTVAR } = process.env;
console.log('Environment variable 1: ', TESTVAR);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
