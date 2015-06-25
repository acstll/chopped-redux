
var mapValues = require('./map-values')

module.exports = function (actionCreators, dispatch) {
  return mapValues(actionCreators, function (actionCreator) {
    return function wrapper () {
      var args = [].slice.call(arguments)
      args.push(dispatch)
      
      return actionCreator.apply(null, args)
    }
  })
}
