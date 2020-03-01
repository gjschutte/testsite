var Category = require('../models/category');
var Task = require('../models/task');
const winLogger = require('../winlogger');
var async = require('async');
const { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display list of all categorys.
exports.category_list = function(req, res, next) {
    winLogger.info('GET for category list');
    Category.find({}, 'description')
        .exec(function (err, list_categories) {
            if (err) { return next(err); }
            // Succesful, so render
            res.render('category_list', { title: 'Category List', category_list: list_categories });
        });
};


// Display detail page for a specifick category.
exports.category_detail = function(req, res, next) {
    winLogger.info('GET for category-detail');
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },
        
        category_tasks: function(callback) {
            Task.find({ 'category': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // no results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
    }
    // Succesful, so render
    res.render('category_detail', { title: 'Category detail', category: results.category, category_tasks: results.category_tasks } );
    });
};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    winLogger.info('GET for category create');
    res.render('category_form', { title: 'Create category'});
};

// Handle category create form on POST.
exports.category_create_post = [
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
        var category = new Category(
            { description: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', { title: 'Create category', category: category, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid
            // Check if Category with same name already exists.
            Category.findOne({ 'description': req.body.name })
                .exec( function(err, found_category) {
                    if (err) { return next(err); }
                    
                    if (found_category) {
                        // Category exists, redirect to its detail page.
                        res.redirect(found_category.url);
                    }
                    else {
                        category.save(function (err) {
                            if (err) { return next(err); }
                            // Category saved. Redirect to category detail page.
                            res.redirect(category.url);
                        });
                    }
                });
        }
    }
];

// Display category delete form on GET.
exports.category_delete_get = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        cat_tasks: function(callback) {
            Task.find({ 'category': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category == null) { // No results.
            res.redirect('/tasks/categories');
        }
        // successfull, so render.
        res.render('category_delete', { title: 'Delete Category', category: results.category, cat_tasks: results.cat_tasks} );
    });
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.body.categoryid).exec(callback)
        },
        cat_tasks: function(callback) {
            Task.find({ 'category': req.body.categoryid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
    
        // Succes
        if (results.cat_tasks.length > 0) {
            // Category has tasks. Render in same way as for GET route.
            res.render('category_delete', { title: 'Delete Category', category: results.category, cat_tasks: results.cat_tasks} );
            return;
        }
        else {
            // Category has no tasks. Delete category and redirect to the list of categories
            Category.findByIdAndDelete(req.body.categoryid, function deleteCategory(err) {
                if (err) { return next (err); }
                // Succes - go to category list
                res.redirect('/tasks/categories');
            })
        }
    });
};

// Display category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category update POST');
};
