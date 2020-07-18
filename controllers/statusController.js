const async = require('async');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const Status = require('../models/status');
const Task = require('../models/task');

// Display list of all statuss.
exports.status_list = (req, res, next) => {
  Status.find({}, 'description')
    .exec((err, listStatusses) => {
      if (err) { return next(err); }
      // Succesful, so render
      res.render('todo/status_list', { title: 'Status List', status_list: listStatusses });
      return 0;
    });
};

// Display detail page for a specifick status.
exports.status_detail = (req, res, next) => {
  async.parallel({
    status: (callback) => {
      Status.findById(req.params.id)
        .exec(callback);
    },

    status_tasks: (callback) => {
      Task.find({ status: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    let errorMessage = err;
    if (err) { return next(err); }
    if (results.status == null) { // no results.
      errorMessage = new Error('Status not found');
      errorMessage.status = 404;
      return next(errorMessage);
    }
    // Succesful, so render
    res.render('todo/status_detail', { title: 'Status detail', status: results.status, status_tasks: results.status_tasks });
    return 0;
  });
};

// Display status create form on GET.
exports.status_create_get = (req, res) => {
  res.render('todo/status_form', { title: 'Create status' });
};

// Handle category create form on POST.
exports.status_create_post = [
  // Validate that the name field is not empty
  check('name').not().isEmpty().withMessage('Name must have more than 5 characters'),

  // Sanitize (escape) the name field.
  body('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    console.log('In POST');

    // Extract the validation errors from the request.
    const errors = validationResult(req);

    // Create a category boject with escaped and trimmed data
    const status = new Status(
      { description: req.body.name },
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('todo/status_form', { title: 'Create status', status, errors: errors.array() });
    } else {
      // Data from form is valid
      // Check if Status with same name already exists.
      Status.findOne({ description: req.body.name })
        .exec((err, foundStatus) => {
          if (err) { return next(err); }

          if (foundStatus) {
            // Category exists, redirect to its detail page.
            res.redirect(foundStatus.url);
          } else {
            status.save((errorMes) => {
              if (errorMes) { return next(errorMes); }
              // Status saved. Redirect to status detail page.
              res.redirect(status.url);
              return 0;
            });
          }
          return 0;
        });
    }
  },
];

// Display status delete form on GET.
exports.status_delete_get = (req, res, next) => {
  async.parallel({
    status: (callback) => {
      Status.findById(req.params.id).exec(callback);
    },
    status_tasks: (callback) => {
      Task.find({ status: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.status == null) { // No results.
      res.redirect('/tasks/statusses');
    }
    // successfull, so render.
    res.render('todo/status_delete', { title: 'Delete Status', status: results.status, status_tasks: results.status_tasks });
    return 0;
  });
};

// Handle status delete on POST.
exports.status_delete_post = (req, res, next) => {
  async.parallel({
    status: (callback) => {
      Status.findById(req.body.statusyid).exec(callback);
    },
    status_tasks: (callback) => {
      Task.find({ status: req.body.statusyid }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }

    // Succes
    if (results.status_tasks.length > 0) {
      // Status has tasks. Render in same way as for GET route.
      res.render('todo/status_delete', { title: 'Delete Status', status: results.status, status_tasks: results.status_tasks });
    } else {
      // Status has no tasks. Delete status and redirect to the list of statusses
      Status.findByIdAndDelete(req.body.statusyid, (errorMes) => {
        if (errorMes) { return next(errorMes); }
        // Succes - go to status list
        res.redirect('/tasks/statusses');
        return 0;
      });
    }
    return 0;
  });
};

// Display status update form on GET.
exports.status_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: status update GET');
};

// Handle status update on POST.
exports.status_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: status update POST');
};
