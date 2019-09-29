var Status = require('../models/status');
var Task = require('../models/task');
var async = require('async');
const { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// Display list of all statuss.
exports.status_list = function(req, res, next) {
    Status.find({}, 'description')
        .exec(function (err, list_statusses) {
            if (err) { return next(err); }
            // Succesful, so render
            res.render('status_list', { title: 'Status List', status_list: list_statusses });
        });
};

// Display detail page for a specifick status.
exports.status_detail = function(req, res, next) {

    async.parallel({
        status: function(callback) {
            Status.findById(req.params.id)
                .exec(callback);
        },
        
        status_tasks: function(callback) {
            Task.find({ 'status': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.status==null) { // no results.
            var err = new Error('Status not found');
            err.status = 404;
            return next(err);
    }
    // Succesful, so render
    res.render('status_detail', { title: 'Status detail', status: results.status, status_tasks: results.status_tasks } );
    });
};

// Display status create form on GET.
exports.status_create_get = function(req, res) {
    res.render('status_form', { title: 'Create status'});
};

// Handle category create form on POST.
exports.status_create_post = [

    // Validate that the name field is not empty
    check('name').not().isEmpty().withMessage('Name must have more than 5 characters'),    

    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log('In POST');
        
        // Extract the validation errors from the request.
        const errors = validationResult(req);
        
        // Create a category boject with escaped and trimmed data
        var status = new Status(
            { description: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('status_form', { title: 'Create status', status: status, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid
            // Check if Status with same name already exists.
            Status.findOne({ 'description': req.body.name })
                .exec( function(err, found_status) {
                    if (err) { return next(err); }
                    
                    if (found_status) {
                        // Category exists, redirect to its detail page.
                        res.redirect(found_status.url);
                    }
                    else {
                        status.save(function (err) {
                            if (err) { return next(err); }
                            // Status saved. Redirect to status detail page.
                            res.redirect(status.url);
                        });
                    }
                });
        }
    }
];

// Display status delete form on GET.
exports.status_delete_get = function(req, res, next) {

    async.parallel({
        status: function(callback) {
            Status.findById(req.params.id).exec(callback)
        },
        status_tasks: function(callback) {
            Task.find({ 'status': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.status == null) { // No results.
            res.redirect('/tasks/statusses');
        }
        // successfull, so render.
        res.render('status_delete', { title: 'Delete Status', status: results.status, status_tasks: results.status_tasks} );
    });
};

// Handle status delete on POST.
exports.status_delete_post = function(req, res, next) {

    async.parallel({
        status: function(callback) {
            Status.findById(req.body.statusyid).exec(callback)
        },
        status_tasks: function(callback) {
            Task.find({ 'status': req.body.statusyid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
    
        // Succes
        if (results.status_tasks.length > 0) {
            // Status has tasks. Render in same way as for GET route.
            res.render('status_delete', { title: 'Delete Status', status: results.status, status_tasks: results.status_tasks} );
            return;
        }
        else {
            // Status has no tasks. Delete status and redirect to the list of statusses
            Status.findByIdAndDelete(req.body.statusyid, function deleteStatus(err) {
                if (err) { return next (err); }
                // Succes - go to status list
                res.redirect('/tasks/statusses');
            })
        }
    });
};

// Display status update form on GET.
exports.status_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: status update GET');
};

// Handle status update on POST.
exports.status_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: status update POST');
};
