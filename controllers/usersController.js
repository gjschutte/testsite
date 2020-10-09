const passport = require('passport');
const winLogger = require('../winlogger');
const User = require('../models/user');

// GET the users index page
exports.users_index = (req, res, next) => {
  winLogger.info('GET for users');
  if (typeof req.user !== 'undefined') {
    User.findOne({ username: req.user.username }, 'avatar')
      .exec((err, avatar) => {
        if (err) { return next(err); }
        // Successfull. Add the avatar link to the user object
        req.user.avatar = avatar;
        return 0;
      });
  }
  res.render('user/index', { title: 'User page', user: req.user });
};

// Redirect function in case of not logged in
exports.redirect_login = (req, res) => {
  req.session.error = 'This page requires that you are logged in';
  res.redirect('/users/users_signin');
};

// Display the signin and registration page.
exports.users_signin = (req, res) => {
  let message;

  if (typeof req.session.error !== 'undefined') {
    message = req.session.error;
    delete req.session.error;
    console.log(`req.session: ${req.session.error}`);
  }
  res.render('user/signin', { title: 'Sign In', message });
  return 0;
};

// Display the registration page.
exports.users_signup = (req, res) => {
  let message;

  if (typeof req.session.error !== 'undefined') {
    message = req.session.error;
    delete req.session.error;
    console.log(`req.session: ${req.session.error}`);
  }
  res.render('user/signup', { title: 'Sign Up', message });
  return 0;
};

exports.local_reg_post = (req, res, next) => {
  console.log('Local registration');
  console.log(req.body);
  console.log(req.session.returnTo);

  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    avatar: 'https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_960_720.png',
  });

  User.findOne({ username: req.body.username })
    .exec((err, foundUser) => {
      if (err) { return next(err); }
      if (foundUser) {
        // User already exists
        console.log('User already exists');
        req.session.error = 'User already exists';
        res.redirect('/users/users_signin');
        return false;
      }
      User.register(newUser, req.body.password, (errMes, user) => {
        if (errMes) { return next(errMes); }
        // User registered, loging in

        console.log(`Registered! ${user}`);
        req.login(newUser, (errorMes) => {
          if (errorMes) { return next(errorMes); }
          console.log('You are successfully registered');
          return 0;
        });

        if (typeof req.session.returnTo !== 'undefined') {
          return res.redirect(req.session.returnTo);
        }
        return res.redirect('/users');
      });
      return 0;
    });
};

exports.local_login = (req, res, next) => {
  console.log('Local login');
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }

    console.log(`req.sesion:  ${req.session}`);
    console.log(`Info: ${info}`);

    if (!user) {
      /* Wrong password */
      console.log('Wrong password');
      req.session.error = 'Wrong username/password, please try again';
      return res.redirect('/users/users_signin');
    }
    console.log('Good password');
    req.logIn(user, (errorMes) => {
      if (errorMes) {
        return next(errorMes);
      }
      return 0;
    });

    if (typeof req.session.returnTo !== 'undefined') {
      return res.redirect(req.session.returnTo);
    }
    return res.redirect('/users');
  })(req, res, next);
};

exports.logout = (req, res) => {
  const name = req.user.username;
  console.log(`LOGGIN OUT ${req.user.username}`);
  req.logout();
  res.redirect('/users');
  req.session.notice = `You have successfully been logged out ${name}!`;
};
