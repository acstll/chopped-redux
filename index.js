
module.exports = function factory (update, state) {
  var listeners = []

  if (typeof update !== 'function') {
    throw new TypeError('The `update` param must be a function.')
  }

  function getState () {
    return state
  }

  function dispatch (action) {
    action = action || {}
    state = update(state, action)
    listeners.slice().forEach(function (fn) { fn(action) })

    return action
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
    dispatch: dispatch,
    subscribe: subscribe
  }
}
