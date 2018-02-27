import { Middleware, Dispatch, Action, AnyAction } from "redux";


export type ThunkAction<R, S = {}, E = {}, A extends Action<any> = AnyAction> = (
  dispatch: Dispatch<A>,
  getState: () => S,
  extraArgument: E
) => R;

declare module "redux" {
  export interface Dispatch<A extends Action<any> = AnyAction> {
    <R, E>(asyncAction: ThunkAction<R, {}, E, A>): R;
  }
}

declare const thunk: Middleware & {
  withExtraArgument(extraArgument: any): Middleware;
};

export default thunk;
