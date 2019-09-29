var express = require('express');
var router = express.Router();

// Require controller modules.
var task_controller = require('../controllers/taskController');
var category_controller = require('../controllers/categoryController');
var status_controller = require('../controllers/statusController');

/// TASK ROUTES ///

// GET task home page.
router.get('/', task_controller.index);

// GET request for creating a Task. Must come before displaying one task
router.get('/task/create', task_controller.task_create_get);

// POST request for creating a task.
router.post('/task/create', task_controller.task_create_post);

// GET request to delete task.
router.get('/task/:id/delete', task_controller.task_delete_get);

// POST request to delete task.
router.post('/task/:id/delete', task_controller.task_delete_post);

// GET request to update task.
router.get('/task/:id/update', task_controller.task_update_get);

// POST request to update task.
router.post('/task/:id/update', task_controller.task_update_post);

// GET request for one task.
router.get('/task/:id', task_controller.task_detail);

// GET request for list of all tasks
router.get('/tasks', task_controller.task_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. Must come before displaying one category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating a category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/cateogry/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category
router.get('/categories', category_controller.category_list);

/// STATUS ROUTES ///

// GET request for creating a Status. Must come before displaying one status
router.get('/status/create', status_controller.status_create_get);

// POST request for creating a status.
router.post('/status/create', status_controller.status_create_post);

// GET request to delete status.
router.get('/status/:id/delete', status_controller.status_delete_get);

// POST request to delete status.
router.post('/status/:id/delete', status_controller.status_delete_post);

// GET request to update status.
router.get('/status/:id/update', status_controller.status_update_get);

// POST request to update status.
router.post('/status/:id/update', status_controller.status_update_post);

// GET request for one status.
router.get('/status/:id', status_controller.status_detail);

// GET request for list of all statusses
router.get('/statusses', status_controller.status_list);

module.exports = router;