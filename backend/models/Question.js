const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Question', questionSchema);
