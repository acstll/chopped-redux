# Chopped Redux

A very small Flux implementation based on [@gaearon](https://github.com/gaearon) [Redux](https://github.com/gaearon/redux), mainly inspired by [this](https://github.com/gaearon/redux/pull/166) and [this](https://github.com/gaearon/redux/issues/113#issuecomment-114049804).

I recommend you try out [Redux](https://github.com/gaearon/redux) and go through its Github issues as it's a great source of knowledge and inspiration.

The idea here is to provide a minimal, solid Flux base without the [React](http://facebook.github.io/react/index.html) glue (you have to do that yourself).

This project follows [SemVer](http://semver.org/). 1.0 doesn't mean it's stable or production-ready.

## Install

With [`npm`](http://npmjs.org) do:

```bash
npm install chopped-redux --save
```

## API

- Factory: fluxFactory
  - dispatch
  - getDispatcher
  - getState
  - subscribe
- wrapActionCreators

#### Factory: fluxFactory(reducer[, initialState])

- *reducer* `Function|Object` These are your stores
- *initialState* `Mixed` Anything you want to hold your state in
- Returns `Object` A `flux` instance

The `reducer` function should have this signature: 

```js
function (state, action) { 
  // do something with state depending on the action type,
  // ideally generating a fresh new value
  return state
}
```

What happens internally on every action dispatch is basically this:

```js
state = reducer(state, action)
```

If you pass an object with reducer functions, a new function will be created which will map the reduced state of every function to a key on the root state object. Like this:

```js
// Your stores
{
  foo: [Function],
  bar: [Function],
  baz: [Function]
}

// The root state inside the `flux` instance
{
  foo: {...} // the reduced state from `stores.foo`
  bar: {...} // the reduced state from `stores.bar`
  baz: {...} // the reduced state from `stores.baz`
}

// And you could access those like this
flux.getState().foo
```

#### flux.dispatch(action)

- *action* `Object`

#### flux.getDispatcher()

- Returns the `dispatch` function bound to the `flux` instance. Literally this: `return this.dispatch.bind(this)`

#### flux.getState()

- Returns `Object` Your state

#### flux.subscribe(listener)

- *listener* `Function` A callback that gets fired after every state update
- Returns `Function` A function to remove the listener

---

#### fluxFactory.wrapActionCreators(actionCreators, dispatch)

- *actionsCreators* `Object` Your action creators in an object
- *dispatch* `Function` The dispatch function to bind to your action creators. You can get this from `flux.getDispatcher()`
- Returns `Object` Your action creators bound to the dispatcher

This is a helper function, so instead of writing this:

```js
var actionsCreators = {
  exampleAction: function (foo) {
    return {
      type: constants.EXAMPLE_TYPE,
      value: foo
    }
  }
}

flux.dispatch(actionCreators.exampleAction('bar'))
```

you can do this:

```js
var actionsCreators = {
  exampleAction: function (foo, dispatch) {
    return dispatch({
      type: constants.EXAMPLE_TYPE,
      value: foo
    })
  }
}

var wrap = fluxFactory.wrapActionCreators
var actions = wrap(actionCreators, flux.getDispatcher())

actions.exampleAction('bar') // dispatches!
```

and have the action automatically dispatched.

## Example

### Stores

Stores are pure functions, just like in Redux. They don't hold the state and don't emit events either (that's why in Redux they're called Reducers; I prefer to keep calling them Stores). They just receive the state, update it, and return the new state.

```js
var actionTypes = require('../constants/action-types')

var initialState = 0

module.exports = function (state, action) {
  state = state || initialState

  switch (action.type) {
    case actionTypes.INCREMENT_COUNTER:
      return state + 1
      break

    case actionTypes.DECREMENT_COUNTER:
      return state - 1
      break

    default:
      return state
  }
}
```

### Actions

Action creators are functions that yield an action object (or *payload* in vanilla Flux terminology). They can simply return that object, or if you need to do async operations, you can pass in a dispatch callback and fire it passing in the action object. If the latter is the case, always pass the `dispatch` function as the last argument, so you can use the utility wrapper function (`wrapActionCreators`).

Further reading: [The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31).

```js

var actionTypes = require('../constants/action-types')

exports.increment = function (dispatch) {
  return dispatch({
    type: actionTypes.INCREMENT_COUNTER
  })
}

exports.decrement = function (dispatch) {
  return dispatch({
    type: actionTypes.DECREMENT_COUNTER
  })
}
```

### Constants (for action types)

Yep.

```js
module.exports = {
  INCREMENT_COUNTER: 'INCREMENT_COUNTER',
  DECREMENT_COUNTER: 'DECREMENT_COUNTER',
}
```

### Make it work together

```js
var fluxFactory = require('chopped-redux')
var wrap = fluxFactory.wrapActionCreators

// Define stores and action creators
var stores = {
  counter: require('./stores/counter')
}
var actionCreators = {
  counter: require('./actions/counter')
}

// Create a flux instance passing in the stores and initial state
var flux = fluxFactory(stores, { counter: 1 })

// Bind action creators to the dispatcher
var actions = wrap(actionCreators, flux.getDispatcher())

// Subscribe a callback to state updates
var unsubscribe = flux.subscribe(function () {
  console.log(flux.getState())  
})

// Trigger an action: this dispatches the action,
// the state tree in the flux instance goes through the store function(s),
// and listener callbacks fire
actions.increment()
// => { counter: 2 }

unsubscribe()
```

## License

MIT
