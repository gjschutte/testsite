var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StatusSchema = new Schema(
    {
        description: {type: String, required: true, max: 20},
    }
);

// Virtual for category URL
StatusSchema
.virtual('url')
.get(function () {
    return '/tasks/status/' + this.id;
});



// Export model
module.exports = mongoose.model('Status', StatusSchema);