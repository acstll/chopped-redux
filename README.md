# Chopped Redux

[badges here]

This library is a subset of [@gaearon](https://github.com/gaearon) [Redux](https://github.com/gaearon/redux), which claims to be a "Predictable state container for JavaScript apps".

Redux is based on [Facebook's Flux](https://facebook.github.io/flux/) but it's a lot more simple a straightforward. Chopped Redux follows the same principles and ideas but cutting off features. If you care, it's 30 sloc (0.75 kB).

This project follows [SemVer](http://semver.org/).

## Motivation

In the beginning, Redux was a [React](http://facebook.github.io/react/) thing. So I wanted to have a similar library not tight to any rendering/view-layer library, and I was mainly inspired by [this](https://github.com/gaearon/redux/pull/166) and [this](https://github.com/gaearon/redux/issues/113#issuecomment-114049804), ideas which made the Flux unidirectional data-flow very simple. Redux is [free from React](https://github.com/gaearon/redux/issues/230) starting at 1.0. Still Chopped is a simpler alternative to it (though Redux is itself very small and simple). The things you'll miss from Redux here are basically `Middleware`, ES2015/7 magic and restrictions. Hot-reloading and time-travel are possible if you know what you're doing, or **why** you're doing it, but it's **not built-in**.

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

[code here]

Guidelines for success:

- All state of your app goes into `state`, a single object
- The `reducer` function is **pure** (it should *only* update and return new `state` and nothing else)
- `actions` are plain objects with at least two properties `type` (String) and `payload` (Mixed)
- You do async inside helper functions [(action dispatchers)](#async-and-action-creators) that call `dispatch` when done

## API

```js
var chopped = require('chopped-redux')
```

Chopped Redux exports a single factory function that returns an object with four methods:

  - `dispatch`
  - `getState`
  - `subscribe`
  - `replaceState`

The factory has a single mandatory param which is a `reducer` function.

#### `chopped(reducer[, initialState, listeners])``

- *reducer* `Function`
- *initialState* `Mixed` Anything you want to hold your state in
- *listeners* `Array` Listener callbacks that subscribe to dispatches

The `reducer` function should have the following signature:

```js
function (state, action) {
  // do something with state depending on the action type,
  // ideally generating a fresh new (immutable) value
  return state
}
```

What happens internally on every action dispatch is basically this:

```js
state = reducer(state, action)
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

#### `replaceState(state)`

- Returns `undefined`
- *state* `Mixed` Whatever your state is

This will replace the current state reference in your `store` instance. This could be used for debugging, time-travel, etc. Beware you need to call `dispatch` after replacing the state if you want your views to update or whatever.

---

### Helpers

#### `wrap(methods, dispatch)`

Available at `require('chopped-redux/wrap')`.

This is a highly opinionated helper that binds your action dispatchers (aka action creators) to a `store.dispatch` instance, by currying them.

This functions are meant to have this signature `function (dispatch, payload) {}`. See [Async and action creators](#async-and-action-creators) below.

- Returns `Object` The same methods wrapping the dispatcher
- *methods* `Object` An object with your action dispatcher functions
- *dispatch* `Function` The `dispatch` method from your `store` instance

---

## Async and action creators

There's this concept of Action Creators in vanilla Flux… if you need to do async, delegate `dispatch`ing actions to your helper functions; if not, simply `dispatch` the action directly. [more here]
Avoid arguments apart from `dispatch` and `payload` (no more ugly `ActionCreators.addTodo(text)`).

## Further reading

https://gist.github.com/vslinko/cab24085f029def8997b by @vslinko  
[The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31)

## License

MIT
