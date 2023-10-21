const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const token = jwt.sign(
    {
      _id: id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return error;
  }
};

module.exports = { generateToken, verifyToken };
