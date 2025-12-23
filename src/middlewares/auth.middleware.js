// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { default: userModel } = require('../models/user.model.js');

exports.authMiddleware = async (req, res, next) => {
  let token;
  let deviceId = req.headers['x-device'];

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Lấy phần token
  }

  if (!token && !deviceId) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  if (!token) {
    req.user = await userModel.findOne({ deviceId: deviceId });
    if (!req.user) {
      // Create a new user for this deviceId when none exists
      try {
        req.user = await userModel.create({ deviceId: deviceId });
      } catch (err) {
        console.error('Error creating user for deviceId', deviceId, err);
        return res.status(500).json({ success: false, error: 'Server Error', detail: err.message });
      }
    }

    // If no token but deviceId provided (and user now exists), proceed
    next();
  } else {

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
  }
};