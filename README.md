redux-thunk
=============

Thunk [middleware](https://github.com/gaearon/redux/blob/master/docs/middleware.md) for Redux.

```js
npm install --save redux-thunk
```

## What's a thunk?!

A thunk is a function that wraps an expression to delay its evaluation.

```js
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2;

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2;
```

## Usage

`redux-thunk` [middleware](https://github.com/gaearon/redux/blob/master/docs/middleware.md) allows you to write action creators that return a thunk instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The thunk receives the store methods `dispatch` and `getState()` as parameters.

An action creator that returns a thunk to perform asynchronous dispatch:

```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
```

An action creator that returns a thunk to perform conditional dispatch:

```js
function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
```

To enable redux-thunk use `applyMiddleware()`:

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers/index';

const reducer = combineReducers(reducers);

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer);
```
## Run tests
```js
npm test
```
## License

MIT
