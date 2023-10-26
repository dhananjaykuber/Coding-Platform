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
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/users/:testId', auth, admin, getUsers);
router.put('/update-password', auth, admin, editUserPassword);

router.get('/questions', auth, admin, getQuestions);
router.post('/questions', auth, admin, addQuestion);

router.get('/results/:testId', auth, admin, calculateResults);

router.get('/test', auth, admin, getTests);
router.post('/test', auth, admin, createTest);
router.put('/test/:id', auth, admin, updateTest);
router.put('/reset-test', auth, admin, resetTest);

module.exports = router;
