const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const randToken = require('rand-token')
const Token = require('../Models/token.model')

const createToken = (user) => {
  // Sign the JWT
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
      kanbanId: user.kanban,
      iss: 'api.cubes',
      aud: 'api.cubes'
    },
    process.env.SECRET_KEY,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};



const verifyPassword = (
  passwordAttempt,
  hashedPassword
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

const dummyData = {
  salesVolume: 73977,
  newCustomers: 89,
  refunds: 2254,
  graphData: [
    { date: 'Jan 2019', amount: 1902 },
    { date: 'Feb 2019', amount: 893 },
    { date: 'Mar 2019', amount: 1293 },
    { date: 'Apr 2019', amount: 723 },
    { date: 'May 2019', amount: 2341 },
    { date: 'Jun 2019', amount: 2113 },
    { date: 'Jul 2019', amount: 236 },
    { date: 'Aug 2019', amount: 578 },
    { date: 'Sep 2019', amount: 912 },
    { date: 'Oct 2019', amount: 2934 },
    { date: 'Nov 2019', amount: 345 },
    { date: 'Dec 2019', amount: 782 }
  ]
};

const getRefreshToken = () => {
  return randToken.uid(64)
}

const saveRefreshToken = async (refreshToken, userId) => {
  try {
    const storedRefreshToken = new Token({
      refreshToken,
      user: userId
    })
    return await storedRefreshToken.save();
  } catch (error) {
    return error
  }
}

module.exports = {
  createToken,
  verifyPassword,
  dummyData,
  getRefreshToken,
  saveRefreshToken
}



