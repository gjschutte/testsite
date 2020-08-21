const express = require('express');

const router = express.Router();

// Require controller modules.
const usersController = require('../controllers/usersController');

// GET main users page.
router.get('/', usersController.users_index);

router.get('/redirect_login', usersController.redirect_login);

// GET users login page.
router.get('/users_signin', usersController.users_signin);

// POST users login page - signup
router.post('/local-reg', usersController.local_reg_post);

// POST users login page - signin
router.post('/login', usersController.local_login);

// GET users logout
router.get('/logout', usersController.logout);

module.exports = router;
