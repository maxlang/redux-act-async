'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.default = createMetaReducerAsync;

var _createReducerAsync = require('./createReducerAsync');

var _createReducerAsync2 = _interopRequireDefault(_createReducerAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMetaReducerAsync(actionAsync) {
    var defaultState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _createReducerAsync.defaultsState;

    var reducer = (0, _createReducerAsync2.default)(asyncAction, _createReducerAsync.defaultsState);

    return function (state, action) {
        switch (action.type) {
            case actionAsync.request:
            case actionAsync.ok:
            case actionAsync.error:
            case actionAsync.reset:
                return (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, action.meta, reducer(state, action)));
                break;
            default:
                return state;
        }
    };
}