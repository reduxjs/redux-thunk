function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // Flux standard actions
    if (typeof action === 'object' && typeof action.payload === 'function') {
      return action.payload(dispatch, getState, extraArgument);
    }
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
