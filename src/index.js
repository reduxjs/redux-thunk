export default function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      var returnValue = action(dispatch, getState);
      if (returnValue !== undefined) {
        return next(returnValue);
      }
    }
    else {
      return next(action);
    }
  }
}
