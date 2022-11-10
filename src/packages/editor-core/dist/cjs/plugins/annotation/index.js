"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AnnotationUpdateEmitter", {
  enumerable: true,
  get: function get() {
    return _updateProvider.AnnotationUpdateEmitter;
  }
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _reactNodeview = require("../../plugins/base/pm-plugins/react-nodeview");

var _keymap = require("./pm-plugins/keymap");

var _inlineComment = require("./pm-plugins/inline-comment");

var _updateProvider = require("./update-provider");

var _utils = require("./utils");

var _toolbar = require("./toolbar");

var _InlineCommentView = require("./ui/InlineCommentView");

var annotationPlugin = function annotationPlugin(annotationProviders) {
  return {
    name: 'annotation',
    marks: function marks() {
      return [{
        name: 'annotation',
        mark: _adfSchema.annotation
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'annotation',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              portalProviderAPI = _ref.portalProviderAPI,
              eventDispatcher = _ref.eventDispatcher;

          if (annotationProviders) {
            return (0, _inlineComment.inlineCommentPlugin)({
              dispatch: dispatch,
              portalProviderAPI: portalProviderAPI,
              eventDispatcher: eventDispatcher,
              provider: annotationProviders.inlineComment
            });
          }

          return;
        }
      }, {
        name: 'annotationKeymap',
        plugin: function plugin() {
          if (annotationProviders) {
            return (0, _keymap.keymapPlugin)();
          }

          return;
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: function floatingToolbar(state, intl) {
        if (!annotationProviders) {
          return;
        }

        var pluginState = (0, _utils.getPluginState)(state);

        if (pluginState && pluginState.isVisible && !pluginState.bookmark && !pluginState.mouseData.isSelecting) {
          var isToolbarAbove = annotationProviders.inlineComment.isToolbarAbove;
          return (0, _toolbar.buildToolbar)(state, intl, isToolbarAbove);
        }
      }
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent;

      if (!annotationProviders) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          selectionState: _reactNodeview.stateKey,
          inlineCommentState: _utils.inlineCommentPluginKey
        },
        render: function render(_ref3) {
          var inlineCommentState = _ref3.inlineCommentState;

          if (inlineCommentState && !inlineCommentState.isVisible) {
            return null;
          }

          return /*#__PURE__*/_react.default.createElement(_InlineCommentView.InlineCommentView, {
            providers: annotationProviders,
            editorView: editorView,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          });
        }
      });
    }
  };
};

var _default = annotationPlugin;
exports.default = _default;