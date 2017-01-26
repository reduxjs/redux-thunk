function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => function current(action) {
    if (action && typeof action.then === 'function') {
      return action.then(current);
    }

    if (typeof action === 'function') {
      return current(action(dispatch, getState, extraArgument));
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
