const commissionRateService = require('../services/commissionRateService');

const createCommissionRate = async (req, res) => {
  try {
    const result = await commissionRateService.createCommissionRate(req.body);
    res.status(201).json({ message: 'Commission rate created successfully', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create commission rate' });
  }
};

const updateCommissionRate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await commissionRateService.updateCommissionRate(id, req.body);
    if (!result) return res.status(404).json({ error: 'Commission rate not found' });
    res.json({ message: 'Commission rate updated successfully', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update commission rate' });
  }
};

const getAllCommissionRates = async (req, res) => {
  try {
    const data = await commissionRateService.getAllCommissionRates();
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch commission rates' });
  }
};

const getCommissionRateByOperator = async (req, res) => {
  try {
    const { operator } = req.params;
    const data = await commissionRateService.getCommissionRateByOperator(operator);
    if (!data) return res.status(404).json({ error: 'Operator commission not found' });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch commission rate' });
  }
};

module.exports = {
  createCommissionRate,
  updateCommissionRate,
  getAllCommissionRates,
  getCommissionRateByOperator
};
