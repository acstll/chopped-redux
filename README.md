# Chopped Redux

A very small Flux implementation based on [@gaearon](https://github.com/gaearon) [Redux](https://github.com/gaearon/redux), mainly inspired by [this](https://github.com/gaearon/redux/pull/166) and [this](https://github.com/gaearon/redux/issues/113#issuecomment-114049804).

The idea here is to provide a minimal, solid Flux (à la Redux) base without the [React](http://facebook.github.io/react/index.html) glue (you have to do that yourself), so it's possible to use this library with anything other than React. [Redux](https://github.com/gaearon/redux) allows you to do this too in 1.0, by [splitting itself](https://github.com/gaearon/redux/issues/230).

You should be able to switch from Chopped Redux to Redux and viceversa without changing your flux code (constants, action creators and reducers).

## Bullet points

Chopped main design goal:

- All methods are first-class. You can freely pass them around without the need for `bind`ing.

Why is Flux Redux-style so nice:

- No singletons
- Action creators and reducers (state-less stores) are pure functions
- All state is kept in a single object, and you choose what that is (Immutable, mori, a plain object)
- Plays well with Universal Javascript

The things you'll miss from Redux here:

- Hot reloading
- Middleware
- Built-in time-travel

This project follows [SemVer](http://semver.org/).

## Install

With [`npm`](http://npmjs.org) do:

```bash
npm install chopped-redux --save
```

## API

```js
var factory = require('chopped-redux')
```

Chopped Redux exports a single factory function that returns an object with three main methods:

  - `dispatch`
  - `getState`
  - `subscribe`

and two helpers:

  - `wrap`
  - `replaceState`

I like to call this instance object `flux`, in Redux is called the `store`.

The factory has a single mandatory param which is a `reducer` function.

#### factory(reducer[, initialState, listeners])

- *reducer* `Function`
- *initialState* `Mixed` Anything you want to hold your state in
- *listeners* `Array` Listener callbacks that subscribe to dispatches

The `reducer` function should have the folowwing signature:

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

#### #dispatch(action)

- *action* `Object|Function`

Action creators should mostly return a plain object of the `{ type: DO_STUFF }` kind. If you need to do async stuff, return a function instead. This function receives `dispatch` and `getState` as params, so you can then actually `dispatch` the plain object needed for dispatching.

```js
var asyncActionCreator = function (data) {
  return function (dispatch, getState) {
    // do your async stuff

    dispatch({
      type: STUFF_DONE,
      payload: foo
    })
  }
}
```

#### #getState()

- Returns `Object` The current state

#### #subscribe(listener)

- *listener* `Function` A callback that gets fired after every state update
- Returns `Function` A function to remove the listener

---

#### #wrap(methods)

- *methods* `Object` An object with your action creators methods
- Returns `Object` The same methods wrapping the dispatcher

So insted of doing this:

```js
var increment = function () {
  return { type: INCREMENT }
}

flux.dispatch(increment())
```

you can do this:

```js
var actions = flux.wrap({ increment: increment })

actions.increment()
```

The nice thing about this is that you can provide you view components with this wrapped action creator methods which you can call directly without needing the `flux` instance available.

#### #replaceState(state)

- *state* `Mixed` Whatever your state is

This will replace the current state reference in your `flux` instance. This could be used for debugging, time-travel. For example, you could keep a copy of your `state` object of a specific point in time, and restore it later.

```js
// Copy of current state
var stateCopy = flux.getState()

// Do stuff

// Some time later
flux.replaceState(stateCopy)
```

---

Further reading: [The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31).

## License

MIT
