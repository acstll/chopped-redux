
module.exports = function (update, state, listeners) {
  listeners = listeners || []

  if (typeof update !== 'function') {
    throw new TypeError('The `update` param must be a function.')
  }

  function getState () {
    return state
  }

  function replaceState (nextState) {
    state = nextState
  }

  function dispatch (action) {
    action = action || {}
    state = update(state, action)
    listeners.forEach(function (fn) { fn(action) })
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
    subscribe: subscribe
  }
}
