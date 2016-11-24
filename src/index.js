function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    let argument;
    if (typeof extraArgument === 'function') {
      argument = extraArgument(dispatch, getState);
    } else {
      argument = extraArgument;
    }
    if (typeof action === 'function') {
      return action(dispatch, getState, argument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
