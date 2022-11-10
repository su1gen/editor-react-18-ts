import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var stateKey = new PluginKey('contextIdentiferPlugin');
export var getContextIdentifier = function getContextIdentifier(state) {
  if (state) {
    var _stateKey$getState;

    return (_stateKey$getState = stateKey.getState(state)) === null || _stateKey$getState === void 0 ? void 0 : _stateKey$getState.contextIdentifierProvider;
  }
};
export default (function (dispatch, providerFactory) {
  return new SafePlugin({
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
});