import {createAction} from 'redux-act'
import objectAssign from 'object-assign';

export const ASYNC_META = {
  REQUEST: "REQUEST",
  OK: "OK",
  ERROR: "ERROR",
  RESET: "RESET"
}

const defaultOption = {
  keyFn: null,
  noRethrow: false,
  request:{
    metaReducer: (...args) => {
      return args[args.length - 1]
    }
  },
  ok:{
    metaReducer: (...args) => {
      return args[args.length - 1]
    }
  },
  error:{
    metaReducer: (...args) => {
      return args[args.length - 1]
    }
  },
  reset:{
    metaReducer: (...args) => {
      return args[args.length - 1]
    }
  }
}

export default function createActionAsync(description, api, options = defaultOption) {

  options = {
    keyFn: options.keyFn,
    noRethrow: options.noRethrow !== undefined ? options.noRethrow : defaultOption.noRethrow,
    request: objectAssign({}, defaultOption.request, options.request),
    ok: objectAssign({}, defaultOption.ok, options.ok),
    error: objectAssign({}, defaultOption.error, options.error),
    reset: objectAssign({}, defaultOption.reset, options.reset)
  };

  let actions = {
    request: createAction(`${description}_${ASYNC_META.REQUEST}`, options.request.payloadReducer, options.request.metaReducer),
    ok: createAction(`${description}_${ASYNC_META.OK}`, options.ok.payloadReducer, options.ok.metaReducer),
    error: createAction(`${description}_${ASYNC_META.ERROR}`, options.error.payloadReducer, options.error.metaReducer),
    reset: createAction(`${description}_${ASYNC_META.RESET}`, options.reset.payloadReducer, options.reset.metaReducer)
  }

  let actionAsync = (...args) => {
    return (dispatch, getState) => {
      const key = options.keyFn && options.keyFn(...args);
      dispatch(actions.request(...args, key));
      if(options.request.callback) options.request.callback(dispatch, getState, ...args);
      return api(...args, dispatch, getState)
      .then(response => {
        const out = {
            request: args,
            response: response
        }

        dispatch(actions.ok(out, key))
        if(options.ok.callback) options.ok.callback(dispatch, getState, response, ...args);
        return out;
      })
      .catch(error => {
        const errorOut = {
            actionAsync,
            request: args,
            error: error
        }
        dispatch(actions.error(errorOut, key))
        if(options.error.callback) options.error.callback(dispatch, getState, errorOut, ...args);
        if(!options.noRethrow) throw errorOut;
      })
    }
  }

  objectAssign(actionAsync, actions);
  actionAsync.options = options;
  return actionAsync;
}
