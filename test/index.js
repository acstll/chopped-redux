
var test = require('tape')
var fluxFactory = require('../')

var wrapActionCreators = fluxFactory.wrapActionCreators
var MANUAL = 'MANUAL'
var stores = {
  counter: require('./fixtures/stores/counter'),
  sum: require('./fixtures/stores/sum'),
  beep: function (state, action) {
    return action.type === MANUAL
      ? 'boop'
      : state || undefined
  }
}
var actionCreators = {
  counter: require('./fixtures/actions/counter'),
  sum: require('./fixtures/actions/sum')
}

/*
var flux = fluxFactory(stores, {})
var dispatch = flux.getDispatcher()
var actions = {
  counter: wrapActionCreators(actionCreators.counter, dispatch),
  sum: wrapActionCreators(actionCreators.sum, dispatch)
}
*/


test('fluxFactory', function (t) {
  t.plan(6)

  var flux1 = fluxFactory(stores, {})
  var flux2 = fluxFactory(stores, {})
  
  t.notEqual(flux1, flux2, 'is a factory (no singletons)')
  t.ok(typeof flux1.dispatch === 'function', 'has `dispatch` method')
  t.ok(typeof flux1.getDispatcher === 'function', 'has `getDispatcher` method')
  t.ok(typeof flux1.getState === 'function', 'has `getState` method')
  t.ok(typeof flux1.subscribe === 'function', 'has `subscribe` method')
  t.throws(fluxFactory, 'should throw if missing first argument')
})

test('flux instance dispatcher', function (t) {
  t.plan(5)

  var flux = fluxFactory(stores, {})
  var dispatch = flux.getDispatcher()
  var actions = {
    counter: wrapActionCreators(actionCreators.counter, dispatch),
    sum: wrapActionCreators(actionCreators.sum, dispatch)
  }

  actions.counter.increment()
  t.equal(flux.getState().counter, 1, 'dispatches via wrapped action creators (1)')

  actions.counter.decrement()
  t.equal(flux.getState().counter, 0, 'dispatches via wrapped action creators (2)')

  actionCreators.counter.increment(dispatch) 
  t.equal(flux.getState().counter, 1, 'dispatches via action creators')

  flux.dispatch({ type: MANUAL })
  t.equal(flux.getState().beep, 'boop', 'dispatches manually')

  actions.sum.sum(10)
  t.deepEqual(flux.getState(), {
    counter: 1,
    beep: 'boop',
    sum: 10
  }, 'handles the state tree props correctly')
})

test('flux instance subscribe method', function (t) {
  t.plan(6)

  var flux = fluxFactory(stores, {})

  var off1 = flux.subscribe(function (action) { t.pass('fires listener (1) ' + action.type) })
  var off2 = flux.subscribe(function (action) { t.pass('fires listener (2) ' + action.type) })
  var off3 = flux.subscribe(function (action) { t.pass('fires listener (3) ' + action.type) })

  t.ok(typeof off1 === 'function', 'returns ´unsubscribe´ function')

  flux.dispatch({ type: 'A' }) // 3 passes
  off2()
  flux.dispatch({ type: 'B' }) // 2 passes (listener 2 is off)
  off1()
  off3()
  flux.dispatch({ type: 'C' }) // nothing
})
