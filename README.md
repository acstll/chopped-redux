# Chopped Redux

![npm version](https://img.shields.io/npm/v/chopped-redux.svg)

This library is an implementation of [@gaearon](https://github.com/gaearon) [Redux](https://github.com/gaearon/redux), which claims to be a "Predictable state container for JavaScript apps".

Redux is based on [Facebook's Flux](https://facebook.github.io/flux/) but it's a lot more simple a straightforward. Chopped Redux follows the same principles and ideas but cutting off features, namely all utility methods and ES2015/7 magic. Chopped is practically the same as Redux's 1.0 core, just [read the source](https://github.com/acstll/chopped-redux/blob/master/index.js).

This project follows [SemVer](http://semver.org/).

## Motivation

In the beginning, Redux was a [React](http://facebook.github.io/react/) thing. So I wanted to have a similar library not tight to any rendering/view-layer library, and I was mainly inspired by [this](https://github.com/gaearon/redux/pull/166) and [this](https://github.com/gaearon/redux/issues/113#issuecomment-114049804), ideas which made the Flux unidirectional data-flow very simple. Redux is [free from React](https://github.com/gaearon/redux/issues/230) and free from `class`es starting at 1.0, so there's no reason for you to use Chopped instead of the genuine Redux if you don't find any of the key differences useful to you.

### Key differences from Redux

- There’s no init `@@redux/INIT` dispatch on `createStore()`, you need to do that yourself when you know it’s time to initialize your state.
- You can pass anything to `dispatch()`, not only a plain object, it's your responsibility to handle that in the `update` function.
- You can call `dispatch()` with no arguments (an empty object will get dispatched), useful for initializing.
- The dispatched `action` gets passed to listeners.
- The `reducer` function is called `update` (this is just aesthetics).

## Install

With [`npm`](http://npmjs.org) do:

```bash
npm install chopped-redux --save
```

## Usage

This is how it works:

- You `dispatch` an `action`
- The `state` gets updated based on that `action`
- All `listeners` get notified of the `state` change

```js
var createStore = require('chopped-redux')

function update (state, action) {
  state = state || 0 // always initialize state if empty

  if (action.type === 'increment') {
    return state + 1
  }

  return state // always return state
}

var store = createStore(update)
var action = { type: 'increment' } // actions are objects

store.subscribe(function () {
  console.log(store.getState())
})

store.dispatch(action)
// => 1
```

Guidelines for success:

- All state of your app goes into `state`, a single object
- The `update` function is **pure** (it should *only* update and return new `state` and nothing else)
- The `update` function always return some initial state if undefined.
- `actions` are plain objects with at least one property: `type` (String), and an optional `payload` (Mixed).
- You do async inside functions [(action dispatchers)](#async-and-action-creators) that call `dispatch` when done

## API

```js
var createStore = require('chopped-redux')
```

Chopped Redux exports a single factory function that returns an object with four methods:

  - `dispatch`
  - `getState`
  - `subscribe`

The factory has a single mandatory param which is a `update` function.

#### `createStore(update[, initialState])`

- *update* `Function`
- *initialState* `Mixed` Anything you want to hold your state in

The `update` function should have the following signature:

```js
function (state, action) {
  // do something with state depending on the action type,
  // ideally generating a fresh new (immutable) value
  return state
}
```

What happens internally on every action dispatch is basically this:

```js
state = update(state, action)
```

---

#### `dispatch(action)`

- Returns `undefined`
- *action* `Object`

#### `getState()`

- Returns `Object` The current state

#### `subscribe(listener)`

- Returns `Function` A function to remove the listener
- *listener* `Function` A callback that gets fired after every state update

## Old replaceState

In previous versions (<=4.0.0) there was a `replaceState` method, this was a shortcut for an action that can be easily achieved in a pure Redux manner: By dispatching a `REPLACE_STATE`-typed action and swapping the new state in the `update` function.

## Async and action creators

Handling async stuff in vanilla Flux is a pain. In the beginning of Flux we were making API calls inside our Stores, that turned out to be a bad idea. So they came up with this pompous concept of Action Creators to confuse us all (at least for a while). [If you’re still confused, Action Creators are functions that return Actions, which are simply objects; so Action == plain object; Action Creator == function that creates an Action object.] Apparently no-one knows how to do this right.

In Redux there’s middleware. The [thunk](https://github.com/gaearon/redux-thunk) middleware allows you to literally dispatch a function, and your Action Creators look like this:

```js
function foo (bar) {
  // do async stuff

  return function (dispatch) {
    dispatch({
      type: FOO,
      bar: bar
    })
  }
}

// after binding it and what not, call it

foo()

```

I prefer a simpler and more explicit approach based only on the necessity of delaying the dispatch, namely this:

```js
function foo (dispatch, payload) {
  // do async stuff

  dispatch({
    type: FOO, 
    payload: payload
  })
}

foo(store.dispatch, { foo: ‘bar’ })
```

a function in which the `dispatch` callback always gets passed-in as first argument. You could also pass in the very `store` instance if you need to `getState()`.

I would call this an *action dispatcher* function, because that’s what it does. There’s no nesting, no type checking, no complexity. You just pass in a callback for dispatching an action with some payload. You’re just delegating `dispatch`ing actions to a helper function to do some things before the dispatch.

If you don’t need async, simply `dispatch` the action directly and you’ve got one less function to care about.

```js
store.dispatch({ type: FOO, payload: payload })
```

If you want to be consistent, go always the async way no matter what.

No more `ActionCreators.addTodo(text)`.

## Further reading

A [gist](https://gist.github.com/vslinko/cab24085f029def8997b) by [@vslinko](http://github.com/vslinko)    
[The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31)

## License

MIT
