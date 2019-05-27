#! /usr/bin/env node
// Include environment file
require('dotenv').config();

console.log('This script populates some test tasks, categories and statusses to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

var async = require('async');
var Task = require('./models/task');
var Category = require('./models/category');
var Status = require('./models/status');

// Set up mongoose connection
const { DBLOGIN } = process.env;
const { DBPASSWORD } = process.env;
const { DBCOMMAND } = process.env;

var mongoose = require('mongoose');
var mongoDB = 'mongodb://' + DBLOGIN + ":" + DBPASSWORD + DBCOMMAND;
console.log (mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tasks = [];
var categories = [];
var statusses = [];

// Function for creating new statusses
function statusCreate(description, cb) {
  var status = new Status({ description: description });
       
  status.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Status: ' + status);
    statusses.push(status)
    cb(null, status);
  }   );
}


// Function for creating new categories
function categoryCreate(description, cb) {
  var category = new Category({ description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}


function taskCreate(description, actionHolder, category, startDate, endDate, status, comments, cb) {
  var taskdetail = {
    description: description,
    actionHolder: actionHolder,
    startDate: startDate,
    endDate: endDate,
    comments: comments,
  }

  if (category != false) taskdetail.category = category;
  if (status != false) taskdetail.status = status;

  var task = new Task(taskdetail);
       
  task.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Task: ' + task);
    tasks.push(task)
    cb(null, task)
  }  );
}


function createCategories(cb) {
  async.series([
    function(callback) {
      categoryCreate('Work', callback);
    },
    function(callback) {
      categoryCreate('Private', callback);
    },
    function(callback) {
      categoryCreate('Projects', callback);
    },
    ],
    // optional callback
    cb);
}

function createStatusses(cb) {
  async.series([
    function(callback) {
      statusCreate('Not started', callback);
    },
    function(callback) {
      statusCreate('Started', callback);
    },
    function(callback) {
      statusCreate('Pending', callback);
    },
    function(callback) {
      statusCreate('Finished', callback);
    },
    function(callback) {
      statusCreate('Parked', callback);
    },
    function(callback) {
      statusCreate('Stopped', callback);
    },
    ],
    // optional callback
    cb);
}

function createTasks(cb) {
  async.series([
    function(callback) {
      taskCreate('Check for new email', 'Mike Henderson', categories[0], '2019-05-10', null, statusses[0], null, callback);
    },
    function(callback) {
      taskCreate('Do the laundrey', 'Mrs Schutte', categories[1], '2019-04-12', null, statusses[1], null, callback);
    },
    ],
    // optional callback
    cb);
}



async.series([
    createStatusses,
    createCategories,
    createTasks
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Tasks: '+tasks);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



