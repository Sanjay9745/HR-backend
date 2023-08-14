const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('x-access-token');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
