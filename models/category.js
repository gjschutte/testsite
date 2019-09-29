var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        description: {type: String, required: true, max: 50},
    }
);

// Virtual for category URL
CategorySchema
.virtual('url')
.get(function () {
    return '/tasks/category/' + this.id;
});


// Export model
module.exports = mongoose.model('Category', CategorySchema);