"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateKey = exports.getContextIdentifier = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var stateKey = new _prosemirrorState.PluginKey('contextIdentiferPlugin');
exports.stateKey = stateKey;

var getContextIdentifier = function getContextIdentifier(state) {
  if (state) {
    var _stateKey$getState;

    return (_stateKey$getState = stateKey.getState(state)) === null || _stateKey$getState === void 0 ? void 0 : _stateKey$getState.contextIdentifierProvider;
  }
};

exports.getContextIdentifier = getContextIdentifier;

var _default = function _default(dispatch, providerFactory) {
  return new _safePlugin.SafePlugin({
    key: stateKey,
    state: {
      init: function init() {
        return {};
      },
      apply: function apply(tr, pluginState) {
        if (tr.getMeta(stateKey)) {
          return tr.getMeta(stateKey);
        }

        return pluginState;
      }
    },
    view: function view(_view) {
      var providerPromiseHandler = function providerPromiseHandler(name, providerPromise) {
        if (providerPromise && name === 'contextIdentifierProvider') {
          providerPromise.then(function (provider) {
            var tr = _view.state.tr.setMeta(stateKey, {
              contextIdentifierProvider: _objectSpread({}, provider)
            });

            _view.dispatch(tr);
          });
        }
      };

      if (providerFactory) {
        providerFactory.subscribe('contextIdentifierProvider', providerPromiseHandler);
      }

      return {
        destroy: function destroy() {
          providerFactory && providerFactory.unsubscribe('contextIdentifierProvider', providerPromiseHandler);
        }
      };
    }
  });
};

exports.default = _default;