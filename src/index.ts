import type {
  Action,
  AnyAction,
} from 'redux';

import type {
  ThunkMiddleware
} from './types'

export type {
  ThunkAction,
  ThunkDispatch,
  ThunkActionDispatch,
  ThunkMiddleware
} from './types'

function createThunkMiddleware<
TState = {},
TBasicAction extends Action = AnyAction,
TExtraThunkArg = undefined
>(extraArgument?: TExtraThunkArg) {
  const middleware: ThunkMiddleware<TState, TBasicAction, TExtraThunkArg> = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
  return middleware
}

type CreateThunkMiddleware = typeof createThunkMiddleware

const thunk = createThunkMiddleware()
// @ts-ignore 
thunk.withExtraArgument = createThunkMiddleware;

export default thunk as typeof thunk & ThunkMiddleware & {
  withExtraArgument<
    TExtraThunkArg,
    TState = {},
    TBasicAction extends Action<any> = AnyAction
  >(
    extraArgument: TExtraThunkArg,
  ): ThunkMiddleware<TState, TBasicAction, TExtraThunkArg>;
}
