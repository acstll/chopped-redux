
var curry = require('curry')

module.exports = function wrap (methods, dispatch) {
  var wrapped = {}
  var curried

  Object.keys(methods).forEach(function (key) {
    if (typeof methods[key] === 'function') {
      if (methods[key].length < 2) {
        throw new Error(
          'Methods to be wrapped must take at least two arguments. ' +
          'The expected signature is `function (dispatch, payload) {}`.'
        )
      }
      curried = curry(methods[key])
      wrapped[key] = curried(dispatch)
    }
  })

  return wrapped
}
