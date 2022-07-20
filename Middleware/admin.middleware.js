const isAdmin = (req, res, next) => {
    const {user} = req.session
    if (!user) {
      return res.status(401).json({
        message: 'There was a problem authorizing the request'
      });
    }
    if (user.role !== 'admin') {
      return res
        .status(401)
        .json({ message: 'Insufficient role' });
    }
    next();
  };

  module.exports = {
    isAdmin
  }