
module.exports = class CustomDirectiveError extends Error {
  constructor(fieldName, message, context) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.code = 'BAD_USER_INPUT';
    this.fieldName = fieldName;
    this.context = context;
  }
};
