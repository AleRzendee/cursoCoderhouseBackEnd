export default class CustomError extends Error {
    constructor(message, code, details = {}) {
      super(message);
      this.name = 'CustomError';
      this.code = code;
      this.details = details;
    }
  }
  