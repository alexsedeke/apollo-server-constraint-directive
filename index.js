const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const {
  SchemaDirectiveVisitor,
} = require('apollo-server');
const StringType = require('./scalars/stringValidation');
const NumberType = require('./scalars/numberValidation');

class ConstraintDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  visitFieldDefinition(field) {
    this.wrapType(field);
  }

  wrapType(field) {
    const fieldName = field.astNode.name.value;
    const type = field.type.ofType || field.type;
    const isNotNull = (field.type instanceof GraphQLNonNull);
    const isScalarOfTypeString = (type === GraphQLString);
    const isScalarOfTypeNumber = (type === GraphQLInt || type === GraphQLFloat);

    if (!isScalarOfTypeString && !isScalarOfTypeNumber) {
      throw new Error(`Not a scalar of type ${type}`);
    }

    if (isScalarOfTypeString) {
      field.type = new StringType(fieldName, type, this.args);
    }

    if (isScalarOfTypeNumber) {
      field.type = new NumberType(fieldName, type, this.args);
    }

    if (isNotNull) {
      field.type = new GraphQLNonNull(field.type);
    }
  }
}

module.exports = ConstraintDirective;
