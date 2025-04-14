const planService = require('../services/planService');

exports.addPlan = async (req, res) => {
    try {
        const plan = await planService.createPlan(req.body);
        res.status(201).json({
            message: 'Plan added successfully!',
            data: plan
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlansBySim = async (req, res) => {
    try {
        const plans = await planService.getPlansBySim(req.params.simId);
        res.status(200).json({
            message: 'Plans fetched by SIM successfully!',
            data: plans
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlansByType = async (req, res) => {
    try {
        const plans = await planService.getPlansByType(req.params.type);
        res.status(200).json({
            message: `Plans of type '${req.params.type}' fetched successfully!`,
            data: plans
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
