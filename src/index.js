function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    } else if (action && action.thunk && typeof action.thunk === 'function') {
      return action.thunk(dispatch, getState);
    } else {
      return next(action);
    }
  }
}

module.exports = thunkMiddleware
