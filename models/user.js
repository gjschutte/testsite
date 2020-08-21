const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, max: 50 },
    password: { type: String },
    avatar: { type: String, max: 100},
  },
);

UserSchema.plugin(passportLocalMongoose);

// Export model
module.exports = mongoose.model('User', UserSchema);
