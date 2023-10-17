const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exist = await User.findOne({ email: email });

    if (exist) {
      return res.status(400).json({ error: 'User with email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user._id.toString());

    res.status(200).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Cannot create user. Try again later.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(user);

      if (passwordMatch) {
        const token = await generateToken(user._id.toString());

        return res.status(200).json({
          _id: user._id,
          email: user.email,
          token,
        });
      }
    }

    res.status(404).json({ error: 'Bad credentials.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};

module.exports = { signup, login };
