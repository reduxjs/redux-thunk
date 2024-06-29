import type { Dispatch, Middleware, Action, UnknownAction } from 'redux'

/**
 * The dispatch overload provided by React-Thunk; allows you to dispatch:
 *   - thunk actions: `dispatch()` returns the thunk's return value
 *
 * @template State The redux state
 * @template ExtraThunkArg The extra argument passed to the inner function of
 * thunks (if specified when setting up the Thunk middleware)
 */
export interface ThunkOverload<State, ExtraThunkArg> {
  <ReturnType>(
    thunkAction: ThunkAction<this, State, ExtraThunkArg, ReturnType>
  ): ReturnType
}

/**
 * The dispatch method as modified by React-Thunk; overloaded so that you can
 * dispatch:
 *   - standard (object) actions: `dispatch()` returns the action itself
 *   - thunk actions: `dispatch()` returns the thunk's return value
 *
 * @template State The redux state
 * @template ExtraThunkArg The extra argument passed to the inner function of
 * thunks (if specified when setting up the Thunk middleware)
 * @template BasicAction The (non-thunk) actions that can be dispatched.
 */
export type ThunkDispatch<
  State,
  ExtraThunkArg,
  BasicAction extends Action
> = ThunkOverload<State, ExtraThunkArg> &
  Dispatch<BasicAction> &
  // order matters here, this must be the last overload
  // this supports #248, allowing ThunkDispatch to be given a union type
  // this does *not* apply to the inferred store type.
  // doing so would break any following middleware's ability to match their overloads correctly
  (<ReturnType, Action extends BasicAction>(
    action:
      | Action
      | ThunkAction<
          ThunkDispatch<State, ExtraThunkArg, BasicAction>,
          State,
          ExtraThunkArg,
          BasicAction
        >
  ) => Action | ReturnType)

/**
 * A "thunk" action (a callback function that can be dispatched to the Redux
 * store.)
 *
 * Also known as the "thunk inner function", when used with the typical pattern
 * of an action creator function that returns a thunk action.
 *
 * @template Dispatch The `dispatch` method from the store
 * @template ReturnType The return type of the thunk's inner function
 * @template State The redux state
 * @template ExtraThunkArg Optional extra argument passed to the inner function
 * (if specified when setting up the Thunk middleware)
 */
export type ThunkAction<
  Dispatch extends ThunkOverload<State, ExtraThunkArg>,
  State,
  ExtraThunkArg,
  ReturnType
> = (
  dispatch: Dispatch,
  getState: () => State,
  extraArgument: ExtraThunkArg
) => ReturnType

/**
 * A generic type that takes a thunk action creator and returns a function
 * signature which matches how it would appear after being processed using
 * bindActionCreators(): a function that takes the arguments of the outer
 * function, and returns the return type of the inner "thunk" function.
 *
 * @template ActionCreator Thunk action creator to be wrapped
 */
export type ThunkActionDispatch<
  ActionCreator extends (...args: any[]) => ThunkAction<any, any, any, any>
> = (
  ...args: Parameters<ActionCreator>
) => ReturnType<ReturnType<ActionCreator>>

/**
 * @template State The redux state
 * @template BasicAction The (non-thunk) actions that can be dispatched
 * @template ExtraThunkArg An optional extra argument to pass to a thunk's
 * inner function. (Only used if you call `withExtraArgument()`)
 */
export type ThunkMiddleware<
  State = any,
  BasicAction extends Action = UnknownAction,
  ExtraThunkArg = undefined
> = Middleware<
  ThunkOverload<State, ExtraThunkArg>,
  State,
  ThunkDispatch<State, ExtraThunkArg, BasicAction>
>
