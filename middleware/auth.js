const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
function authenticateToken(req, res, next) {
  
  const token = req.header('x-access-token');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
