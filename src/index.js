function createThunkMiddleware(extraArgument, stateInjectors) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(
        dispatch,
        getState,
        withStateInjected(extraArgument, stateInjectors, getState)
      );
    }

    return next(action);
  };
}

function withStateInjected(extraArgument = {}, stateInjectors, getState) {
  if (stateInjectors === undefined) {
    return extraArgument;
  }

  const stateInjected = {};

  for (const key in stateInjectors) {
    if (stateInjectors.hasOwnProperty(key)) {
      stateInjected[key] = stateInjectors[key](getState);
    }
  }

  return Object.assign({}, extraArgument, stateInjected);
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
