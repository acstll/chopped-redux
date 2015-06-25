
var actionTypes = require('../constants/action-types')

var initialState = 0

module.exports = function (state, action) {
  state = state || initialState
  
  switch (action.type) {
    case actionTypes.INCREMENT_COUNTER:
      return state + 1
      break

    case actionTypes.DECREMENT_COUNTER:
      return state - 1
      break

    default:
      return state
  }
}
