const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

function getUserFromToken(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice(7);

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

function requireAuth(context) {
  if (!context.user) {
    throw new Error('Unauthorized. Please login first.');
  }
}

module.exports = {
  createToken,
  getUserFromToken,
  requireAuth
};
