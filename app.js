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
const session = require('express-session');
const passport = require('passport');
// const localStrategy = require('passport-local');
const winLogger = require('./winlogger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
const weatherRouter = require('./routes/weather');
const artRouter = require('./routes/art');

const User = require('./models/user');

const app = express();

app.use(helmet());

// Set up mongoose connection
const { DBLOGIN } = process.env;
const { DBPASSWORD } = process.env;
const { DBCOMMAND } = process.env;
const { PPSECRET } = process.env;
winLogger.info(`DBCOMMAND: ${DBCOMMAND}`);

const mongoDB = `mongodb+srv://${DBLOGIN}:${DBPASSWORD}${DBCOMMAND}`;
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
app.use(session({ secret: PPSECRET, saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(compression()); // compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/weather', weatherRouter);
app.use('/art', artRouter);

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

// Configure passport for user authentication
passport.use(User.createStrategy({ usernameField: 'email' }));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = app;
