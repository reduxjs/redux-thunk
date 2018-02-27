import {Store, Middleware} from 'redux';
import thunk, {ThunkAction} from '../index';

type State = {
  foo: string
};

type Actions = { type: 'FOO' };

declare const store: Store<State, Actions>;

store.dispatch(dispatch => {
  dispatch({type: 'FOO'});
});

function testGetState(): ThunkAction<void, State, {}, Actions> {
  return (dispatch, getState) => {
    const state = getState();
    const foo: string = state.foo;
  };
}

store.dispatch(testGetState());

const middleware: Middleware = thunk.withExtraArgument('bar');

store.dispatch((dispatch, getState, extraArg) => {
  console.log(extraArg);
});

const thunkAction: ThunkAction<void, {foo: string}, {bar: number}> =
  (dispatch, getState, extraArg) => {
    const foo: string = getState().foo;
    const bar: number = extraArg.bar;

    dispatch({type: 'FOO'});
  };

const thunkActionDispatchOnly: ThunkAction<void, {}, {}> = dispatch => {
  dispatch({type: 'FOO'});
};
