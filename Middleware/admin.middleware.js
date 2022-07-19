const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'There was a problem authorizing the request'
      });
    }
    if (req.user.role !== 'admin') {
      return res
        .status(401)
        .json({ message: 'Insufficient role' });
    }
    next();
  };

  module.exports = {
    isAdmin
  }