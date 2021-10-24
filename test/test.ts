import thunkMiddleware from '../src/index'

describe('thunk middleware', () => {
  const doDispatch = () => {}
  const doGetState = () => 42
  const nextHandler = thunkMiddleware({
    dispatch: doDispatch,
    getState: doGetState
  })

  it('must return a function to handle next', () => {
    expect(nextHandler).toBeInstanceOf(Function)
    expect(nextHandler.length).toBe(1)
  })

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      // @ts-ignore
      const actionHandler = nextHandler()

      expect(actionHandler).toBeInstanceOf(Function)
      expect(actionHandler.length).toBe(1)
    })

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', done => {
        // @ts-ignore
        const actionHandler = nextHandler()

        actionHandler((dispatch: any, getState: any) => {
          expect(dispatch).toBe(doDispatch)
          expect(getState).toBe(doGetState)
          done()
        })
      })

      it('must pass action to next if not a function', done => {
        const actionObj = {}

        // @ts-ignore
        const actionHandler = nextHandler(action => {
          expect(action).toBe(actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must return the return value of next if not a function', () => {
        const expected = 'redux'
        // @ts-ignore
        const actionHandler = nextHandler(() => expected)

        // @ts-ignore
        const outcome = actionHandler()
        expect(outcome).toBe(expected)
      })

      it('must return value as expected if a function', () => {
        const expected = 'rocks'
        // @ts-ignore
        const actionHandler = nextHandler()

        const outcome = actionHandler(() => expected)
        expect(outcome).toBe(expected)
      })

      it('must be invoked synchronously if a function', () => {
        // @ts-ignore
        const actionHandler = nextHandler()
        let mutated = 0

        // eslint-disable-next-line no-plusplus
        actionHandler(() => mutated++)
        expect(mutated).toBe(1)
      })
    })
  })

  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        // @ts-expect-error
        thunkMiddleware()
      } catch (err) {
        done()
      }
    })
  })

  describe('withExtraArgument', () => {
    it('must pass the third argument', done => {
      const extraArg = { lol: true }
      // @ts-ignore
      thunkMiddleware.withExtraArgument(extraArg)({
        dispatch: doDispatch,
        getState: doGetState
      })()((dispatch: any, getState: any, arg: any) => {
        expect(dispatch).toBe(doDispatch)
        expect(getState).toBe(doGetState)
        expect(arg).toBe(extraArg)
        done()
      })
    })
  })
})
