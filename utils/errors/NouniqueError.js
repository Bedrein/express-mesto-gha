const { ERROR_NOUNIQUE } = require('../constants');

class NouniqueError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOUNIQUE;
  }
}

module.exports = NouniqueError;
