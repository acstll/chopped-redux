
var test = require('tape')
var Immutable = require('immutable')

var createStore = require('../')
var wrap = require('../wrap')

// Action types
var INCREMENT_COUNTER = 'INCREMENT_COUNTER'
var DECREMENT_COUNTER = 'DECREMENT_COUNTER'

// Action factories (creators)
var increment = function (dispatch) {
  dispatch({ type: INCREMENT_COUNTER })
}
var decrement = function (dispatch) {
  dispatch({ type: DECREMENT_COUNTER })
}

// Initial state
var state = { counter: 1 }
var immutableState = Immutable.Map({ counter: 1 })

// Reducers
var reducer = function (state, action) {
  state = state || { counter: 10 }

  switch (action.type) {
    case INCREMENT_COUNTER:
      state.counter++
      break
    case DECREMENT_COUNTER:
      state.counter--
      break
  }

  return state
}
var immutableReducer = function (state, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      state = state.set('counter', state.get('counter') + 1)
      break
    case DECREMENT_COUNTER:
      state = state.set('counter', state.get('counter') - 1)
      break
  }

  return state
}

test('factory', function (t) {
  t.plan(2)

  var identity = function (x) { return x }
  var a = createStore(identity)
  var b = createStore(identity)

  t.throws(function () {
    createStore()
  }, 'throws if missing reducer param')

  t.notEqual(a, b, 'no singleton')
})

test('mutable, listeners', function (t) {
  t.plan(4)

  var store = createStore(reducer, state)

  store.subscribe(function () {})
  var unsubscribe = store.subscribe(function () { t.pass('listener called') })
  store.subscribe(function () {})

  increment(store.dispatch)
  t.equal(store.getState().counter, 2, 'action dispatched 1')

  unsubscribe()

  decrement(store.dispatch)
  t.equal(store.getState().counter, 1, 'action dispatched 1')

  t.equal(store.getState(), state, 'state is the same mutable object')
})

test('immutable', function (t) {
  t.plan(3)

  var store = createStore(immutableReducer, immutableState)

  increment(store.dispatch)
  t.equal(store.getState().get('counter'), 2, 'action dispatched 1')

  decrement(store.dispatch)
  t.equal(store.getState().get('counter'), 1, 'action dispatched 1')

  t.notEqual(store.getState(), immutableState, 'state is not the same object')
})

test('no initial state provided', function (t) {
  t.plan(1)

  var store = createStore(reducer, null)

  store.dispatch({ type: DECREMENT_COUNTER })
  t.equal(store.getState().counter, 9, 'gets set in reducer')
})

test('first-class dispatch and getState, no bind', function (t) {
  t.plan(2)

  var initialState = { counter: 5 }
  var store = createStore(reducer, initialState)

  function wrapper (fn) {
    return function (a) {
      return fn(a)
    }
  }

  var dispatch = wrapper(store.dispatch)
  var getState = wrapper(store.getState)

  t.equal(getState(), initialState, 'getState')

  increment(dispatch)
  t.equal(getState().counter, 6, 'dispatch')
})

test('replaceState', function (t) {
  t.plan(2)

  var initialState = { counter: -1 }
  var store = createStore(reducer, initialState)

  increment(store.dispatch)
  t.equal(store.getState().counter, 0, '(test dispatch)')

  store.replaceState({ counter: 24 })
  decrement(store.dispatch)
  t.equal(store.getState().counter, 23, 'works')
})

test('wrap/curry action factories', function (t) {
  t.plan(3)

  var inc = function (dispatch, data) {
    t.equal(data.foo, 'bar', 'arguments get passed in')

    dispatch({
      type: INCREMENT_COUNTER
    })
  }

  var store = createStore(reducer, { counter: 20 })
  var actions = wrap({ increment: inc }, store.dispatch)

  actions.increment({ foo: 'bar' })
  t.equal(store.getState().counter, 21, 'works')

  t.throws(function () {
    wrap({ increment: increment }, store.dispatch)
  }, 'must take at least 2 arguments')
})

test('empty dispatching', function (t) {
  t.plan(1)

  var store = createStore(reducer)
  t.doesNotThrow(store.dispatch, 'is possible')
})
