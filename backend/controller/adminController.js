const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const TestCompletion = require('../models/TestCompletion');
const mongoose = require('mongoose');

const getUsers = async (req, res) => {
  const { testId } = req.params;

  try {
    const users = await TestCompletion.aggregate([
      {
        $match: { test: new mongoose.Types.ObjectId(testId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $project: {
          _id: '$userData._id',
          email: '$userData.email',
          submitted: 1,
        },
      },
    ]);

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
  const { userId, testId } = req.body;

  try {
    await Submission.deleteMany({ testId, author: userId });

    await TestCompletion.deleteOne({ test: testId, user: userId });

    res.status(200).json({ message: `Test reseted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reseting test.' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while getting question.' });
  }
};

const calculateResults = async (req, res) => {
  const { testId } = req.params;

  try {
    const users = await TestCompletion.aggregate([
      {
        $match: {
          test: new mongoose.Types.ObjectId(testId),
          submitted: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $project: {
          _id: '$userData._id',
          email: '$userData.email',
          submitted: 1,
          endedAt: 1,
        },
      },
    ]);

    // create array of promises for each user
    const userPromises = users.map(async (user) => {
      const userId = user._id;

      // total solved questions count
      const totalSolved = await Submission.countDocuments({ author: userId });

      // total passed test cases of all solved questions
      const passedTests = await Submission.aggregate([
        {
          $match: {
            author: new mongoose.Types.ObjectId(userId),
            passedTests: { $gt: 0 },
          },
        },
        {
          $group: { _id: null, passedTests: { $sum: '$passedTests' } },
        },
      ]);
      const totalPassedTests = passedTests[0] ? passedTests[0].passedTests : 0;

      // total execution time and run counts of all solved questions
      const executionTimeAndRunCount = await Submission.aggregate([
        {
          $match: { author: new mongoose.Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: null,
            totalExecutionTime: { $sum: '$executionTime' },
            totalRunCount: { $sum: '$runCount' },
          },
        },
      ]);
      const totalRunCount = executionTimeAndRunCount[0]
        ? executionTimeAndRunCount[0].totalRunCount
        : 0;
      const totalExecutionTime = executionTimeAndRunCount[0]
        ? parseFloat(executionTimeAndRunCount[0].totalExecutionTime).toFixed(3)
        : 0;

      const [min, sec] = user.endedAt.split(':');

      const endedAtMin = min < 10 ? '0' + min : min;
      const endedAtSec = sec < 10 ? '0' + sec : sec;

      return {
        email: user.email,
        submitted: user.submitted,
        totalSolved: totalSolved,
        totalPassedTests: parseFloat(totalPassedTests).toFixed(2),
        totalExecutionTime: parseFloat(totalExecutionTime),
        totalRunCount: totalRunCount,
        endedAt: `${endedAtMin}:${endedAtSec}`,
      };
    });

    const userData = await Promise.all(userPromises);

    userData.sort((a, b) => {
      // Sort by totalSolved (decreasing)
      if (b.totalSolved - a.totalSolved !== 0) {
        return b.totalSolved - a.totalSolved;
      }

      // Sort by totalPassedTests (decreasing)
      if (b.totalPassedTests - a.totalPassedTests !== 0) {
        return b.totalPassedTests - a.totalPassedTests;
      }

      // Sort by runCount (increasing)
      if (a.totalRunCount - b.totalRunCount !== 0) {
        return a.totalRunCount - b.totalRunCount;
      }

      // Sort by executionTime (increasing)
      if (a.totalExecutionTime - b.totalExecutionTime !== 0) {
        return a.totalExecutionTime - b.totalExecutionTime;
      }

      // Sort by time to complete (decreasing)
      return b.endedAt - a.endedAt;
    });

    res.status(200).json(userData);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while calculating result.' });
  }
};

const createTest = async (req, res) => {
  const { title, description, time } = req.body;

  try {
    const test = await Test.create({
      title,
      description,
      time,
      creator: req.user._id,
    });

    res.status(200).json(test);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while creating test.' });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ creator: req.user._id });

    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while getting tests.' });
  }
};

const updateTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findByIdAndUpdate(id, { ...req.body });

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating test.' });
  }
};

const addQuestion = async (req, res) => {
  const { number, title, description, template, testCases, testId } = req.body;

  try {
    const question = await Question.create({
      number,
      title,
      description,
      template,
      testCases,
      test: testId,
    });

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding question.' });
  }
};

module.exports = {
  getUsers,
  editUserPassword,
  resetTest,
  getQuestions,
  calculateResults,
  createTest,
  updateTest,
  getTests,
  addQuestion,
};
