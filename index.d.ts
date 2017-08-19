import {Middleware, Dispatch, Action} from "redux";


export type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S,
                                    extraArgument: E) => R;

declare module "redux" {
  export interface Dispatch<S> {
    <R, E, A extends Action>(asyncAction: ThunkAction<R, S, E> | A): R;
  }
}

declare const thunk: Middleware & {
  withExtraArgument(extraArgument: any): Middleware;
};

export default thunk;
