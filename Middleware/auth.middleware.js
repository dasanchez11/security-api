const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
    const {user} = req.session
    if(!user){
      return res.status(401).json({message:'Unauthorized'})
    }
    next()
  };

  module.exports = {
    isAuthenticated
  }