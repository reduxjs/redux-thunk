import {Store, Middleware} from 'redux';
import thunk from '../index.d.ts';


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
