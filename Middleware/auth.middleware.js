const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authentication invalid' });
    }

    const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({
        message: 'There was a problem authorizing the request'
      });
    } else {
      req.user = decodedToken;
      next();
    }
  };

  module.exports = {
    isAuthenticated
  }