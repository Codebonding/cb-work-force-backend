const Sim = require('../models/Sim');

exports.createSim = async (data) => await Sim.create(data);
exports.getAllSims = async () => await Sim.findAll();
exports.getSimById = async (id) => await Sim.findByPk(id);