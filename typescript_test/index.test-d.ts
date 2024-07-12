/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Action, AnyAction } from 'redux'
import { applyMiddleware, bindActionCreators, createStore } from 'redux'
import type {
  ThunkAction,
  ThunkActionDispatch,
  ThunkDispatch,
  ThunkMiddleware
} from 'redux-thunk'
import { thunk, withExtraArgument } from 'redux-thunk'

describe('type tests', () => {
  type State = {
    foo: string
  }

  type Actions = { type: 'FOO' } | { type: 'BAR'; result: number }

  type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>

  const initialState: State = {
    foo: 'foo'
  }

  function fakeReducer(state: State = initialState): State {
    return state
  }

  const store = createStore(
    fakeReducer,
    applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
  )

  function anotherThunkAction(): ThunkResult<string> {
    return (dispatch, getState) => {
      expectTypeOf(dispatch).toBeCallableWith({ type: 'FOO' })

      return 'hello'
    }
  }

  test('store.dispatch', () => {
    store.dispatch(dispatch => {
      expectTypeOf(dispatch).toBeCallableWith({ type: 'FOO' })

      expectTypeOf(dispatch).parameter(0).not.toMatchTypeOf({ type: 'BAR' })

      expectTypeOf(dispatch).parameter(1).not.toMatchTypeOf(42)

      expectTypeOf(dispatch).toBeCallableWith({ type: 'BAR', result: 5 })

      // expectTypeOf(store.dispatch).toBeCallableWith({ type: 'BAZ' }) does not work in this case
      store.dispatch({ type: 'BAZ' })
    })
  })

  test('getState', () => {
    const thunk: () => ThunkResult<void> = () => (dispatch, getState) => {
      const state = getState()

      expectTypeOf(state).toHaveProperty('foo')

      expectTypeOf(dispatch).toBeCallableWith({ type: 'FOO' })

      expectTypeOf(dispatch).parameter(0).not.toMatchTypeOf({ type: 'BAR' })

      expectTypeOf(dispatch).toBeCallableWith({ type: 'BAR', result: 5 })

      expectTypeOf(dispatch).parameter(0).not.toMatchTypeOf({ type: 'BAZ' })

      // Can dispatch another thunk action
      expectTypeOf(dispatch).toBeCallableWith(anotherThunkAction())
    }

    expectTypeOf(store.dispatch).toBeCallableWith(thunk())

    expectTypeOf(store.dispatch).toBeCallableWith({ type: 'FOO' })

    expectTypeOf(store.dispatch).parameter(0).not.toMatchTypeOf({ type: 'BAR' })

    expectTypeOf(store.dispatch).toBeCallableWith({ type: 'BAR', result: 5 })

    expectTypeOf(store.dispatch).parameter(0).not.toMatchTypeOf({ type: 'BAZ' })
  })

  test('issue #248: Need a union overload to handle generic dispatched types', () => {
    // https://github.com/reduxjs/redux-thunk/issues/248

    const dispatch: ThunkDispatch<any, unknown, AnyAction> = undefined as any

    function dispatchWrap(
      action: Action | ThunkAction<any, any, unknown, AnyAction>
    ) {
      // Should not have an error here thanks to the extra union overload
      expectTypeOf(dispatch).toBeCallableWith(action)
    }
  })

  test('store thunk arg', () => {
    const storeThunkArg = createStore(
      fakeReducer,
      applyMiddleware(
        withExtraArgument('bar') as ThunkMiddleware<State, Actions, string>
      )
    )

    expectTypeOf(storeThunkArg.dispatch).toBeCallableWith({ type: 'FOO' })

    storeThunkArg.dispatch((dispatch, getState, extraArg) => {
      expectTypeOf(extraArg).toBeString()

      expectTypeOf(store.dispatch).toBeCallableWith({ type: 'FOO' })

      // expectTypeOf(store.dispatch).toBeCallableWith({ type: 'BAR' }) does not work in this case
      store.dispatch({ type: 'BAR' })

      expectTypeOf(store.dispatch).toBeCallableWith({ type: 'BAR', result: 5 })

      // expectTypeOf(store.dispatch).toBeCallableWith({ type: 'BAZ' }) does not work in this case
      store.dispatch({ type: 'BAZ' })
    })
  })

  test('call dispatch async with any action', () => {})
  const callDispatchAsync_anyAction = (
    dispatch: ThunkDispatch<State, undefined, any>
  ) => {
    const asyncThunk = (): ThunkResult<Promise<void>> => () =>
      ({} as Promise<void>)

    expectTypeOf(dispatch).toBeCallableWith(asyncThunk())
  }

  test('call dispatch async with specific actions', () => {
    const callDispatchAsync_specificActions = (
      dispatch: ThunkDispatch<State, undefined, Actions>
    ) => {
      const asyncThunk = (): ThunkResult<Promise<void>> => () =>
        ({} as Promise<void>)

      expectTypeOf(dispatch).toBeCallableWith(asyncThunk())
    }
  })

  test('call dispatch any', () => {
    const callDispatchAny = (
      dispatch: ThunkDispatch<State, undefined, Actions>
    ) => {
      const asyncThunk = (): any => () => ({} as Promise<void>)

      dispatch(asyncThunk()) // result is any
        .then(() => console.log('done'))
    }
  })

  test('thunk actions', () => {
    function promiseThunkAction(): ThunkResult<Promise<boolean>> {
      return async (dispatch, getState) => {
        expectTypeOf(dispatch).toBeCallableWith({ type: 'FOO' })

        return false
      }
    }

    const standardAction = () => ({ type: 'FOO' })

    interface ActionDispatches {
      anotherThunkAction: ThunkActionDispatch<typeof anotherThunkAction>
      promiseThunkAction: ThunkActionDispatch<typeof promiseThunkAction>
      standardAction: typeof standardAction
    }

    // Without a global module overload, this should fail
    // @ts-expect-error
    const actions: ActionDispatches = bindActionCreators(
      {
        anotherThunkAction,
        promiseThunkAction,
        standardAction
      },
      store.dispatch
    )

    expectTypeOf(actions.anotherThunkAction()).toBeString()

    expectTypeOf(actions.anotherThunkAction()).not.toBeBoolean()

    expectTypeOf(actions.promiseThunkAction()).resolves.toBeBoolean()

    expectTypeOf(actions.promiseThunkAction()).not.toHaveProperty('prop')

    expectTypeOf(actions.standardAction()).toHaveProperty('type').toBeString()

    expectTypeOf(actions.standardAction()).not.toHaveProperty('other')

    const untypedStore = createStore(fakeReducer, applyMiddleware(thunk))

    expectTypeOf(untypedStore.dispatch).toBeCallableWith(anotherThunkAction())

    expectTypeOf(untypedStore.dispatch).toBeCallableWith(promiseThunkAction())
  })
})
