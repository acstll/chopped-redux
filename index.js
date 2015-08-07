
module.exports = function factory (update, state, listeners) {
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

  function store (nextUpdate, nextState, nextListeners) {
    var args = [
      nextUpdate || update,
      nextState || state,
      nextListeners || listeners
    ]

    return factory.apply(null, args)
  }

  store.getState = getState
  store.replaceState = replaceState // deprecate if `store()` API works
  store.dispatch = dispatch
  store.subscribe = subscribe

  return store
}
