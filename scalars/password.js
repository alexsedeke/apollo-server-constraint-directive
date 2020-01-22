const zxcvbn = require('zxcvbn')
const { GraphQLError } = require('graphql/error')

module.exports = (value, strengthEstimated) => {
  const result = zxcvbn(value);
  if (result
    && typeof result.score === 'number' 
    && result.score >= strengthEstimated) return true

  throw new GraphQLError('Password is not strong enough!')
}
