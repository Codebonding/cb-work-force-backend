const { adminSchema } = require('../validation/adminValidation');
const { registerAdmin, loginAdmin } = require('../services/adminService');

const register = async (req, res) => {
  try {
    const { error } = adminSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const admin = await registerAdmin(req.body.userId);
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = adminSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const result = await loginAdmin(req.body.userId);
    res.json({ message: 'Login successful', token: result.token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  register,
  login
};