var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StatusSchema = new Schema(
    {
        description: {type: String, required: true, max: 20},
    }
);

// Export model
module.exports = mongoose.model('Status', StatusSchema);