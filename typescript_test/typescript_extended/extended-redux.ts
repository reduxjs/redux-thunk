// This file tests behavior of types when we import the additional "extend-redux" module,
// which globally alters the Redux `bindActionCreators` and `Dispatch` types to assume
// that the thunk middleware always exists

import {
  applyMiddleware,
  bindActionCreators,
  createStore,
  Dispatch
} from 'redux'

import { thunk } from '../../src/index'
import type {
  ThunkAction,
  ThunkActionDispatch,
  ThunkDispatch,
  ThunkMiddleware
} from '../../src/index'

// MAGIC: Import a TS file that extends the `redux` module types
// This file must be kept separate from the primary typetest file to keep from
// polluting the type definitions over there
import '../../extend-redux'

export type State = {
  foo: string
}

export type Actions = { type: 'FOO' } | { type: 'BAR'; result: number }

export type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>

export const initialState: State = {
  foo: 'foo'
}

export function fakeReducer(
  state: State = initialState,
  action: Actions
): State {
  return state
}

export const store = createStore(
  fakeReducer,
  applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
)

export function anotherThunkAction(): ThunkResult<string> {
  return (dispatch, getState) => {
    dispatch({ type: 'FOO' })
    return 'hello'
  }
}

function promiseThunkAction(): ThunkResult<Promise<boolean>> {
  return async (dispatch, getState) => {
    dispatch({ type: 'FOO' })
    return false
  }
}

const standardAction = () => ({ type: 'FOO' })

interface ActionDispatchs {
  anotherThunkAction: ThunkActionDispatch<typeof anotherThunkAction>
  promiseThunkAction: ThunkActionDispatch<typeof promiseThunkAction>
  standardAction: typeof standardAction
}

// test that bindActionCreators correctly returns actions responses of ThunkActions
// also ensure standard action creators still work as expected.
// Unlike the main file, this declaration should compile okay because we've imported
// the global module override
const actions: ActionDispatchs = bindActionCreators(
  {
    anotherThunkAction,
    promiseThunkAction,
    standardAction
  },
  store.dispatch
)

const untypedStore = createStore(fakeReducer, applyMiddleware(thunk))

// Similarly, both of these declarations should pass okay as well
untypedStore.dispatch(anotherThunkAction())
untypedStore.dispatch(promiseThunkAction()).then(() => Promise.resolve())
