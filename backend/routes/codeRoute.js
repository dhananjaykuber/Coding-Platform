const express = require('express');
const auth = require('../middleware/auth');
const {
  submitCode,
  runCode,
  endTest,
} = require('../controller/codeController');

const router = express.Router();

router.post('/submit', auth, submitCode);
router.post('/run', auth, runCode);
router.post('/end', auth, endTest);

module.exports = router;
