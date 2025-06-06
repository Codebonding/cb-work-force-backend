const Dth = require('../models/Dth');

const createDth = async (data) => {
  return await Dth.create(data);
};

const getAllDth = async () => {
  return await Dth.findAll();
};

const getDthById = async (id) => {
  return await Dth.findByPk(id);
};

const updateDth = async (id, data) => {
  const dth = await Dth.findByPk(id);
  if (!dth) return null;
  return await dth.update(data);
};

const deleteDth = async (id) => {
  const dth = await Dth.findByPk(id);
  if (!dth) return null;
  await dth.destroy();
  return dth;
};

module.exports = {
  createDth,
  getAllDth,
  getDthById,
  updateDth,
  deleteDth
};
