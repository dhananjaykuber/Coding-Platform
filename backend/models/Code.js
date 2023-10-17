const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  language: {
    type: String,
  },
  path: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
});

module.exports = mongoose.model('Code', codeSchema);
