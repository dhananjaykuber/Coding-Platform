const express = require('express');
const {
  getUsers,
  editUserPassword,
  resetTest,
  getQuestions,
  calculateResults,
  createTest,
  updateTest,
  getTests,
  addQuestion,
} = require('../controller/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/users/:testId', auth, getUsers);
router.put('/update-password', auth, editUserPassword);

router.get('/questions', auth, getQuestions);
router.post('/questions', auth, addQuestion);

router.get('/results/:testId', auth, calculateResults);

router.get('/test', auth, getTests);
router.post('/test', auth, createTest);
router.put('/test/:id', auth, updateTest);
router.put('/reset-test', auth, resetTest);

module.exports = router;
