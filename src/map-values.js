
// Liftet from https://github.com/gaearon/redux

module.exports = function mapValues (obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = fn(obj[key], key)
    return result
  }, {})
}
