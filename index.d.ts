import { Middleware, Action, AnyAction } from "redux";


export type ThunkAction<R, S = {}, E = {}, A extends Action<any> = AnyAction> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

interface ThunkDispatch<S = {}, E = {}, A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}

interface ThunkDispatch<S = {}, E = {}, A extends Action = AnyAction> {
  <R>(asyncAction: ThunkAction<R, S, E, A>): R;
}

type ThunkMiddleware<E, S = {}> = Middleware<ThunkDispatch<S, E>, S, ThunkDispatch<S, E>>;

declare const thunk: ThunkMiddleware<undefined> & {
  withExtraArgument<E>(extraArgument: E): ThunkMiddleware<E>
};

export default thunk;
