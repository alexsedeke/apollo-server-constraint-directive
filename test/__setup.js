const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const ConstraintDirective = require('../')

const constructTestServer = ({ typeDefs, resolvers, formatError }) => {
  const schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: { constraint: ConstraintDirective },
    resolvers
  });

  const server = new ApolloServer({ schema, formatError });
  return { server };
};

module.exports.constructTestServer = constructTestServer;
