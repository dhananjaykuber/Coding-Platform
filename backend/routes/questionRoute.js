const express = require('express');
const {
  addQuestion,
  getQuestion,
  getQuestions,
} = require('../controller/questionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, addQuestion);
router.get('/', auth, getQuestions);
router.get('/:id', auth, getQuestion);

module.exports = router;
