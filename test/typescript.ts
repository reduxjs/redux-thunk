import {
  applyMiddleware,
  bindActionCreators,
  createStore,
} from 'redux';

import thunk, {
  ThunkAction,
  ThunkActionDispatch,
  ThunkDispatch,
  ThunkMiddleware,
} from '../index';

type State = {
  foo: string;
};

type Actions = { type: 'FOO' } | { type: 'BAR', result: number };

type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>;

const initialState: State = {
  foo: 'foo'
};

function fakeReducer(state: State = initialState, action: Actions): State {
  return state;
}

const store = createStore(fakeReducer, applyMiddleware(thunk as ThunkMiddleware<State, Actions>));

store.dispatch(dispatch => {
  dispatch({ type: 'FOO' });
  // typings:expect-error
  dispatch({ type: 'BAR' })
  dispatch({ type: 'BAR', result: 5 })
  // typings:expect-error
  store.dispatch({ type: 'BAZ'});
});

function testGetState(): ThunkResult<void> {
  return (dispatch, getState) => {
    const state = getState();
    const foo: string = state.foo;
    dispatch({ type: 'FOO' });
    // typings:expect-error
    dispatch({ type: 'BAR'});
    dispatch({ type: 'BAR', result: 5 });
    // typings:expect-error
    dispatch({ type: 'BAZ'});
    // Can dispatch another thunk action
    dispatch(anotherThunkAction());
  };
}

function anotherThunkAction(): ThunkResult<string> {
  return (dispatch, getState) => {
    dispatch({ type: 'FOO' });
    return 'hello';
  }
}

function promiseThunkAction(): ThunkResult<Promise<boolean>> {
  return async (dispatch, getState) => {
    dispatch({ type: 'FOO' });
    return false;
  }
}

const standardAction = () => ({ type: 'FOO' });

interface ActionDispatchs {
  anotherThunkAction: ThunkActionDispatch<typeof anotherThunkAction>;
  promiseThunkAction: ThunkActionDispatch<typeof promiseThunkAction>;
  standardAction: typeof standardAction;
}

// test that bindActionCreators correctly returns actions responses of ThunkActions
// also ensure standard action creators still work as expected
const actions: ActionDispatchs = bindActionCreators({
  anotherThunkAction,
  promiseThunkAction,
  standardAction,
}, store.dispatch);



actions.anotherThunkAction() === 'hello';
// typings:expect-error
actions.anotherThunkAction() === false;
actions.promiseThunkAction().then((res) => console.log(res));
// typings:expect-error
actions.promiseThunkAction().prop;
actions.standardAction().type;
// typings:expect-error
actions.standardAction().other;


store.dispatch({ type: 'FOO' });
// typings:expect-error
store.dispatch({ type: 'BAR' })
store.dispatch({ type: 'BAR', result: 5 })
// typings:expect-error
store.dispatch({ type: 'BAZ'});
store.dispatch(testGetState());

const storeThunkArg = createStore(
  fakeReducer,
  applyMiddleware(thunk.withExtraArgument('bar') as ThunkMiddleware<State, Actions, string>)
);

storeThunkArg.dispatch((dispatch, getState, extraArg) => {
  const bar: string = extraArg;
  store.dispatch({ type: 'FOO' });
  // typings:expect-error
  store.dispatch({ type: 'BAR' })
  store.dispatch({ type: 'BAR', result: 5 })
  // typings:expect-error
  store.dispatch({ type: 'BAZ'});
  console.log(extraArg);
});

const callDispatchAsync_anyAction = (dispatch: ThunkDispatch<State, undefined, any>) => {
  const asyncThunk = (): ThunkResult<Promise<void>> => () => ({} as Promise<void>);
  dispatch(asyncThunk()).then(() => console.log('done'))
}
const callDispatchAsync_specificActions = (dispatch: ThunkDispatch<State, undefined, Actions>) => {
  const asyncThunk = (): ThunkResult<Promise<void>> => () => ({} as Promise<void>);
  dispatch(asyncThunk()).then(() => console.log('done'))
}
const callDispatchAny = (dispatch: ThunkDispatch<State, undefined, Actions>) => {
  const asyncThunk = (): any => () => ({} as Promise<void>);
  dispatch(asyncThunk()) // result is any
    .then(() => console.log('done'))
}
