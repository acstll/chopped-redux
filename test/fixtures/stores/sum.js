
var actionTypes = require('../constants/action-types')

var initialState = 0

module.exports = function (state, action) {
  state = state || initialState

  switch (action.type) {
    case actionTypes.SUM:
      return state + action.result
      break

    case actionTypes.RESET_SUM:
      return 0
      break

    default:
      return state
  }
}
