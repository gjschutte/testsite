const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    description: { type: String, required: true, max: 50 },
  },
);

// Virtual for category URL
CategorySchema
  .virtual('url')
  .get(function () { //eslint-disable-line
    return `/tasks/category/${this.id}`;
  });

// Export model
module.exports = mongoose.model('Category', CategorySchema);
