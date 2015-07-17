
module.exports = function (reducer, state, listeners) {
  listeners = listeners || []

  if (typeof reducer !== 'function') {
    throw new TypeError('The `reducer` param must be a function')
  }

  function getState () {
    return state
  }

  function replaceState (nextState) {
    state = nextState
  }

  function dispatch (action) {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    state = reducer(state, action)
    listeners.forEach(function (fn) { fn(action) })
  }

  function wrap (methods) {
    var wrapped = {}

    Object.keys(methods).forEach(function (key) {
      if (typeof methods[key] === 'function') {
        wrapped[key] = function () {
          dispatch(methods[key].apply(null, arguments))
        }
      }
    })

    return wrapped
  }

  function subscribe (fn) {
    listeners.push(fn)

    return function unsubscribe () {
      var index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  }

  return {
    getState: getState,
    replaceState: replaceState,
    dispatch: dispatch,
    wrap: wrap,
    subscribe: subscribe
  }
}
