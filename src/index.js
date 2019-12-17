function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    
    if (typeof action === 'function') {

      if (typeof extraArgument === 'function') {
        return action(dispatch, getState, extraArgument(dispatch, getState));
      }

      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
