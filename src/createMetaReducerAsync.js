import createReducerAsync, { defaultsState } from './createReducerAsync';

export default function createMetaReducerAsync(actionAsync, defaultState = defaultsState) {
  const reducer = createReducerAsync(actionAsync, defaultsState);

  return function(state = {}, action) {
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
