const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', userSchema);
