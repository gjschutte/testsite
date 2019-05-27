var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema(
    {
        description: {type: String, required: true, max: 250},
        actionHolder: {type: String, required: true, max: 100},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        startDate: {type: Date},
        endDate: {type: Date},
        status: {type: Schema.Types.ObjectId, ref: 'Status', required: true},
        comments: {type: String},
    }
);

// Export model
module.exports = mongoose.model('Task', TaskSchema);