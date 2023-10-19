const express = require('express');
const {
  getUsers,
  editUserPassword,
  resetTest,
  getQuestions,
  calculateResults,
} = require('../controller/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/users', auth, getUsers);
router.get('/questions', auth, getQuestions);
router.get('/results', auth, calculateResults);
router.put('/update-password', auth, editUserPassword);
router.put('/reset-test', auth, resetTest);

module.exports = router;
