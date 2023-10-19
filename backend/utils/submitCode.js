const Code = require('../models/Code');
const Question = require('../models/Question');
const { RUN_COUNT } = require('./constant');

const submitCodeWithInput = async (
  req,
  res,
  envData,
  code,
  language,
  id,
  compilerFn
) => {
  try {
    const alreadyOpted = await Code.findOne({
      author: req.user._id.toString(),
      question: id,
    });

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

    if (alreadyOpted) {
      if (alreadyOpted.runCount >= RUN_COUNT) {
        await Code.findOneAndUpdate(
          { _id: alreadyOpted._id },
          {
            executionTime: executionTime,
            language: language,
            code: code,
            passedTests: (passedTestCases / testCasesCount) * 100,
            submitted: true,
          }
        );
      } else {
        await Code.findOneAndUpdate(
          { _id: alreadyOpted._id },
          {
            $inc: { runCount: 1 },
            executionTime: executionTime,
            language: language,
            code: code,
            passedTests: (passedTestCases / testCasesCount) * 100,
            submitted: true,
          }
        );
      }
    } else {
      await Code.create({
        language,
        author: req.user._id,
        question: id,
        runCount: 1,
        executionTime: executionTime,
        code: code,
        passedTests: (passedTestCases / testCasesCount) * 100,
        submitted: true,
      });
    }

    return res.status(200).json({
      message: `Code submitted successfully.`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ error: 'Could not submit the code, Please try again.' });
  }
};

module.exports = submitCodeWithInput;
