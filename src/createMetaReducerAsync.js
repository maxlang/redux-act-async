import createReducerAsync, { defaultsState } from './createReducerAsync';

export default function createMetaReducerAsync(actionAsync, defaultState = defaultsState) {
  const reducer = createReducerAsync(actionAsync, defaultsState);

  return function(state = {}, action) {
      switch (action.type) {
          case actionAsync.request.toString():
          case actionAsync.ok.toString():
          case actionAsync.error.toString():
          case actionAsync.reset.toString():
              return {...state, [action.meta]: reducer(state, action)}
          break;
          default:
              return state;
      }
  }
}
