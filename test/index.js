import chai from 'chai';
import thunkMiddleware from '../src/index';

describe('thunk middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = thunkMiddleware({dispatch: doDispatch, getState: doGetState});

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();

      chai.assert.isFunction(actionHandler);
      chai.assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', done => {
        const actionHandler = nextHandler();

        actionHandler((dispatch, getState) => {
          chai.assert.strictEqual(dispatch, doDispatch);
          chai.assert.strictEqual(getState, doGetState);
          done();
        });
      });

      it('must pass action to next if not a function', done => {
        const actionObj = {};

        const actionHandler = nextHandler(action => {
          chai.assert.strictEqual(actionObj, action);
          done();
        });

        actionHandler(actionObj);
      });
    });
  });

  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        thunkMiddleware();
      } catch(err) {
        done();
      }
    });
  });
});
