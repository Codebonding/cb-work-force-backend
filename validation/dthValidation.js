const Joi = require('joi');

const createDthSchema = Joi.object({
  name: Joi.string().required(),
  operatorCode: Joi.string().required(),
  circleCode: Joi.number().integer().required()
});

module.exports = {
  createDthSchema
};