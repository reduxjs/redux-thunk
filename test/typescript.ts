import {Store, Middleware} from 'redux';
import thunk, {ThunkAction} from '../index.d.ts';


declare const store: Store<{foo: string}>;

store.dispatch(dispatch => {
  dispatch({type: 'FOO'});
});

store.dispatch((dispatch, getState) => {
  const state = getState();

  const foo: string = state.foo;
});

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
