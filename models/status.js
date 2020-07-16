const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusSchema = new Schema(
  {
    description: { type: String, required: true, max: 20 },
  },
);

// Virtual for category URL
StatusSchema
  .virtual('url')
  .get(function () { //eslint-disable-line
    return `/tasks/status/${this.id}`;
  });

// Export model
module.exports = mongoose.model('Status', StatusSchema);
