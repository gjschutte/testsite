require('dotenv').config();

// GET the weather index page
exports.art_index = (req, res, next) => {
  res.render('art/index', { title: 'Computer art' });
};

// GET the Lineart 1 page
exports.art_lineart = (req, res, next) => {
  res.render('art/lineart', { title: 'Line art' });
};

// GET the Lineart 2 page
exports.art_lineart2 = (req, res, next) => {
  res.render('art/lineart2', { title: 'Line art 2' });
};

// GET the Lineart 3 page
exports.art_lineart3 = (req, res, next) => {
  res.render('art/lineart3', { title: 'Line art 3' });
};

// GET the Circle page
exports.art_circles = (req, res, next) => {
  res.render('art/circles', { title: 'circles' });
};
