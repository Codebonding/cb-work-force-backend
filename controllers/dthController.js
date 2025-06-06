const dthService = require('../services/dthService');
const { createDthSchema } = require('../validation/dthValidation');

const createDth = async (req, res) => {
  try {
    const { error } = createDthSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const dth = await dthService.createDth(req.body);
    res.status(201).json(dth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDth = async (req, res) => {
  try {
    const dths = await dthService.getAllDth();
    res.status(200).json(dths);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDthById = async (req, res) => {
  try {
    const dth = await dthService.getDthById(req.params.id);
    if (!dth) return res.status(404).json({ error: 'DTH not found' });
    res.status(200).json(dth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDth = async (req, res) => {
  try {
    const dth = await dthService.updateDth(req.params.id, req.body);
    if (!dth) return res.status(404).json({ error: 'DTH not found' });
    res.status(200).json(dth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDth = async (req, res) => {
  try {
    const dth = await dthService.deleteDth(req.params.id);
    if (!dth) return res.status(404).json({ error: 'DTH not found' });
    res.status(200).json({ message: 'DTH deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDth,
  getAllDth,
  getDthById,
  updateDth,
  deleteDth
};
