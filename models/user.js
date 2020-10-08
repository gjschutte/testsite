const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, max: 50 },
    username: { type: String, max: 50 },
    password: { type: String },
    avatar: { type: String, max: 100 },
  },
);

UserSchema.plugin(passportLocalMongoose,
  { usernameField: 'email' });

// Export model
module.exports = mongoose.model('User', UserSchema);
