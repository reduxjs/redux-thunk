import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkAction } from '../index';

type State = {
  foo: string;
};

type Actions = { type: 'FOO' };

function fakeReducer(state: State, action: Actions): State {
  return state;
}

const store = createStore(fakeReducer, applyMiddleware(thunk));

store.dispatch(dispatch => {
  dispatch({ type: 'FOO' });
});

function testGetState(): ThunkAction<void, State, {}, Actions> {
  return (dispatch, getState) => {
    const state = getState();
    const foo: string = state.foo;
  };
}

store.dispatch(testGetState());

const storeThunkArg = createStore(
  fakeReducer,
  applyMiddleware(thunk.withExtraArgument('bar'))
);

storeThunkArg.dispatch((dispatch, getState, extraArg) => {
  const bar: string = extraArg;
  console.log(extraArg);
});

const thunkAction: ThunkAction<void, State, { bar: number }, Actions> = (
  dispatch,
  getState,
  extraArg
) => {
  const foo: string = getState().foo;
  const bar: number = extraArg.bar;

  dispatch({ type: 'FOO' });
};

const thunkActionDispatchOnly: ThunkAction<void, {}, {}, Actions> = dispatch => {
  dispatch({ type: 'FOO' });
};
