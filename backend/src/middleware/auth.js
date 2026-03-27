const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mango_secret_key_123');
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to perform this action.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
