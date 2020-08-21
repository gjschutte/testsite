const async = require('async');
const passport = require('passport');
const winLogger = require('../winlogger');
const User = require('../models/user');

// GET the users index page
exports.users_index = (req, res, next) => {
  winLogger.info('GET for users');
  console.log('Req user last: ' + req.user);
  if (typeof req.user !== 'undefined') {
    User.findOne({ username: req.user.username }, 'avatar')
      .exec((err, avatar) => {
        if (err) { return next(err); }
        // Successfull. Add the avatar link to the user object
        req.user.avatar = avatar;
      });
  };
  res.render('user/index', { title: 'User page', user: req.user });
};

// Redirect function in case of not logged in
exports.redirect_login = (req, res) => {
  req.session.error = "This page requires that you are logged in";
  res.redirect('/users/users_signin');
};

// Display the signin and registration page.
exports.users_signin = (req, res) => {
  let message;

  if (typeof req.session.error !== undefined ) {
    message = req.session.error;
    delete req.session.error;
    console.log('req.session: ' + req.session.error);
  };
  res.render('user/signin', { title: 'Sign In', message: message });
  return 0;
};

exports.local_reg_post = (req, res, next) => {
  console.log("Local registration");
  console.log(req.body);
  console.log(req.session.returnTo);

  const newUser = new User({
    username: req.body.username,
    avatar: "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_960_720.png",
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
      } else {
        User.register(newUser, req.body.password, function(errMes, user) {
          if (errMes) {return next(errMes); };
          // User registered, loging in

          console.log('Registered!');
          req.login(newUser, function(err) {
            if (err) {return next(err); }
            console.log('You are successfully registered');
          });

          if (typeof req.session.returnTo !== 'undefined') {
            return res.redirect(req.session.returnTo);
          } else {
            return res.redirect('/users');
          };

          return user;
        });
      };
    });
}

exports.local_login = (req, res, next) => {
  console.log("Local login");
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next (err);
    }
    console.log("req.sesion: " + req.session);

    if (!user) {
      /* Wrong password */
      req.session.message = "Wrong username/password, please try again";
      return res.redirect('/users/users_signin');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      };
    });

    if (typeof req.session.returnTo !== 'undefined') {
      return res.redirect(req.session.returnTo);
    } else {
      return res.redirect('/users');
    };

  })(req, res, next);
};

exports.logout = (req, res) => {
  const name = req.user.username;
  console.log(`LOGGIN OUT ${req.user.username}`);
  req.logout();
  res.redirect('/');
  req.session.notice = `You have successfully been logged out ${name}!`;
};
