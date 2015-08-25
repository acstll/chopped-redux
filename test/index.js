
var test = require('tape')
var Immutable = require('immutable')

var createStore = require('../')

// Action types
var INCREMENT_COUNTER = 'INCREMENT_COUNTER'
var DECREMENT_COUNTER = 'DECREMENT_COUNTER'

// Action helpers
var increment = function (dispatch) {
  dispatch({ type: INCREMENT_COUNTER })
}
var decrement = function (dispatch) {
  dispatch({ type: DECREMENT_COUNTER })
}

// Initial state
var state = { counter: 1 }
var immutableState = Immutable.Map({ counter: 1 })

// Updaters
var update = function (state, action) {
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
var immutableUpdate = function (state, action) {
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

test('Factory', function (t) {
  t.plan(2)

  var identity = function (x) { return x }
  var a = createStore(identity)
  var b = createStore(identity)

  t.throws(function () {
    createStore()
  }, 'throws if missing update param')

  t.notEqual(a, b, 'no singleton')
})

test('Dispatching', function (t) {
  t.plan(2)

  var store = createStore(update)
  t.doesNotThrow(store.dispatch, 'empty is possible')

  var result = store.dispatch({ foo: 'bar' })
  t.equal(result.foo, 'bar', 'returns given action')
})

test('Mutable', function (t) {
  t.plan(3)

  var store = createStore(update, state)

  increment(store.dispatch)
  t.equal(store.getState().counter, 2, 'action dispatched 1')

  decrement(store.dispatch)
  t.equal(store.getState().counter, 1, 'action dispatched 2')

  t.equal(store.getState(), state, 'state is the same (mutable) object')
})

test('Immutable', function (t) {
  t.plan(3)

  var store = createStore(immutableUpdate, immutableState)

  increment(store.dispatch)
  t.equal(store.getState().get('counter'), 2, 'action dispatched 1')

  decrement(store.dispatch)
  t.equal(store.getState().get('counter'), 1, 'action dispatched 2')

  t.notEqual(store.getState(), immutableState, 'state is not the same object')
})

test('Listeners', function (t) {
  t.plan(5)

  var store = createStore(immutableUpdate, Immutable.Map({ counter: 5 }))

  var off1 = store.subscribe(function () { t.pass('get called 1 (x2)') })
  var off2 = store.subscribe(function () {
    t.equal(store.getState().get('counter'), 6, 'can be removed from within (x1)')
    off2()
  })
  var off3 = store.subscribe(function () { t.pass('get called 2 (x2)') })

  store.dispatch({ type: INCREMENT_COUNTER })
  store.dispatch()

  off1()
  off3()

  store.dispatch()
})

test('No initial state provided', function (t) {
  t.plan(1)

  var store = createStore(update, null)

  store.dispatch({ type: DECREMENT_COUNTER })
  t.equal(store.getState().counter, 9, 'gets set by updater')
})

test('First-class dispatch and getState, no bind', function (t) {
  t.plan(2)

  var initialState = { counter: 5 }
  var store = createStore(update, initialState)

  function wrapper (fn) {
    return function (a) {
      return fn(a)
    }
  }

  var dispatch = wrapper(store.dispatch)
  var getState = wrapper(store.getState)

  t.equal(getState(), initialState, 'for getState')

  increment(dispatch)
  t.equal(getState().counter, 6, 'for dispatch')
})

test('replaceState', function (t) {
  t.plan(2)

  var initialState = { counter: -1 }
  var store = createStore(update, initialState)

  increment(store.dispatch)
  t.equal(store.getState().counter, 0, '(test dispatch)')

  store.replaceState({ counter: 24 })
  decrement(store.dispatch)
  t.equal(store.getState().counter, 23, 'works')
})

test('`updater` property', function (t) {
  t.plan(3)

  var store = createStore(update)

  store.dispatch()
  t.equal(store.getState().counter, 10)

  t.equal(typeof store.updater, 'function', 'is getter')

  store.updater = function (state, action) {
    return { counter: 99 }
  }
  store.dispatch()
  t.equal(store.getState().counter, 99, 'is setter')
})
