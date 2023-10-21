const compiler = require('compilex');
const runCodeWithInput = require('../utils/runCode');
const submitCodeWithInput = require('../utils/submitCode');
const User = require('../models/User');

const options = { stats: true };
compiler.init(options);

compiler.flush(function () {
  console.log('All temporary files flushed 🚮');
});

const submitCode = async (req, res) => {
  const { code, language, id } = req.body;

  if (language === 'cpp') {
    var envData = { OS: 'windows', cmd: 'g++', options: { timeout: 5000 } };
    submitCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compileCPPWithInput
    );
  } else if (language === 'python') {
    var envData = { OS: 'windows', options: { timeout: 5000 } };
    submitCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compilePythonWithInput
    );
  } else if (language === 'java') {
    var envData = { OS: 'windows', options: { timeout: 5000 } };
    submitCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compileJavaWithInput
    );
  }
};

const runCode = async (req, res) => {
  const { code, language, id } = req.body;

  if (language === 'cpp') {
    var envData = { OS: 'windows', cmd: 'g++', options: { timeout: 5000 } };
    runCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compileCPPWithInput
    );
  } else if (language === 'python') {
    var envData = { OS: 'windows', options: { timeout: 5000 } };
    runCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compilePythonWithInput
    );
  } else if (language === 'java') {
    var envData = { OS: 'windows', options: { timeout: 5000 } };
    runCodeWithInput(
      req,
      res,
      envData,
      code,
      language,
      id,
      compiler.compileJavaWithInput
    );
  }
};

const endTest = async (req, res) => {
  const { endedAt } = req.body;

  try {
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { submitted: true, endedAt: endedAt }
    );

    res.status(200).json({ message: 'Test submitted successfully.' });
  } catch (error) {
    res.status(500).json({
      error: 'Error occured while submitting the test. Please try again.',
    });
  }
};

module.exports = { submitCode, runCode, endTest };
