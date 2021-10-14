function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => typeof action === 'function' ? action(dispatch, getState, extraArgument) : next(action);
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
