const express = require('express');
const {
  getQuestion,
  getQuestions,
} = require('../controller/questionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:testId', auth, getQuestions);
router.get('/test/:questionId', auth, getQuestion);

module.exports = router;
