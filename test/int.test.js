const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const { constructTestServer } = require('./__setup');
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
describe('INPUT_FIELD_DEFINITION Int validate @constraint #min', () => {
  const typeDefs = gql`
    directive @constraint(min: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: Int! @constraint(min: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 3 } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 2 } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION Int validate @constraint #max', () => {
  const typeDefs = gql`
    directive @constraint(max: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: Int! @constraint(max: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 2 } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 5 } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION Int validate @constraint #exclusiveMin', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMin: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: Int! @constraint(exclusiveMin: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 4 } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 3 } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION Int validate @constraint #exclusiveMax', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMax: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: Int! @constraint(exclusiveMax: 3)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 2 } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 3 } } });
    expect(res).toMatchSnapshot();
  });
});

describe('INPUT_FIELD_DEFINITION Int validate @constraint #multipleOf', () => {
  const typeDefs = gql`
    directive @constraint(multipleOf: Int) on INPUT_FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int
    }
    type Mutation {
      createBook(input: BookInput): Book
    }
    input BookInput {
      title: Int! @constraint(multipleOf: 2)
    }
  `;

  it('should pass', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 10 } } });
    expect(res).toMatchSnapshot();
  });

  it('should fail', async () => {
    const { server } = constructTestServer({ typeDefs });
    const { query } = createTestClient(server);
    const res = await query({ mutation: SET_BOOK, variables: { input: { title: 7 } } });
    expect(res).toMatchSnapshot();
  });
});

// FIELD_DEFINITION
describe('FIELD_DEFINITION Int validate @constraint #min', () => {
  const typeDefs = gql`
    directive @constraint(min: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(min: 3)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 2 }, { title: 3 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 1 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #min0', () => {
  const typeDefs = gql`
    directive @constraint(min: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(min: 0)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 1 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: -1 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #max', () => {
  const typeDefs = gql`
    directive @constraint(max: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(max: 2)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 1 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 3 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #max0', () => {
  const typeDefs = gql`
    directive @constraint(max: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(max: 0)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 0 }, { title: -1 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 3 }, { title: -2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #exclusiveMin', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMin: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(exclusiveMin: 2)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 3 }, { title: 4 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 3 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #exclusiveMin0', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMin: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(exclusiveMin: 0)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 1 }, { title: 3 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 0 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #exclusiveMax', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMax: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(exclusiveMax: 2)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 0 }, { title: 1 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 1 }, { title: 2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #exclusiveMax0', () => {
  const typeDefs = gql`
    directive @constraint(exclusiveMax: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(exclusiveMax: 0)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: -1 }, { title: -2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 0 }, { title: -2 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});

describe('FIELD_DEFINITION Int validate @constraint #multipleOf', () => {
  const typeDefs = gql`
    directive @constraint(multipleOf: Int) on FIELD_DEFINITION
    type Query {
      books: [Book]
    }
    type Book {
      title: Int @constraint(multipleOf: 2)
    }
  `;

  it('should pass', async () => {
    const mockData = [{ title: 2 }, { title: 4 }, { title: 6 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });

  it('should fail', async () => {
    const mockData = [{ title: 1 }, { title: 2 }, { title: 3 }]
    const { server } = constructTestServer({ typeDefs, resolvers: resolvers(mockData) })
    const { query } = createTestClient(server)
    const res = await query({ query: GET_BOOK })
    expect(res).toMatchSnapshot()
  });
});
