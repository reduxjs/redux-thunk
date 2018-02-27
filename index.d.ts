import { Middleware, Action, AnyAction } from "redux";


export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

interface ThunkDispatch<S, E, A extends Action> {
  <T extends A>(action: T): T;
}

interface ThunkDispatch<S, E, A extends Action> {
  <R>(asyncAction: ThunkAction<R, S, E, A>): R;
}

type ThunkMiddleware<E, S = {}, A extends Action = AnyAction> = Middleware<ThunkDispatch<S, E, A>, S, ThunkDispatch<S, E, A>>;

declare const thunk: ThunkMiddleware<undefined> & {
  withExtraArgument<E>(extraArgument: E): ThunkMiddleware<E>
};

export default thunk;
