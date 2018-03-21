'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ASYNC_META = undefined;
exports.default = createActionAsync;

var _reduxAct = require('redux-act');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ASYNC_META = exports.ASYNC_META = {
  REQUEST: "REQUEST",
  OK: "OK",
  ERROR: "ERROR",
  RESET: "RESET"
};

var defaultOption = {
  keyFn: null,
  noRethrow: false,
  request: {
    metaReducer: function metaReducer() {
      var _ref;

      return _ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref];
    }
  },
  ok: {
    metaReducer: function metaReducer() {
      var _ref2;

      return _ref2 = arguments.length - 1, arguments.length <= _ref2 ? undefined : arguments[_ref2];
    }
  },
  error: {
    metaReducer: function metaReducer() {
      var _ref3;

      return _ref3 = arguments.length - 1, arguments.length <= _ref3 ? undefined : arguments[_ref3];
    }
  },
  reset: {
    metaReducer: function metaReducer() {
      var _ref4;

      return _ref4 = arguments.length - 1, arguments.length <= _ref4 ? undefined : arguments[_ref4];
    }
  }
};

function createActionAsync(description, api) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOption;


  options = {
    noRethrow: options.noRethrow !== undefined ? options.noRethrow : defaultOption.noRethrow,
    request: (0, _objectAssign2.default)({}, defaultOption.request, options.request),
    ok: (0, _objectAssign2.default)({}, defaultOption.ok, options.ok),
    error: (0, _objectAssign2.default)({}, defaultOption.error, options.error),
    reset: (0, _objectAssign2.default)({}, defaultOption.reset, options.reset)
  };

  var actions = {
    request: (0, _reduxAct.createAction)(description + '_' + ASYNC_META.REQUEST, options.request.payloadReducer, options.request.metaReducer),
    ok: (0, _reduxAct.createAction)(description + '_' + ASYNC_META.OK, options.ok.payloadReducer, options.ok.metaReducer),
    error: (0, _reduxAct.createAction)(description + '_' + ASYNC_META.ERROR, options.error.payloadReducer, options.error.metaReducer),
    reset: (0, _reduxAct.createAction)(description + '_' + ASYNC_META.RESET, options.reset.payloadReducer, options.reset.metaReducer)
  };

  var actionAsync = function actionAsync() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (dispatch, getState) {
      var _options$request;

      var key = keyFn && keyFn.apply(undefined, args);
      dispatch(actions.request.apply(actions, args.concat([key])));
      if (options.request.callback) (_options$request = options.request).callback.apply(_options$request, [dispatch, getState].concat(args));
      return api.apply(undefined, args.concat([dispatch, getState])).then(function (response) {
        var _options$ok;

        var out = {
          request: args,
          response: response
        };

        dispatch(actions.ok(out, key));
        if (options.ok.callback) (_options$ok = options.ok).callback.apply(_options$ok, [dispatch, getState, response].concat(args));
        return out;
      }).catch(function (error) {
        var _options$error;

        var errorOut = {
          actionAsync: actionAsync,
          request: args,
          error: error
        };
        dispatch(actions.error(errorOut, key));
        if (options.error.callback) (_options$error = options.error).callback.apply(_options$error, [dispatch, getState, errorOut].concat(args));
        if (!options.noRethrow) throw errorOut;
      });
    };
  };

  (0, _objectAssign2.default)(actionAsync, actions);
  actionAsync.options = options;
  return actionAsync;
}