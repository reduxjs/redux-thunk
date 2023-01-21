/* eslint-disable @typescript-eslint/no-unused-vars */
import { applyMiddleware, bindActionCreators, createStore } from 'redux'
import type { Action, AnyAction } from 'redux'

import { thunk } from '../src/index'
import type {
  ThunkAction,
  ThunkActionDispatch,
  ThunkDispatch,
  ThunkMiddleware
} from '../src/index'

export type State = {
  foo: string
}

export type Actions = { type: 'FOO' } | { type: 'BAR'; result: number }

export type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>

export const initialState: State = {
  foo: 'foo'
}

export function fakeReducer(state: State = initialState): State {
  return state
}

export const store = createStore(
  fakeReducer,
  applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
)

store.dispatch(dispatch => {
  dispatch({ type: 'FOO' })
  // @ts-expect-error
  dispatch({ type: 'BAR' }, 42)
  dispatch({ type: 'BAR', result: 5 })
  store.dispatch({ type: 'BAZ' })
})

function testGetState(): ThunkResult<void> {
  return (dispatch, getState) => {
    const state = getState()
    const { foo } = state
    dispatch({ type: 'FOO' })
    // @ts-expect-error
    dispatch({ type: 'BAR' })
    dispatch({ type: 'BAR', result: 5 })
    // @ts-expect-error
    dispatch({ type: 'BAZ' })
    // Can dispatch another thunk action
    dispatch(anotherThunkAction())
  }
}

export function anotherThunkAction(): ThunkResult<string> {
  return (dispatch, getState) => {
    dispatch({ type: 'FOO' })
    return 'hello'
  }
}

store.dispatch({ type: 'FOO' })
store.dispatch({ type: 'BAR' })
store.dispatch({ type: 'BAR', result: 5 })
store.dispatch({ type: 'BAZ' })
store.dispatch(testGetState())

const storeThunkArg = createStore(
  fakeReducer,
  applyMiddleware(
    thunk.withExtraArgument('bar') as ThunkMiddleware<State, Actions, string>
  )
)
storeThunkArg.dispatch({ type: 'FOO' })

storeThunkArg.dispatch((dispatch, getState, extraArg) => {
  const bar: string = extraArg
  store.dispatch({ type: 'FOO' })
  store.dispatch({ type: 'BAR' })
  store.dispatch({ type: 'BAR', result: 5 })
  store.dispatch({ type: 'BAZ' })
  console.log(extraArg)
})

const callDispatchAsync_anyAction = (
  dispatch: ThunkDispatch<State, undefined, any>
) => {
  const asyncThunk = (): ThunkResult<Promise<void>> => () =>
    ({} as Promise<void>)
  dispatch(asyncThunk()).then(() => console.log('done'))
}
const callDispatchAsync_specificActions = (
  dispatch: ThunkDispatch<State, undefined, Actions>
) => {
  const asyncThunk = (): ThunkResult<Promise<void>> => () =>
    ({} as Promise<void>)
  dispatch(asyncThunk()).then(() => console.log('done'))
}
const callDispatchAny = (
  dispatch: ThunkDispatch<State, undefined, Actions>
) => {
  const asyncThunk = (): any => () => ({} as Promise<void>)
  dispatch(asyncThunk()) // result is any
    .then(() => console.log('done'))
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

// Without a global module overload, this should fail
// @ts-expect-error
const actions: ActionDispatchs = bindActionCreators(
  {
    anotherThunkAction,
    promiseThunkAction,
    standardAction
  },
  store.dispatch
)

actions.anotherThunkAction() === 'hello'
// @ts-expect-error
actions.anotherThunkAction() === false
actions.promiseThunkAction().then(res => console.log(res))
// @ts-expect-error
actions.promiseThunkAction().prop
actions.standardAction().type
// @ts-expect-error
actions.standardAction().other

const untypedStore = createStore(fakeReducer, applyMiddleware(thunk))

// @ts-expect-error
untypedStore.dispatch(anotherThunkAction())
// @ts-expect-error
untypedStore.dispatch(promiseThunkAction()).then(() => Promise.resolve())

// #248: Need a union overload to handle generic dispatched types
function testIssue248() {
  const dispatch: ThunkDispatch<any, unknown, AnyAction> = undefined as any

  function dispatchWrap(
    action: Action | ThunkAction<any, any, unknown, AnyAction>
  ) {
    // Should not have an error here thanks to the extra union overload
    dispatch(action)
  }
}
