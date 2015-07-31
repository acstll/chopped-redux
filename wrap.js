
var curry = require('curry')

module.exports = function wrap (methods, dispatch) {
  var wrapped = {}
  var curried

  Object.keys(methods).forEach(function (key) {
    if (typeof methods[key] === 'function') {
      curried = curry(methods[key])
      wrapped[key] = curried(dispatch)
    }
  })

  return wrapped
}
