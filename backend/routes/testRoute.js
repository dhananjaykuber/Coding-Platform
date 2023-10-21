const express = require('express');
const {
  getTests,
  startTest,
  endTest,
  getRemaningTime,
  updateRemaningTime,
} = require('../controller/testController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getTests);
router.get('/remaning-time/:testId', auth, getRemaningTime);

router.post('/start', auth, startTest);
router.post('/end', auth, endTest);

router.put('/update-time/:testId', auth, updateRemaningTime);

module.exports = router;
