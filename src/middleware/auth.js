const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Authentication required.' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ success: false, message: 'Invalid token.' });

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication failed.', error: error.message });
  }
};

module.exports = { authenticate };

