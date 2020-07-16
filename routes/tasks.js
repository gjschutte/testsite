const express = require('express');

const router = express.Router();

// Require controller modules.
const taskController = require('../controllers/taskController');
const categoryController = require('../controllers/categoryController');
const statusController = require('../controllers/statusController');

/// TASK ROUTES ///

// GET task home page.
router.get('/', taskController.index);

// GET request for creating a Task. Must come before displaying one task
router.get('/task/create', taskController.task_create_get);

// POST request for creating a task.
router.post('/task/create', taskController.task_create_post);

// GET request to delete task.
router.get('/task/:id/delete', taskController.task_delete_get);

// POST request to delete task.
router.post('/task/:id/delete', taskController.task_delete_post);

// GET request to update task.
router.get('/task/:id/update', taskController.task_update_get);

// POST request to update task.
router.post('/task/:id/update', taskController.task_update_post);

// GET request for one task.
router.get('/task/:id', taskController.task_detail);

// GET request for list of all tasks
router.get('/tasks', taskController.task_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. Must come before displaying one category
router.get('/category/create', categoryController.category_create_get);

// POST request for creating a category.
router.post('/category/create', categoryController.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', categoryController.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', categoryController.category_delete_post);

// GET request to update category.
router.get('/cateogry/:id/update', categoryController.category_update_get);

// POST request to update category.
router.post('/category/:id/update', categoryController.category_update_post);

// GET request for one category.
router.get('/category/:id', categoryController.category_detail);

// GET request for list of all category
router.get('/categories', categoryController.category_list);

/// STATUS ROUTES ///

// GET request for creating a Status. Must come before displaying one status
router.get('/status/create', statusController.status_create_get);

// POST request for creating a status.
router.post('/status/create', statusController.status_create_post);

// GET request to delete status.
router.get('/status/:id/delete', statusController.status_delete_get);

// POST request to delete status.
router.post('/status/:id/delete', statusController.status_delete_post);

// GET request to update status.
router.get('/status/:id/update', statusController.status_update_get);

// POST request to update status.
router.post('/status/:id/update', statusController.status_update_post);

// GET request for one status.
router.get('/status/:id', statusController.status_detail);

// GET request for list of all statusses
router.get('/statusses', statusController.status_list);

module.exports = router;
