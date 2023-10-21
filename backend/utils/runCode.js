const Submission = require('../models/Submission');
const Question = require('../models/Question');
const { RUN_COUNT } = require('./constant');

const runCodeWithInput = async (
  req,
  res,
  envData,
  code,
  language,
  id,
  testId,
  compilerFn
) => {
  try {
    const alreadyOpted = await Submission.findOne({
      author: req.user._id.toString(),
      question: id,
    });

    if (alreadyOpted?.runCount >= RUN_COUNT) {
      return res.status(500).json({
        error:
          'You have exceeded the limit to run code. Please submit and proceed to next question.',
      });
    }

    const question = await Question.findById(id);
    const testCasesCount = question.testCases.get(language).length;
    let passedTestCases = 0;

    const startTime = performance.now();

    for (const testcase of question.testCases.get(language)) {
      try {
        const data = await new Promise((resolve, reject) => {
          compilerFn(envData, code, testcase.input, (data) => {
            resolve(data);
          });
        });

        if (data.error) {
          return res.status(500).json({
            error: data.error,
          });
        } else {
          if (data.output == testcase.output) {
            passedTestCases++;
          }
        }
      } catch (error) {
        return res.status(500).json({
          error: `${passedTestCases}/${testCasesCount} tests passed. ${
            testCasesCount - passedTestCases
          } remaning.`,
        });
      }
    }

    // calculate total time to execute
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // increased run count by one when user runs the code
    if (alreadyOpted) {
      await Submission.findOneAndUpdate(
        { _id: alreadyOpted._id },
        {
          $inc: { runCount: 1 },
          executionTime: executionTime,
          passedTests: (passedTestCases / testCasesCount) * 100,
          code: code,
        }
      );
    } else {
      await Submission.create({
        language,
        author: req.user._id,
        question: id,
        runCount: 1,
        passedTests: (passedTestCases / testCasesCount) * 100,
        executionTime: executionTime,
        code: code,
        testId: testId,
      });
    }

    if (testCasesCount === passedTestCases) {
      return res.status(200).json({
        message: `${passedTestCases}/${testCasesCount} All tests passed successfully and executed in ${executionTime} ms.`,
      });
    }

    return res.status(500).json({
      error: `${passedTestCases}/${testCasesCount} tests passed. ${
        testCasesCount - passedTestCases
      } remaning.`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ error: 'Could not run the code, Please try again.' });
  }
};

module.exports = runCodeWithInput;
