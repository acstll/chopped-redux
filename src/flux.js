
var mapValues = require('./map-values')

var combineReducers = function combineReducers (reducers) {
  return function (tree, action) {
    tree = tree || {}

    return mapValues(reducers, function (fn, key) {
      return fn(tree[key], action)
    })
  }
}

module.exports = function fluxFactory (reducer, initialState) {
  if (!reducer) {
    throw new Error('The `reducer` param is mandatory')
  }

  var reduce = typeof reducer === 'function'
    ? reducer
    : combineReducers(reducer)

  return {
    reduce: reduce,

    state: initialState !== null ? initialState : Object.create(null),
    
    listeners: [],

    dispatch: function (action) {
      var self = this
      self.state = self.reduce(self.state, action)
      self.listeners.forEach(function (listener) {
        listener(action)
      })
    },

    getDispatcher: function () {
      var self = this
      return self.dispatch.bind(self)
    },

    getState: function () {
      var self = this
      return self.state
    },

    subscribe: function (listener) {
      var self = this
      self.listeners.push(listener)

      return function unsubscribe () {
        var index = self.listeners.indexOf(listener)
        self.listeners.splice(index, 1)
      }
    }

  }
}
