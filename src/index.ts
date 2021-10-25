import type { Action, AnyAction } from 'redux'

import type { ThunkMiddleware } from './types'

export type {
  ThunkAction,
  ThunkDispatch,
  ThunkActionDispatch,
  ThunkMiddleware
} from './types'

function createThunkMiddleware<
  TState = any,
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined
>(extraArgument?: TExtraThunkArg) {
  const middleware: ThunkMiddleware<TState, TBasicAction, TExtraThunkArg> =
    ({ dispatch, getState }) =>
    next =>
    action => {
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument)
      }

      return next(action)
    }
  return middleware
}

const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware

export default thunk as typeof thunk &
  ThunkMiddleware & {
    withExtraArgument<
      TExtraThunkArg,
      TState = any,
      TBasicAction extends Action<any> = AnyAction
    >(
      extraArgument: TExtraThunkArg
    ): ThunkMiddleware<TState, TBasicAction, TExtraThunkArg>
  }
