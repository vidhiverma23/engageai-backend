const jwt = require('jsonwebtoken');
const store = require('../data/store');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = store.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;
