var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routes/index');
var charts = require('./routes/chart');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/chart', charts);

app.use(function(req, res, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        status: error.status,
    });
});

app.listen(process.env.VCAP_APP_PORT || 3000);
