
var test = require('tape')
var Immutable = require('immutable')

var fluxFactory = require('../')

// Silly constants
var INCREMENT_COUNTER = 'INCREMENT_COUNTER'
var DECREMENT_COUNTER = 'DECREMENT_COUNTER'

// Actions
var increment = function () {
  return {
    type: INCREMENT_COUNTER
  }
}
var decrement = function () {
  return {
    type: DECREMENT_COUNTER
  }
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

test('mutable, listeners', function (t) {
  t.plan(4)

  var flux = fluxFactory(reducer, state)

  flux.subscribe(function () {})
  var unsubscribe = flux.subscribe(function () { t.pass('listener called') })
  flux.subscribe(function () {})

  flux.dispatch(increment())
  t.equal(flux.getState().counter, 2, 'action dispatched 1')

  unsubscribe()

  flux.dispatch(decrement())
  t.equal(flux.getState().counter, 1, 'action dispatched 1')

  t.equal(flux.getState(), state, 'state is the same mutable object')
})

test('immutable', function (t) {
  t.plan(3)

  var flux = fluxFactory(immutableReducer, immutableState)

  flux.dispatch(increment())
  t.equal(flux.getState().get('counter'), 2, 'action dispatched 1')

  flux.dispatch(decrement())
  t.equal(flux.getState().get('counter'), 1, 'action dispatched 1')

  t.notEqual(flux.getState(), immutableState, 'state is not the same object')
})

test('no initial state provided', function (t) {
  t.plan(1)

  var flux = fluxFactory(reducer, null)

  flux.dispatch(decrement())
  t.equal(flux.getState().counter, 9, 'gets set in reducer')
})

test('first-class dispatch and getState, no bind', function (t) {
  t.plan(2)

  var initialState = { counter: 5 }
  var flux = fluxFactory(reducer, initialState)

  function wrapper (fn) {
    return function (a) {
      return fn(a)
    }
  }

  var dispatch = wrapper(flux.dispatch)
  var getState = wrapper(flux.getState)

  t.equal(getState(), initialState, 'getState')

  dispatch(increment())
  t.equal(getState().counter, 6, 'dispatch')
})

test('handle actions being functions', function (t) {
  t.plan(2)

  var flux = fluxFactory(reducer, { counter: 32 })

  flux.dispatch(function (dispatch, getState) {
    t.equal(getState().counter, 32, 'getState gets passed in')
    dispatch({ type: INCREMENT_COUNTER })
  })

  t.equal(flux.getState().counter, 33, 'alright')
})

test('replaceState', function (t) {
  t.plan(2)

  var initialState = { counter: -1 }
  var flux = fluxFactory(reducer, initialState)

  flux.dispatch(increment())
  t.equal(flux.getState().counter, 0, '(test dispatch)')

  flux.replaceState({ counter: 24 })
  flux.dispatch(decrement())
  t.equal(flux.getState().counter, 23, 'works')
})

test('wrap action creators', function (t) {
  t.plan(3)

  var inc = function (data) {
    t.equal(data.foo, 'bar', 'arguments get passed in')

    return {
      type: INCREMENT_COUNTER
    }
  }

  var flux = fluxFactory(reducer, { counter: 20 })
  var actions = flux.wrap({ increment: inc, decrement: decrement })

  actions.increment({ foo: 'bar' })
  t.equal(flux.getState().counter, 21, 'works')

  actions.decrement()
  t.equal(flux.getState().counter, 20, 'correctly')
})

test('no singleton', function (t) {
  t.plan(1)

  var identity = function (x) { return x }
  var a = fluxFactory(identity)
  var b = fluxFactory(identity)

  t.notEqual(a, b, 'ok')
})
