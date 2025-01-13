const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  userName : { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: { type: Array, default: [] },
});


const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};
