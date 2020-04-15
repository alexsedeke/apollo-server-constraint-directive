const { GraphQLScalarType } = require('graphql');
const { contains, isLength } = require('validator');
const formats = require('./formats');
const ValidationError = require('./validationError');

function validate(fieldName, args, value) {
  if (args.minLength && !isLength(value, { min: args.minLength })) {
    throw new ValidationError(fieldName,
      `${fieldName} must be at least ${args.minLength} characters in length`,
      [{ arg: 'minLength', value: args.minLength }]);
  }
  if (args.maxLength && !isLength(value, { max: args.maxLength })) {
    throw new ValidationError(fieldName,
      `${fieldName} must be no more than ${args.maxLength} characters in length`,
      [{ arg: 'maxLength', value: args.maxLength }]);
  }

  if (args.startsWith && !value.startsWith(args.startsWith)) {
    throw new ValidationError(fieldName,
      `${fieldName} must start with ${args.startsWith}`,
      [{ arg: 'startsWith', value: args.startsWith }]);
  }

  if (args.endsWith && !value.endsWith(args.endsWith)) {
    throw new ValidationError(fieldName,
      `${fieldName} must end with ${args.endsWith}`,
      [{ arg: 'endsWith', value: args.endsWith }]);
  }

  if (args.contains && !contains(value, args.contains)) {
    throw new ValidationError(fieldName,
      `${fieldName} must contain ${args.contains}`,
      [{ arg: 'contains', value: args.contains }]);
  }

  if (args.notContains && contains(value, args.notContains)) {
    throw new ValidationError(fieldName,
      `${fieldName} must not contain ${args.notContains}`,
      [{ arg: 'notContains', value: args.notContains }]);
  }

  if (args.pattern && !new RegExp(args.pattern).test(value)) {
    throw new ValidationError(fieldName,
      `${fieldName} must match ${args.pattern}`,
      [{ arg: 'pattern', value: args.pattern }]);
  }

  if (args.format) {
    const formatter = formats[args.format];

    if (!formatter) {
      throw new ValidationError(fieldName,
        `${fieldName} has invalid format type ${args.format}`,
        [{ arg: 'format', value: args.format }]);
    }

    try {
      formatter(value); // Will throw if invalid
    } catch (error) {
      throw new ValidationError(fieldName,
        error.message,
        [{ arg: 'format', value: args.format }]);
    }
  }
}

// here we should test the difference between
// inserted value on wrapped objects with not null and unwrapped object like strings.
// Does there is always a serialize or parseValue function?

// and do not forget to customize your error message
class StringType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: 'ValidateString',
      serialize(val) {
        const value = type.serialize(val);
        validate(fieldName, args, value);
        return value;
      },
      parseValue(val) {
        const value = type.parseValue(val);
        validate(fieldName, args, value);
        return type.parseValue(value);
      },
      parseLiteral(ast) {
        const value = type.parseLiteral(ast);
        validate(fieldName, args, value);
        return value;
      },
    });
  }
}

module.exports = StringType;
