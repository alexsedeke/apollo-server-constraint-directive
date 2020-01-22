const zxcvbn = require('zxcvbn')

module.exports = (value, strengthEstimated) => {
  const result = zxcvbn(value);
  return (
    result
    && typeof result.score === 'number' 
    && result.score >= strengthEstimated
  ) 
}
