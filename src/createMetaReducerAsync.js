import createReducerAsync, { defaultState } from './createReducerAsync';

export default function createMetaReducerAsync(actionAsync, defaultState = defaultsState) {
  const reducer = createReducerAsync(asyncAction, defaultsState);

  return function(state, action) {
      switch (action.type) {
          case actionAsync.request:
          case actionAsync.ok:
          case actionAsync.error:
          case actionAsync.reset:
              return {...state, [action.meta]: reducer(state, action)}
          break;
          default:
              return state;
      }
  }
}
