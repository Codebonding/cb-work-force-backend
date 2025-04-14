const simService = require('../services/simService');

exports.addSim = async (req, res) => {
    try {
        const sim = await simService.createSim(req.body);
        res.status(201).json({
            message: 'SIM added successfully!',
            data: sim
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllSims = async (req, res) => {
    try {
        const sims = await simService.getAllSims();
        res.status(200).json({
            message: 'All SIMs fetched successfully!',
            data: sims
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
