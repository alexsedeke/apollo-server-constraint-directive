const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const { constructTestServer } = require('./__setup');

const formatError = (error) => {
  const { message, code, fieldName, context } = error.originalError
  return { message, code, fieldName, context }
}

const SET_BOOK = gql`mutation createBook($input: BookInput) {
  createBook(input: $input) {
    title
  }
}`

const GET_BOOK = gql`query {
  books {
    title
  }
}`

const resolvers = function (data) {
  return {
    Query: {
      books () {
        return data
      }
    }
  }
}

// INPUT_FIELD_DEFINITION
describe('INPUT_FIELD_DEFINITION String validate @constraint #minLength', () => {
  const typeDefs = gql`
    directive @constraint(minLength: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(minLength: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'he💩' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'a💩' } } });
    expect(res).toMatchSnapshot();
  });

  it('should throw custom error', async () => {
    const { server } = constructTestServer({ typeDefs, formatError });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'a💩' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #maxLength', () => {
  const typeDefs = gql`
    directive @constraint(maxLength: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(maxLength: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'a💩' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'fail💩' } } });
    expect(res).toMatchSnapshot();
  });

  it('should throw custom error', async () => {
    const { server } = constructTestServer({ typeDefs, formatError });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'fail💩' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #startsWith', () => {
  const typeDefs = gql`
    directive @constraint(startsWith: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(startsWith: "💩")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '💩 yes' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'no 💩' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #endsWith', () => {
  const typeDefs = gql`
    directive @constraint(endsWith: String) on INPUT_FIELD_DEFINITION 
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(endsWith: "💩")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'yes 💩' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '💩 no' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #contains', () => {
  const typeDefs = gql`
    directive @constraint(contains: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(contains: "💩")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'It contains 💩 the sign' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'Oh no' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #notContains', () => {
  const typeDefs = gql`
    directive @constraint(notContains: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(notContains: "💩")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'It do not contains the sign' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'It contains 💩 the sign' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #pattern', () => {
  const typeDefs = gql`
    directive @constraint(pattern: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(pattern: "^[0-9a-zA-Z]*$")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'afoo' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '£££' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #byte', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "byte")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'afoo' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '£££' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #date-time', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "date-time")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '2018-05-16 12:57:00Z' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'no time' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #date', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "date")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '2018-05-16' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'too late' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #email', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "email")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'test@test.com' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'null' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #ipv4', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "ipv4")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '127.0.0.1' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'null' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #ipv6', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "ipv6")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: '2001:db8:0000:1:1:1:1:1' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'null' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #uri', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "uri")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'foobar.com' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'null' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #uuid', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "uuid")
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'A987FBC9-4BED-3078-CF07-9141BA07C9F3' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'null' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #format #unknowm', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(format: "unknowm")
    }
  `;

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'a' } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION String validate @constraint #passwordScore', () => {
  const typeDefs = gql`
    directive @constraint(passwordScore: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: String! @constraint(passwordScore: 3)
    }
  `;

  it('should pass equal', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'Tr0ub4dour&3|!' } } });
    expect(res).toMatchSnapshot();
  });

  it('should pass higher', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'Tr0ub4dour&3|!dseě' } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 'got 💩' } } });
    expect(res).toMatchSnapshot();
  });
});

// FIELD_DEFINITION
describe('FIELD_DEFINITION String validate @constraint #minLength', () => {
  const typeDefs = gql`
    directive @constraint(minLength: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(minLength: 3)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foo' }, { title: 'foobar' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'fo' }, { title: 'foo' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #maxLength', () => {
  const typeDefs = gql`
    directive @constraint(maxLength: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(maxLength: 3)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'fo' }, { title: 'foo' }, { title: 'bar' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'foo' }, { title: 'foobar' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #startsWith', () => {
  const typeDefs = gql`
    directive @constraint(startsWith: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(startsWith: "💩")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: '💩foo' }, { title: '💩bar' }, { title: '💩baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: '💩foo' }, { title: '💩bar' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #endsWith', () => {
  const typeDefs = gql`
    directive @constraint(endsWith: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(endsWith: "💩")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foo💩' }, { title: 'bar💩' }, { title: 'baz💩' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'foo💩' }, { title: 'bar💩' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #contains', () => {
  const typeDefs = gql`
    directive @constraint(contains: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(contains: "💩")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foo💩' }, { title: 'bar💩' }, { title: 'baz💩' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'foo💩' }, { title: 'bar💩' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #notContains', () => {
  const typeDefs = gql`
    directive @constraint(notContains: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(notContains: "💩")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foo' }, { title: 'bar' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'foo💩' }, { title: 'bar💩' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #pattern', () => {
  const typeDefs = gql`
    directive @constraint(pattern: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(pattern: "^[0-9a-zA-Z]*$")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foo' }, { title: 'bar' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'foo💩' }, { title: '£££' }, { title: 'baz' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #byte', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "byte")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'afoo' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: '£££' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #date-time', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "date-time")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: '2018-05-16T12:57:00Z' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: '2018-05-1612:57:00Z' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #date', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "date")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: '2018-05-16' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'no time' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #email', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "email")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'test@test.com' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'testtest.com' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #ipv4', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "ipv4")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: '127.0.0.1' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: '256.256.256.256' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #ipv6', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "ipv6")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: '2001:db8:0000:1:1:1:1:1' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: '256.256.256.256' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #uri', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "uri")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'foobar.com' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'nodomain' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #uuid', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "uuid")
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 'A987FBC9-4BED-3078-CF07-9141BA07C9F3' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 'nouuid' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION String validate @constraint #format #unknown', () => {
  const typeDefs = gql`
    directive @constraint(format: String) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: String @constraint(format: "unknown")
    }
  `;

  it('should fail', async () => {
    const mockData = [{ title: 'nouuid' }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});
