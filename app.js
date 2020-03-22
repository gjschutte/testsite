// Include environment file
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const winLogger = require('./winlogger');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');

// Add compression, for faster traffic
var compression = require('compression');
// Add helmet, for setting HTTP headers (security)
var helmet = require('helmet');

var app = express();

// Set the debug options
var debug = require('debug');
var generalLogger = debug("app:general");
var taskLogger = debug("app:task");

app.use(helmet());

// Set up mongoose connection
const { DBLOGIN } = process.env;
const { DBPASSWORD } = process.env;
const { DBCOMMAND } = process.env;
winLogger.info(`DBCOMMAND: ${DBCOMMAND}`);

var mongoose = require('mongoose');
var mongoDB = 'mongodb://' + DBLOGIN + ":" + DBPASSWORD + DBCOMMAND;
mongoose.connect(mongoDB, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
// If the connection throws an error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// If the connection is succesfull
db.on('connected', function () {
  winLogger.info('Mongoose connection succesfully opened');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
