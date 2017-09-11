import { Action, Middleware, Dispatch as ReduxDispatch, Store as ReduxStore } from "redux";

export interface Dispatch<S> extends ReduxDispatch<S> {
    <R, E>(asyncAction: ThunkAction<R, S, E>): R;
}

export interface Store<S> extends ReduxStore<S> {
    dispatch: Dispatch<S>;
}

export type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S,
                                extraArgument: E) => R;

declare const thunk: Middleware & {
    withExtraArgument(extraArgument: any): Middleware;
};

export default thunk;
