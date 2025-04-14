const InvestmentPlan = require('../models/InvestmentPlan');

exports.createPlan = async (data, createdBy) => {
    const {
        investmentAmount,
        durationValue,
        payoutCycleValue,
        profit
    } = data;

    const payoutCycles = Math.floor(durationValue / payoutCycleValue);
    const payoutPerCycle = Number((profit / payoutCycles).toFixed(2));
    const totalReturn = investmentAmount + profit;
    const totalPayout = profit;

    return await InvestmentPlan.create({
        ...data,
        payoutPerCycle,
        totalReturn,
        totalPayout,
        createdBy
    });
};

exports.getAllPlans = async () => {
    return await InvestmentPlan.findAll({ order: [['createdAt', 'DESC']] });
};

exports.getPlanById = async (id) => {
    return await InvestmentPlan.findByPk(id);
};

exports.updatePlan = async (id, data, updatedBy) => {
    const plan = await InvestmentPlan.findByPk(id);
    if (!plan) return null;

    const {
        investmentAmount,
        durationValue,
        payoutCycleValue,
        profit
    } = data;

    const payoutCycles = Math.floor(durationValue / payoutCycleValue);
    const payoutPerCycle = Number((profit / payoutCycles).toFixed(2));
    const totalReturn = investmentAmount + profit;
    const totalPayout = profit;

    await plan.update({
        ...data,
        payoutPerCycle,
        totalReturn,
        totalPayout,
        updatedBy
    });

    return plan;
};

exports.deletePlan = async (id) => {
    const plan = await InvestmentPlan.findByPk(id);
    if (!plan) return null;
    await plan.destroy();
    return plan;
};
