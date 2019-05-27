var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        description: {type: String, required: true, max: 50},
    }
);

// Export model
module.exports = mongoose.model('Category', CategorySchema);