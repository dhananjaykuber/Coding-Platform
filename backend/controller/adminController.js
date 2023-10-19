const Code = require('../models/Code');
const Question = require('../models/Question');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const users = await User.find().select('email submitted');

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while getting users data.' });
  }
};

const editUserPassword = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });

    res
      .status(200)
      .json({ message: `${user.email}'s password updated successfully.` });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating password.' });
  }
};

const resetTest = async (req, res) => {
  const { id } = req.body;

  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const user = await User.findByIdAndUpdate(id, {
      $unset: { endedAt: 1 },
      submitted: false,
    });

    // delete all submissions of users
    await Code.deleteMany({ author: id });

    res
      .status(200)
      .json({ message: `${user.email}'s test reseted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reseting test.' });
  }
};

const getQuestions = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const questions = await Question.find();

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while getting question.' });
  }
};

const calculateResults = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while calculating result.' });
  }

  res.status(200).json({ message: 'Calculate result.' });
};

module.exports = {
  getUsers,
  editUserPassword,
  resetTest,
  getQuestions,
  calculateResults,
};
