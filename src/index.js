const defaultMiddleware = {
  onDispatch: dispatch => dispatch,
  onGetState: getState => getState,
  onExtraArgument: () => undefined,
};

function createThunkMiddleware(middleare) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      const { onDispatch, onGetState, onExtraArgument } = Object.assign({}, defaultMiddleware, middleare);
      return action(onDispatch(dispatch), onGetState(getState), onExtraArgument());
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withMiddleware = createThunkMiddleware;
thunk.withExtraArgument = extraArg => createThunkMiddleware({
  onExtraArgument: () => extraArg,
});

export default thunk;
