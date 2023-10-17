const express = require('express');
const upload = require('../utils/fileUploader');
const auth = require('../middleware/auth');
const { submitCode } = require('../controller/codeController');

const router = express.Router();

router.post('/submit', auth, upload.single('codeFile'), submitCode);

module.exports = router;
