const async = require('async');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
// const connectEnsureLogin = require('connect-ensure-login');
const Task = require('../models/task');
const Category = require('../models/category');
const Status = require('../models/status');

exports.task_start = (req, res) => {
  async.parallel({
    task_count: (callback) => {
      Task.countDocuments({}, callback); // Pass an empty object as match condition
    },
    category_count: (callback) => {
      Category.countDocuments({}, callback);
    },
    status_count: (callback) => {
      Status.countDocuments({}, callback);
    },
  }, (err, results) => {
    console.log(`Error: ${err}`);
    console.log(`Results: ${results}`);
    res.render('todo/task_start', {
      title: 'My ToDo list',
      error: err,
      data: results,
      user: req.user,
    });
  });
};

// Display list of all Tasks.
exports.task_list = (req, res, next) => {
  Task.find({}, 'description actionHolder status')
    .populate('status')
    .exec((err, listTasks) => {
      if (err) { return next(err); }
      // Succesful, so render
      res.render('todo/task_list', {
        title: 'Task List',
        task_list: listTasks,
        user: req.user,
      });
      return 0;
    });
};

// Display detail page for a specifick Task.
exports.task_detail = (req, res, next) => {
  Task.findById(req.params.id)
    .populate('status')
    .populate('category')
    .exec((err, results) => {
      if (err) { return next(err); }
      // Succesful, so render
      res.render('todo/task_details', { title: results.description, details: results, user: req.user });
      return 0;
    });
};

// Display Task create form on GET.
exports.task_create_get = (req, res, next) => {
  // Get all categories and statusses, which we can use for adding to the task
  async.parallel({
    categories: (callback) => {
      Category.find(callback);
    },
    statusses: (callback) => {
      Status.find(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('todo/task_form', {
      title: 'Create task',
      categories: results.categories,
      statusses: results.statusses,
      user: req.user,
    });
    return 0;
  });
};

// Handle Task create on POST.
exports.task_create_post = [
  // Validate fields
  check('description').not().isEmpty().withMessage('Description must not be empty'),
  check('actionholder').not().isEmpty().withMessage('Action holder must not be empty'),
  check('category').not().isEmpty().withMessage('Category must not be empty'),
  check('status').not().isEmpty().withMessage('Status must not be empty'),

  // Sanitize fields (using wildcard)
  body('*').escape(),

  // Process reuqest after validation and sanitation.
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Task object with escaped and trimmed data.
    const task = new Task({
      description: req.body.description,
      actionHolder: req.body.actionholder,
      category: req.body.category,
      startDate: req.body.startdate,
      endDate: req.body.enddate,
      status: req.body.status,
      comments: req.body.comments,
    });

    console.log(`Taskinfo: ${task}`);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      // Get all categories and statusses for form
      async.parallel({
        categories: (callback) => {
          Category.find(callback);
        },
        statusses: (callback) => {
          Status.find(callback);
        },
      }, (err, results) => {
        console.log('validation errors');
        console.log(`Task: ${task.actionHolder}`);
        if (err) { return next(err); }
        res.render('todo/task_form', {
          title: 'Create task', categories: results.categories, statusses: results.statusses, task, errors: errors.array(),
        });
        return 0;
      });
    } else {
      // Data from form is valid. Save task
      console.log('Save task');

      task.save((err) => {
        if (err) { return next(err); }

        // succesful - redirect to new task record
        res.redirect(task.url);
        return 0;
      });
    }
  },
];

// Display Task delete form on GET.
exports.task_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Task delete GET');
};

// Handle Task delete on POST.
exports.task_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Task delete POST');
};

// Display Task update form on GET.
exports.task_update_get = (req, res, next) => {
  // Get task, all categories and statusses
  async.parallel({
    task: (callback) => {
      Task.findById(req.params.id).populate('category').populate('status').exec(callback);
    },
    categories: (callback) => {
      Category.find(callback);
    },
    statusses: (callback) => {
      Status.find(callback);
    },

  }, (err, results) => {
    let errorMessage = err;
    if (err) { return next(err); }
    if (results.task == null) { // Task not found
      errorMessage = new Error('Task not found');
      errorMessage.status = 404;
      return next(errorMessage);
    }

    console.log(`Task update get: ${results.task}`);
    // Succes.
    res.render('todo/task_form', {
      title: 'Update task',
      categories: results.categories,
      statusses: results.statusses,
      task: results.task,
      user: req.user,
    });
    return 0;
  });
};

// Handle Task update on POST.
exports.task_update_post = [
  // Validate fields
  check('description').not().isEmpty().withMessage('Description must not be empty'),
  check('actionholder').not().isEmpty().withMessage('Action holder must not be empty'),
  check('category').not().isEmpty().withMessage('Category must not be empty'),
  check('status').not().isEmpty().withMessage('Status must not be empty'),

  // Sanitize fields (using wildcard)
  body('*').escape(),

  // Process reuqest after validation and sanitation.
  (req, res, next) => {
    console.log('In POST');
    // Extract the validation errors from a request
    const errors = validationResult(req);

    console.log(`ID voor update: ${req.params.id}`);
    // Create a Task object with escaped and trimmed data.
    const task = new Task({
      description: req.body.description,
      actionHolder: req.body.actionholder,
      category: req.body.category,
      startDate: req.body.startdate,
      endDate: req.body.enddate,
      status: req.body.status,
      comments: req.body.comments,
      _id: req.params.id, // Required, otherwise a new ID will be assigned
    });

    console.log(`Taskinfo: ${task}`);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages

      // Get all categories and statusses for form
      async.parallel({
        categories: (callback) => {
          Category.find(callback);
        },
        statusses: (callback) => {
          Status.find(callback);
        },
      }, (err, results) => {
        console.log('validation errors');
        console.log(`Task: ${task.actionHolder}`);
        if (err) { return next(err); }
        res.render('todo/task_form', {
          title: 'Create task',
          categories: results.categories,
          statusses: results.statusses,
          task,
          errors: errors.array(),
          user: req.user,
        });
        return 0;
      });
    } else {
      // Data from form is valid. Update the record.
      console.log('Save task');

      Task.findByIdAndUpdate(req.params.id, task, {}, (err, thetask) => {
        if (err) { return next(err); }
        // succesful - redirect to new task record
        res.redirect(thetask.url);
        return 0;
      });
    }
  },
];
