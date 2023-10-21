const Submission = require('../models/Submission');
const Question = require('../models/Question');
const Test = require('../models/Test');
const TestCompletion = require('../models/TestCompletion');

const getQuestions = async (req, res) => {
  const { testId } = req.params;

  try {
    // checl test is live or not
    const test = await Test.findById(testId);

    if (!test.isLive) {
      return res.status(400).json({ error: 'Test is not live yet.' });
    }

    // check user has started the test (has entry in test completion collection)
    const testCompletion = await TestCompletion.findOne({
      test: testId,
      user: req.user._id,
    });

    if (!testCompletion) {
      return res
        .status(400)
        .json({ error: 'You have not registered for this test' });
    }

    // check user has already submitted the test
    if (testCompletion.submitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the test.' });
    }

    // else send the questions of test
    const questions = await Question.find({ test: testId });

    const questionsWithStatus = [];

    for (const question of questions) {
      const userHasSubmitted = await Submission.findOne({
        author: req.user._id,
        question: question._id,
      });

      questionsWithStatus.push({
        _id: question._id,
        title: question.title,
        description: question.description,
        submitted: userHasSubmitted?.submitted ? true : false,
        number: question.number,
      });
    }

    res.status(200).json(questionsWithStatus);
  } catch (error) {
    res.status(404).json({ error: 'Question not found.' });
  }
};

const getQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    if (req.user.submitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the test.' });
    }

    const alreadySubmitted = await Submission.findOne({
      author: req.user._id.toString(),
      question: questionId,
      submitted: true,
    });

    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the code.' });
    }

    const question = await Question.findById(questionId);

    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ error: 'Question not found.' });
  }
};

module.exports = { getQuestions, getQuestion };
