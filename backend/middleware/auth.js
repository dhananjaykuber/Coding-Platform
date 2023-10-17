const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  const decoded = await verifyToken(token);

  try {
    const user = await User.findById(decoded._id);

    if (user) {
      req.user = user;
    } else {
      return res.status(400).json({ error: error.message });
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
