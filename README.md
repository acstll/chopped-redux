# Chopped Redux

A very small Flux implementation based on [@gaearon](https://github.com/gaearon) [Redux](https://github.com/gaearon/redux).

The idea is to provide a minimal, solid base without the React glue (you have to do that yourself). No hot reloading or time travelling (yet?).

## Install

With [`npm`](http://npmjs.org) do:

```bash
npm install chopped-redux --save
```

## Example

### Stores

Stores are pure functions, just like in Redux. They don't hold the state and don't emit events either. They just receive the state, update it, and return the new state.

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

Actions should have the following signature, always receiving a `dispatch` function as last argument. (There's a utility wrapper function to make this easy)

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

var stores = {
  counter: require('./stores/counter'),
  beep: function (state, action) {
    return action.type === SOME_ACTION_TYPE_CONSTANT
      ? 'boop'
      : state || undefined
  }
}

var actionCreators = {
  counter: require('./actions/counter'),
}

var flux = fluxFactory(stores, { counter: 1 })
var actions = wrap(actionCreators, flux.getDispatcher())

var unsubscribe = flux.subscribe(function () {
  console.log(flux.getState())  
})

actions.increment()
// => { counter: 2 }

unsubscribe()
```

## License

MIT
