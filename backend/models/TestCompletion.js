const mongoose = require('mongoose');

const testCompletionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  endedAt: {
    type: String,
  },
  totalTime: {
    type: String,
  },
  remaningTime: {
    type: String,
  },
});

module.exports = mongoose.model('TestCompletion', testCompletionSchema);
