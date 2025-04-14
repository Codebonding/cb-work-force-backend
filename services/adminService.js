const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const registerAdmin = async (userId) => {
  return await Admin.create({ userId });
};

const loginAdmin = async (userId) => {
    const admin = await Admin.findOne({ where: { userId } });
    if (!admin) throw new Error('Admin not found');

    const payload = { 
      userId: admin.userId,   // Include the userId
      adminId: admin.id       // Include the adminId
    };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
    
    return { token, admin };
  };

module.exports = {
  registerAdmin,
  loginAdmin,
};
