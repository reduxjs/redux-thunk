import {
  Action,
  ActionCreatorsMapObject,
  AnyAction,
  Dispatch,
  Middleware
} from "redux";

/**
 * The dispatch method as modified by React-Thunk; overloaded so that you can
 * dispatch:
 *   - standard (object) actions: `dispatch()` returns the action itself
 *   - thunk actions: `dispatch()` returns the thunk's return value
 *
 * @template TState The redux state
 * @template TExtraThunkArg The extra argument passed to the inner function of
 * thunks (if specified when setting up the Thunk middleware)
 * @template TBasicAction The (non-thunk) actions that can be dispatched.
 */
export interface ThunkDispatch<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action
> {
  <TReturnType>(
    thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>
  ): TReturnType;
  <A extends TBasicAction>(action: A): A;
}

/**
 * A "thunk" action (a callback function that can be dispatched to the Redux
 * store.)
 *
 * Also known as the "thunk inner function", when used with the typical pattern
 * of an action creator function that returns a thunk action.
 *
 * @template TReturnType The return type of the thunk's inner function
 * @template TState The redux state
 * @template TExtraThunkARg Optional extra argument passed to the inner function
 * (if specified when setting up the Thunk middleware)
 * @template TBasicAction The (non-thunk) actions that can be dispatched.
 */
export type ThunkAction<
  TReturnType,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action
> = (
  dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
  getState: () => TState,
  extraArgument: TExtraThunkArg
) => TReturnType;

/**
 * A generic type that takes a thunk action creator and returns a function
 * signature which matches how it would appear after being processed using
 * bindActionCreators(): a function that takes the arguments of the outer
 * function, and returns the return type of the inner "thunk" function.
 *
 * @template TActionCreator Thunk action creator to be wrapped
 */
export type ThunkActionDispatch<
  TActionCreator extends (...args: any[]) => ThunkAction<any, any, any, any>
> = (
  ...args: Parameters<TActionCreator>
) => ReturnType<ReturnType<TActionCreator>>;

/**
 * @template TState The redux state
 * @template TBasicAction The (non-thunk) actions that can be dispatched
 * @template TExtraThunkArg An optional extra argument to pass to a thunk's
 * inner function. (Only used if you call `thunk.withExtraArgument()`)
 */
export type ThunkMiddleware<
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkARg = undefined
> = Middleware<
  ThunkDispatch<TState, TExtraThunkARg, TBasicAction>,
  TState,
  ThunkDispatch<TState, TExtraThunkARg, TBasicAction>
>;

declare const thunk: ThunkMiddleware & {
  withExtraArgument<TExtraThunkArg>(
    extraArgument: TExtraThunkArg
  ): ThunkMiddleware<{}, AnyAction, TExtraThunkArg>;
};

export default thunk;

/**
 * Redux behaviour changed by middleware, so overloads here
 */
declare module "redux" {
  /**
   * Overload for bindActionCreators redux function, returns expects responses
   * from thunk actions
   */
  function bindActionCreators<
    TActionCreators extends ActionCreatorsMapObject<any>
  >(
    actionCreators: TActionCreators,
    dispatch: Dispatch
  ): {
    [TActionCreatorName in keyof TActionCreators]: ReturnType<
      TActionCreators[TActionCreatorName]
    > extends ThunkAction<any, any, any, any>
      ? (
          ...args: Parameters<TActionCreators[TActionCreatorName]>
        ) => ReturnType<ReturnType<TActionCreators[TActionCreatorName]>>
      : TActionCreators[TActionCreatorName]
  };
}
