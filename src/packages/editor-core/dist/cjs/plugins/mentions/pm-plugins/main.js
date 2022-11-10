"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMentionPlugin = createMentionPlugin;
exports.setContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _resource = require("@atlaskit/mention/resource");

var _getInlineNodeViewProducer = require("../../../nodeviews/getInlineNodeViewProducer");

var _mention = require("../nodeviews/mention");

var _key = require("./key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_CONTEXT: 'SET_CONTEXT'
};

var setProvider = function setProvider(provider) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_key.mentionPluginKey, {
        action: ACTIONS.SET_PROVIDER,
        params: {
          provider: provider
        }
      }));
    }

    return true;
  };
};

var setContext = function setContext(context) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_key.mentionPluginKey, {
        action: ACTIONS.SET_CONTEXT,
        params: {
          context: context
        }
      }));
    }

    return true;
  };
};

exports.setContext = setContext;

function createMentionPlugin(pmPluginFactoryParams, fireEvent, options) {
  var mentionProvider;

  var sendAnalytics = function sendAnalytics(event, actionSubject, action, attributes) {
    if (event === _resource.SLI_EVENT_TYPE || event === _resource.SMART_EVENT_TYPE) {
      fireEvent((0, _resource.buildSliPayload)(actionSubject, action, attributes));
    }
  };

  return new _safePlugin.SafePlugin({
    key: _key.mentionPluginKey,
    state: {
      init: function init() {
        return {};
      },
      apply: function apply(tr, pluginState) {
        var _ref = tr.getMeta(_key.mentionPluginKey) || {
          action: null,
          params: null
        },
            action = _ref.action,
            params = _ref.params;

        var newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
              mentionProvider: params.provider
            });
            pmPluginFactoryParams.dispatch(_key.mentionPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_CONTEXT:
            newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
              contextIdentifierProvider: params.context
            });
            pmPluginFactoryParams.dispatch(_key.mentionPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      }
    },
    props: {
      nodeViews: {
        mention: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _mention.MentionNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory,
            options: options
          }
        })
      }
    },
    view: function view(editorView) {
      var providerHandler = function providerHandler(name, providerPromise) {
        switch (name) {
          case 'mentionProvider':
            if (!providerPromise) {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(function (provider) {
              if (mentionProvider) {
                mentionProvider.unsubscribe('mentionPlugin');
              }

              mentionProvider = provider;
              setProvider(provider)(editorView.state, editorView.dispatch);
              provider.subscribe('mentionPlugin', undefined, undefined, undefined, undefined, sendAnalytics);
            }).catch(function () {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            });
            break;

          case 'contextIdentifierProvider':
            if (!providerPromise) {
              return setContext(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(function (provider) {
              setContext(provider)(editorView.state, editorView.dispatch);
            });
            break;
        }

        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe('mentionProvider', providerHandler);
      pmPluginFactoryParams.providerFactory.subscribe('contextIdentifierProvider', providerHandler);
      return {
        destroy: function destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe('mentionProvider', providerHandler);
            pmPluginFactoryParams.providerFactory.unsubscribe('contextIdentifierProvider', providerHandler);
          }

          if (mentionProvider) {
            mentionProvider.unsubscribe('mentionPlugin');
          }
        }
      };
    }
  });
}