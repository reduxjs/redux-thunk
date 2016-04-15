import { isFSA } from 'flux-standard-action';

function isFunction(val) {
  return val && typeof val === 'function';
}

export default function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (!isFSA(action)) {
      return isFunction(action)
        ? action(dispatch, getState)
        : next(action);
    }

    return isFunction(action.payload)
      ? action.payload(dispatch, getState)
      : next(action);
  };
}
