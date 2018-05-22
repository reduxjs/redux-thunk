import { Middleware, Dispatch, AnyAction } from "redux";


export type ThunkAction<R, S, E = any> = (dispatch: Dispatch, getState: () => S,
                                          extraArgument: E) => R;


declare module "redux" {
  export interface Dispatch<A extends Action = AnyAction> {
    <R, S, E>(asyncAction: ThunkAction<R, S, E>): R;
  }
}


declare const thunk: Middleware & {
  withExtraArgument(extraArgument: any): Middleware;
};

export default thunk;
