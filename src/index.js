export default function thunkMiddleware({ dispatch, getState }) {
  return next => action =>
    typeof action === 'function' ?
      next(action(dispatch, getState)) :
      next(action);
}
