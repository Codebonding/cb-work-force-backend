const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const isApprover = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const admin = await Admin.findOne({ where: { userId } });

    if (!admin) {
      return res.status(403).json({ message: 'Access denied: not authorized to approve/reject payments' });
    }

    // Attach admin info if needed downstream
    req.admin = {
      id: admin.id,
      userId: admin.userId,
    };

    next();
  } catch (err) {
    console.error('Approver check failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { isApprover };