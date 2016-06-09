import {Middleware} from "redux";


declare module "redux" {
  export interface Dispatch<S> {
    <R>(asyncAction: (dispatch: Dispatch<S>, 
                      getState?: () => S, 
                      extraArgument?: any) => R): R;
  }
}


declare const thunk: Middleware & {
  withExtraArgument(extraArgument: any): Middleware;
};

export default thunk;
