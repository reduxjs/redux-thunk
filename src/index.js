import { isFSA } from 'flux-standard-action';

function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    const args = [dispatch, getState, extraArgument];
    if (typeof action === 'function') {
      return action(...args);
    } else if (isFSA(action)) {
      return action.payload(...args);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
