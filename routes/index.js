var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Career Chart for T* people' });
});

module.exports = router;
