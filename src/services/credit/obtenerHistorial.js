const creditModel = require('../../models/CreditModel');

module.exports = async (clienteId) => {
  return await creditModel.findByClientId(clienteId);
};
