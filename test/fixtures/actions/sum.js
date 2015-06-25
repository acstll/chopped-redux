
var actionTypes = require('../constants/action-types')

exports.sum = function (result, dispatch) {
  return dispatch({
    type: actionTypes.SUM,
    result: result
  })
}

exports.reset = function (dispatch) {
  return dispatch({
    type: actionTypes.RESET_SUM
  })
}
