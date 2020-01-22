# apollo-server-constraint-directive
[![Build Status](https://travis-ci.org/alexanderVu/apollo-server-constraint-directive.svg?branch=master)](https://travis-ci.org/alexanderVu/apollo-server-constraint-directive)
[![Coverage Status](https://coveralls.io/repos/github/alexanderVu/apollo-server-constraint-directive/badge.svg?branch=master)](https://coveralls.io/github/alexanderVu/apollo-server-constraint-directive?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/alexanderVu/apollo-server-constraint-directive/badge.svg?targetFile=package.json)](https://snyk.io/test/github/alexanderVu/apollo-server-constraint-directive?targetFile=package.json)

Allows using @constraint as a directive to validate input and output data. This module is for [*Apollo Server*](https://www.apollographql.com/docs/apollo-server/getting-started/), and support the latest [Apollo Server](https://www.apollographql.com/) version 2.

It is mainly based on the module from [graphql-constraint-directive](https://github.com/confuser/graphql-constraint-directive), which is for Apollo version 1 only.
This module is an Inspired by [Constraints Directives RFC](https://github.com/APIs-guru/graphql-constraints-spec) and OpenAPI

If you are looking for a playground checkout this project [apollo-server-playground](https://github.com/alexanderVu/apollo-server-playground).

## Install

```bash
npm install apollo-server-constraint-directive
```

## Usage

```js
const { ApolloServer, makeExecutableSchema, gql } = require('apollo-server')
const ConstraintDirective = require('apollo-server-constraint-directive')

const schemaDirectives = {
  constraint: ConstraintDirective,
};

const typeDefs = gql`
  directive @constraint(
    # String constraints
    minLength: Int
    maxLength: Int
    startsWith: String
    endsWith: String
    notContains: String
    pattern: String
    format: String
    passwordScore: String

    # Number constraints
    min: Int
    max: Int
    exclusiveMin: Int
    exclusiveMax: Int
    multipleOf: Int
  ) on INPUT_FIELD_DEFINITION
  
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
    title: String! @constraint(minLength: 5, format: "email")
  }`

// The ApolloServer constructor
const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, schemaDirectives })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
```

## API

### String

#### minLength

```@constraint(minLength: 5)```
Restrict to a minimum length

#### maxLength

```@constraint(maxLength: 5)```
Restrict to a maximum length

#### startsWith

```@constraint(startsWith: "foo")```
Ensure value starts with foo

#### endsWith

```@constraint(endsWith: "foo")```
Ensure value ends with foo

#### contains

```@constraint(contains: "foo")```
Ensure value contains foo

#### notContains

```@constraint(notContains: "foo")```
Ensure value does not contain foo

#### pattern

```@constraint(pattern: "^[0-9a-zA-Z]*$")```
Ensure value matches regex, e.g. alphanumeric

#### format

```@constraint(format: "email")```
Ensure value is in a particular format

Supported formats:

- byte: Base64
- date-time: RFC 3339
- date: ISO 8601
- email
- ipv4
- ipv6
- uri
- uuid

#### password strength

```@constraint(password: 3)```
Ensure password value has estimated strength. [zxcvbn](https://github.com/dropbox/zxcvbn) is used under the hood. Possible strength values are between 1 and 5. Heigher is better

### Int/Float

#### min

```@constraint(min: 3)```
Ensure value is greater than or equal to

#### max

```@constraint(max: 3)```
Ensure value is less than or equal to

#### exclusiveMin

```@constraint(exclusiveMin: 3)```
Ensure value is greater than

#### exclusiveMax

```@constraint(exclusiveMax: 3)```
Ensure value is less than

#### multipleOf

```@constraint(multipleOf: 10)```
Ensure value is a multiple

### ConstraintDirectiveError

Each validation error throws a `ConstraintDirectiveError`. Combined with a formatError function, this can be used to customise error messages.

```js
{
  code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
  fieldName: 'theFieldName',
  context: [ { arg: 'argument name which failed', value: 'value of argument' } ]
}
```

```js
const formatError = function (error) {
  if (error.originalError && error.originalError.code === 'ERR_GRAPHQL_CONSTRAINT_VALIDATION') {
    // return a custom object
  }
  return error
}

const apollo = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, schemaDirectives }),
  formatError
});

```
