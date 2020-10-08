#! /usr/bin/env node
// Include environment file
require('dotenv').config();

console.log('This script populates some test tasks, categories and statusses to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

const mongoose = require('mongoose');
const async = require('async');
const Task = require('./models/task');
const Category = require('./models/category');
const Status = require('./models/status');

// Set up mongoose connection
const { DBLOGIN } = process.env;
const { DBPASSWORD } = process.env;
const { DBCOMMAND } = process.env;
console.log(`DBCOMMAND: ${DBCOMMAND}`);

const mongoDB = `mongodb+srv://${DBLOGIN}:${DBPASSWORD}${DBCOMMAND}`;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const tasks = [];
const categories = [];
const statusses = [];

// Function for creating new statusses
function statusCreate(description, cb) {
  const status = new Status({ description });

  status.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Status: ${status}`);
    statusses.push(status);
    cb(null, status);
  });
}

// Function for creating new categories
function categoryCreate(description, cb) {
  const category = new Category({ description });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function taskCreate(description, actionHolder, category, startDate, endDate, status, comments, cb) {
  const taskdetail = {
    description,
    actionHolder,
    startDate,
    endDate,
    comments,
  };

  if (category !== false) taskdetail.category = category;
  if (status !== false) taskdetail.status = status;

  const task = new Task(taskdetail);

  task.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Task: ${task}`);
    tasks.push(task);
    cb(null, task);
  });
}

function createCategories(cb) {
  async.series([
    (callback) => {
      categoryCreate('Work', callback);
    },
    (callback) => {
      categoryCreate('Private', callback);
    },
    (callback) => {
      categoryCreate('Projects', callback);
    },
  ],
  // optional callback
  cb);
}

function createStatusses(cb) {
  async.series([
    (callback) => {
      statusCreate('Not started', callback);
    },
    (callback) => {
      statusCreate('Started', callback);
    },
    (callback) => {
      statusCreate('Pending', callback);
    },
    (callback) => {
      statusCreate('Finished', callback);
    },
    (callback) => {
      statusCreate('Parked', callback);
    },
    (callback) => {
      statusCreate('Stopped', callback);
    },
  ],
  // optional callback
  cb);
}

function createTasks(cb) {
  async.series([
    (callback) => {
      taskCreate('Check for new email', 'Mike Henderson', categories[0], '2019-05-10', null, statusses[0], null, callback);
    },
    (callback) => {
      taskCreate('Do the laundrey', 'Mrs Schutte', categories[1], '2019-04-12', null, statusses[1], null, callback);
    },
  ],
  // optional callback
  cb);
}

async.series([
  createStatusses,
  createCategories,
  createTasks,
],
// Optional callback
(err, results) => {
  if (err) {
    console.log(`FINAL ERR: ${err}`);
  } else {
    console.log(`Tasks: ${tasks}`);
  }
  // All done, disconnect from database
  mongoose.connection.close();
  return results;
});
