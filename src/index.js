export default function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      const result = action(dispatch, getState);
      return (result) ? next(result) : undefined;
    } else {
      return next(action);
    }
}
