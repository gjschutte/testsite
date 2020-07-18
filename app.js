// Include environment file
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
// Add compression, for faster traffic
const compression = require('compression');
// Add helmet, for setting HTTP headers (security)
const helmet = require('helmet');
const winLogger = require('./winlogger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(helmet());

// Set up mongoose connection
const { DBLOGIN } = process.env;
const { DBPASSWORD } = process.env;
const { DBCOMMAND } = process.env;
winLogger.info(`DBCOMMAND: ${DBCOMMAND}`);

const mongoDB = `mongodb://${DBLOGIN}:${DBPASSWORD}${DBCOMMAND}`;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
// If the connection throws an error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// If the connection is succesfull
db.once('open', () => {
  console.log('Mongoose connection succesfully opened');
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
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
