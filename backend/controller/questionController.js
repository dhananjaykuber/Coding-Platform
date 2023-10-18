const Code = require('../models/Code');
const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  try {
    if (req.user.submitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the test.' });
    }

    const questions = await Question.find();

    const questionsWithStatus = [];

    for (const question of questions) {
      const userHasSubmitted = await Code.findOne({
        author: req.user._id,
        question: question._id,
        runCount: { $lt: 5 },
      });

      questionsWithStatus.push({
        _id: question._id,
        title: question.title,
        description: question.description,
        submitted: userHasSubmitted ? true : false,
        number: question.number,
      });
    }

    res.status(200).json(questionsWithStatus);
  } catch (error) {
    res.status(404).json({ error: 'Question not found.' });
  }
};

const getQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.submitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the test.' });
    }

    const alreadySubmitted = await Code.findOne({
      author: req.user._id.toString(),
      question: id,
      submitted: true,
    });

    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ error: 'You have already submitted the code.' });
    }

    const question = await Question.findById(id);

    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ error: 'Question not found.' });
  }
};

const addQuestion = async (req, res) => {
  const { number, title, description, template, testCases } = req.body;

  try {
    const question = await Question.create({
      number,
      title,
      description,
      template,
      testCases,
    });

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Cannot create question.' });
  }
};

module.exports = { getQuestions, getQuestion, addQuestion };
