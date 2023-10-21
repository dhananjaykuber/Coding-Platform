const Test = require('../models/Test');
const TestCompletion = require('../models/TestCompletion');

const getTests = async (req, res) => {
  try {
    let testsWithStatus = [];

    const tests = await Test.find();

    console.log(tests);

    for (const test of tests) {
      const testCompletion = await TestCompletion.findOne({
        test: test._id,
        user: req.user._id,
      });

      if (testCompletion) {
        testsWithStatus.push({
          _id: test._id,
          title: test.title,
          description: test.description,
          isLive: test.isLive,
          time: test.time,
          submitted: testCompletion.submitted,
          canResume: testCompletion.submitted ? false : true,
        });
      } else {
        testsWithStatus.push({
          _id: test._id,
          title: test.title,
          description: test.description,
          isLive: test.isLive,
          time: test.time,
          submitted: false,
        });
      }
    }

    res.status(200).json(testsWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while getting tests.' });
  }
};

const startTest = async (req, res) => {
  const { testId } = req.body;

  try {
    const alreadyStarted = await TestCompletion.findOne({
      user: req.user._id,
      test: testId,
    });

    if (alreadyStarted) {
      return res.status(200).json({ message: 'Test started.' });
    }

    await TestCompletion.create({
      user: req.user._id,
      test: testId,
    });

    res.status(200).json({ message: 'Test started.' });
  } catch (error) {
    res.status(500).json({
      error: 'Error occured while starting the test. Please try again.',
    });
  }
};

const endTest = async (req, res) => {
  const { endedAt, testId } = req.body;

  try {
    await TestCompletion.findOneAndUpdate(
      { user: req.user._id, test: testId },
      { submitted: true, endedAt: endedAt }
    );

    res.status(200).json({ message: 'Test submitted successfully.' });
  } catch (error) {
    res.status(500).json({
      error: 'Error occured while submitting the test. Please try again.',
    });
  }
};

const getRemaningTime = async (req, res) => {
  const { testId } = req.params;

  try {
    // if user has already started the test then get remaning time from test completion
    const testcompletion = await TestCompletion.findOne({
      user: req.user._id,
      test: testId,
    });

    if (testcompletion?.remaningTime) {
      return res
        .status(200)
        .json({ remaningTime: testcompletion.remaningTime });
    }

    // otherwise get the test time from test collection
    const test = await Test.findById(testId);

    res.status(200).json({ remaningTime: test.time });
  } catch (error) {
    res.status(500).json({
      error: 'Error occured while getting the test time. Please try again.',
    });
  }
};

const updateRemaningTime = async (req, res) => {
  const { testId } = req.params;
  const { time } = req.body;

  try {
    await TestCompletion.findOneAndUpdate(
      { test: testId, user: req.user._id },
      {
        remaningTime: time,
      }
    );

    res.status(200).json({ message: 'Time updated successfully.' });
  } catch (error) {
    res.status(500).json({
      error:
        'Error occured while getting updating remaning time. Please try again.',
    });
  }
};

module.exports = {
  getTests,
  startTest,
  endTest,
  getRemaningTime,
  updateRemaningTime,
};
