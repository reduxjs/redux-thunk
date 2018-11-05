import {
  Action,
  ActionCreatorsMapObject,
  AnyAction,
  Dispatch,
  Middleware,
} from 'redux';

export interface ThunkDispatch<S, E, A extends Action> {
  <R>(thunkAction: ThunkAction<R, S, E, A>): R;
  <T extends A>(action: T): T;
}

export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

export type ThunkMiddleware<S = {}, A extends Action = AnyAction, E = undefined> = Middleware<ThunkDispatch<S, E, A>, S, ThunkDispatch<S, E, A>>;

declare const thunk: ThunkMiddleware & {
  withExtraArgument<E>(extraArgument: E): ThunkMiddleware<{}, AnyAction, E>
}

export default thunk;

/**
 * Redux behaviour changed by middleware, so overloads here
 */
declare module 'redux' {
  /**
   * Overload for bindActionCreators redux function, returns expects responses
   * from thunk actions
   */
  function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
    actionCreators: M,
    dispatch: Dispatch,
  ): { [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any> ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>> : M[N] }
}
