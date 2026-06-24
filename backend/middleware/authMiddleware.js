const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, access denied.' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
};

const technicianOrAdmin = (req, res, next) => {
  if (!['technician', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Technician or Admin access required.' });
  }
  next();
};

module.exports = { protect, adminOnly, technicianOrAdmin };