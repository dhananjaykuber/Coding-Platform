// for submissions

const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  language: {
    type: String,
  },
  path: {
    type: String,
  },
  code: {
    type: String,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  passedTests: {
    type: Number,
    default: Boolean,
  },
  runCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  executionTime: {
    type: String,
  },
});

module.exports = mongoose.model('Code', codeSchema);
