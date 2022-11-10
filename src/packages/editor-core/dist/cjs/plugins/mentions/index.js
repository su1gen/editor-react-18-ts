"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "mentionPluginKey", {
  enumerable: true,
  get: function get() {
    return _key.mentionPluginKey;
  }
});

var _react = _interopRequireDefault(require("react"));

var _uuid = _interopRequireDefault(require("uuid"));

var _resource = require("@atlaskit/mention/resource");

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _utils = require("../type-ahead/utils");

var _ToolbarMention = _interopRequireDefault(require("./ui/ToolbarMention"));

var _analytics = require("../analytics");

var _assets = require("../quick-insert/assets");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _openTypeaheadAtCursor = require("../type-ahead/transforms/open-typeahead-at-cursor");

var _typeAhead = require("./type-ahead");

var _key = require("./pm-plugins/key");

var _main = require("./pm-plugins/main");

var mentionsPlugin = function mentionsPlugin(options) {
  var sessionId = (0, _uuid.default)();

  var fireEvent = function fireEvent(payload) {
    if (!(options !== null && options !== void 0 && options.createAnalyticsEvent)) {
      return;
    }

    var createAnalyticsEvent = options.createAnalyticsEvent;

    if (payload.attributes && !payload.attributes.sessionId) {
      payload.attributes.sessionId = sessionId;
    }

    createAnalyticsEvent(payload).fire(_resource.ELEMENTS_CHANNEL);
  };

  var typeAhead = (0, _typeAhead.createTypeAheadConfig)({
    sanitizePrivateContent: options === null || options === void 0 ? void 0 : options.sanitizePrivateContent,
    mentionInsertDisplayName: options === null || options === void 0 ? void 0 : options.insertDisplayName,
    HighlightComponent: options === null || options === void 0 ? void 0 : options.HighlightComponent,
    fireEvent: fireEvent
  });
  return {
    name: 'mention',
    nodes: function nodes() {
      return [{
        name: 'mention',
        node: _adfSchema.mention
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'mention',
        plugin: function plugin(pmPluginFactoryParams) {
          return (0, _main.createMentionPlugin)(pmPluginFactoryParams, fireEvent, options);
        }
      }];
    },
    secondaryToolbarComponent: function secondaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          disabled = _ref.disabled;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        editorView: editorView,
        plugins: {
          mentionState: _key.mentionPluginKey
        },
        render: function render(_ref2) {
          var _ref2$mentionState = _ref2.mentionState,
              mentionState = _ref2$mentionState === void 0 ? {} : _ref2$mentionState;
          return !mentionState.mentionProvider ? null : /*#__PURE__*/_react.default.createElement(_ToolbarMention.default, {
            editorView: editorView,
            isDisabled: disabled || (0, _utils.isTypeAheadAllowed)(editorView.state)
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'mention',
          title: formatMessage(_messages.messages.mention),
          description: formatMessage(_messages.messages.mentionDescription),
          keywords: ['team', 'user'],
          priority: 400,
          keyshortcut: '@',
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconMention, null);
          },
          action: function action(insert, state) {
            var tr = insert(undefined);
            (0, _openTypeaheadAtCursor.openTypeAheadAtCursor)({
              triggerHandler: typeAhead,
              inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
            })(tr);
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INVOKED,
              actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      },
      typeAhead: typeAhead
    }
  };
};

var _default = mentionsPlugin;
exports.default = _default;