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
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  return decoded;
};

module.exports = { generateToken, verifyToken };
