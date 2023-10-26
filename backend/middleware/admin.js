module.exports = async (req, res, next) => {
  if (req.user.type === 'admin' || req.user.type === 'superadmin') {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
};
