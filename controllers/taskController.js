var Task = require('../models/task');
var Category = require('../models/category');
var Status = require('../models/status');
const { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        task_count: function(callback) {
            Task.countDocuments({}, callback); // Pass an empty object as match condition
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        },
        status_count: function(callback) {
            Status.countDocuments({}, callback);
        }
    }, function(err, results) {
        console.log("Error: " + err);
        console.log("Data: " + results);
        res.render('index', { title: 'My ToDo list', error: err, data: results });
    });
};

// Display list of all Tasks.
exports.task_list = function(req, res, next) {
    
    Task.find({}, 'description actionHolder status')
        .populate('status')
        .exec(function (err, list_tasks) {
            if (err) { return next(err); }
            // Succesful, so render
            res.render('task_list', { title: 'Task List', task_list: list_tasks });
        });
};

// Display detail page for a specifick Task.
exports.task_detail = function(req, res, next) {
    Task.findById(req.params.id)
        .populate('status')
        .populate('category')
        .exec(function (err, results) {
            if (err) { return next(err); }
            // Succesful, so render
            res.render('task_details', { title: results.description, details: results });
        });
};

// Display Task create form on GET.
exports.task_create_get = function(req, res, next) {
    
    // Get all categories and statusses, which we can use for adding to the task
    async.parallel({
        categories: function(callback) {
            Category.find(callback);
        },
        statusses: function(callback) {
            Status.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('task_form', { title: 'Create task', categories: results.categories, statusses: results.statusses });
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
    sanitizeBody('*').escape(),
    
    // Process reuqest after validation and sanitation.
    (req, res, next) => {
        
        console.log ("In POST");
        // Extract the validation errors from a request
        const errors = validationResult(req);
        
        // Create a Task object with escaped and trimmed data.
        var task = new Task (
            {   description: req.body.description,
                actionHolder: req.body.actionholder,
                category: req.body.category,
                startDate: req.body.startdate,
                endDate: req.body.enddate,
                status: req.body.status,
                comments: req.body.comments
            });

        console.log ("Taskinfo: " + task);
        
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages
            
            // Get all categories and statusses for form
            async.parallel({
                categories: function(callback) {
                    Category.find(callback);
                },
                statusses: function(callback) {
                    Status.find(callback);
                },
            }, function(err, results) {
                console.log ("validation errors");
                console.log ("Task: "+ task.actionHolder);
                if (err) { return next(err); }
                res.render('task_form', { title: 'Create task', categories: results.categories, statusses: results.statusses, task: task, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save task
            console.log ("Save task");

            task.save(function (err) {
                if (err) { return next(err); }
                
                // succesful - redirect to new task record
                res.redirect(task.url);
            });
        }
    }
];

// Display Task delete form on GET.
exports.task_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Task delete GET');
};

// Handle Task delete on POST.
exports.task_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Task delete POST');
};

// Display Task update form on GET.
exports.task_update_get = function(req, res, next) {

    // Get task, all categories and statusses
    async.parallel({
        task: function(callback) {
            Task.findById(req.params.id).populate('category').populate('status').exec(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        },
        statusses: function(callback) {
            Status.find(callback);
        },
 
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.task == null) { // Task not found
            var err = new Error('Task not found');
            err.status = 404;
            return next(err);
        }
        
        console.log('Task update get: ' + results.task);    
        // Succes.
        res.render('task_form', { title: 'Update task', categories: results.categories, statusses: results.statusses, task: results.task });
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
    sanitizeBody('*').escape(),
    
    // Process reuqest after validation and sanitation.
    (req, res, next) => {
        
        console.log ("In POST");
        // Extract the validation errors from a request
        const errors = validationResult(req);
        
        // Create a Task object with escaped and trimmed data.
        var task = new Task (
            {   description: req.body.description,
                actionHolder: req.body.actionholder,
                category: req.body.category,
                startDate: req.body.startdate,
                endDate: req.body.enddate,
                status: req.body.status,
                comments: req.body.comments,
                _id:req.params.id // Required, otherwise a new ID will be assigned
            });

        console.log ("Taskinfo: " + task);
        
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages
            
            // Get all categories and statusses for form
            async.parallel({
                categories: function(callback) {
                    Category.find(callback);
                },
                statusses: function(callback) {
                    Status.find(callback);
                },
            }, function(err, results) {
                console.log ("validation errors");
                console.log ("Task: "+ task.actionHolder);
                if (err) { return next(err); }
                res.render('task_form', { title: 'Create task', categories: results.categories, statusses: results.statusses, task: task, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            console.log ("Save task");

            Task.findByIdAndUpdte(req.params.id, task, {}, function (err, thetask) {
                if (err) { return next(err); }
                
                    // succesful - redirect to new task record
                    res.redirect(thetask.url);
                });
        }
        
    }
];

    
    
