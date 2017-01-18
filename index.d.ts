import {Middleware, Dispatch} from "redux";


export type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S,
                                    extraArgument: E) => R;

declare module "redux" {
  export interface Dispatch<S> {
    <R, E>(asyncAction: ThunkAction<R, S, E>): R;
  }
}

type StateInjectors = {
    [key: string]: (getState: () => any) => any;
}

declare const thunk: Middleware & {
  withExtraArgument(extraArgument: any, stateInjectors?: StateInjectors): Middleware;
};

export default thunk;
