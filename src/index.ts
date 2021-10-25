import type { Action, AnyAction } from 'redux'

import type { ThunkMiddleware } from './types'

export type {
  ThunkAction,
  ThunkDispatch,
  ThunkActionDispatch,
  ThunkMiddleware
} from './types'

/** A function that accepts a potential "extra argument" value to be injected later,
 * and returns an instance of the thunk middleware that uses that value
 */
function createThunkMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(extraArgument?: ExtraThunkArg) {
  // Standard Redux middleware definition pattern:
  // See: https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware
  const middleware: ThunkMiddleware<State, BasicAction, ExtraThunkArg> =
    ({ dispatch, getState }) =>
    next =>
    action => {
      // The thunk middleware looks for any functions that were passed to `store.dispatch`.
      // If this "action" is really a function, call it and return the result.
      if (typeof action === 'function') {
        // Inject the store's `dispatch` and `getState` methods, as well as any "extra arg"
        return action(dispatch, getState, extraArgument)
      }

      // Otherwise, pass the action down the middleware chain as usual
      return next(action)
    }
  return middleware
}

/** The standard thunk middleware, with no extra argument included  */
const thunk = createThunkMiddleware()
// Attach the factory function so users can create a customized version
// with whatever "extra arg" they want to inject into their thunks
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
thunk.withExtraArgument = createThunkMiddleware

// Convince TS that the default export has the right type for `withExtraArgument`
export default thunk as typeof thunk &
  ThunkMiddleware & {
    withExtraArgument<
      ExtraThunkArg,
      State = any,
      BasicAction extends Action<any> = AnyAction
    >(
      extraArgument: ExtraThunkArg
    ): ThunkMiddleware<State, BasicAction, ExtraThunkArg>
  }
