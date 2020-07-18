const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    description: { type: String, required: true, max: 250 },
    actionHolder: { type: String, required: true, max: 100 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
    comments: { type: String },
  },
);

// Virtual for task's URL
TaskSchema
  .virtual('url')
  .get(function () { //eslint-disable-line
    return `/tasks/task/${this.id}`;
  });

// Virtual for formatted start date
TaskSchema
  .virtual('startDate_formatted')
  .get(function () { //eslint-disable-line
    if (this.startDate == null) {
      return null;
    }
    return moment(this.startDate).format('MMMM Do, YYYY');
  });

// Virtual for formatted end date
TaskSchema
  .virtual('endDate_formatted')
  .get(function () { //eslint-disable-line
    if (this.endDate == null) {
      return null;
    }
    return moment(this.endDate).format('MMMM Do, YYYY');
  });

// Export model
module.exports = mongoose.model('Task', TaskSchema);
