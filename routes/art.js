const express = require('express');

const router = express.Router();

// Require controller modules.
const artController = require('../controllers/artController');

// GET main Art page.
router.get('/', artController.art_index);

// GET for Lineart 1.
router.get('/lineart', artController.art_lineart);

// GET for Lineart 2.
router.get('/lineart2', artController.art_lineart2);

// GET for Lineart 3.
router.get('/lineart3', artController.art_lineart3);

// GET for Circles
router.get('/circles', artController.art_circles);

module.exports = router;
