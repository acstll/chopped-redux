
var actionTypes = require('../constants/action-types')

exports.increment = function (dispatch) {
  return dispatch({
    type: actionTypes.INCREMENT_COUNTER
  })
}

exports.decrement = function (dispatch) {
  return dispatch({
    type: actionTypes.DECREMENT_COUNTER
  })
}
