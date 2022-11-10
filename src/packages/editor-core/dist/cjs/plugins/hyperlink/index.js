"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _inputRule = require("./pm-plugins/input-rule");

var _keymap = require("./pm-plugins/keymap");

var _main = require("./pm-plugins/main");

var _fakeCursorForToolbar = _interopRequireDefault(require("./pm-plugins/fake-cursor-for-toolbar"));

var _analytics = require("../analytics");

var _Toolbar = require("./Toolbar");

var _keymaps = require("../../keymaps");

var _assets = require("../quick-insert/assets");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var hyperlinkPlugin = function hyperlinkPlugin(options) {
  return {
    name: 'hyperlink',
    marks: function marks() {
      return [{
        name: 'link',
        mark: _adfSchema.link
      }];
    },
    pmPlugins: function pmPlugins() {
      var _options$cardOptions;

      // Skip analytics if card provider is available, as they will be
      // sent on handleRejected upon attempting to resolve smart link.
      var skipAnalytics = !!(options !== null && options !== void 0 && (_options$cardOptions = options.cardOptions) !== null && _options$cardOptions !== void 0 && _options$cardOptions.provider);
      return [{
        name: 'hyperlink',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _main.plugin)(dispatch);
        }
      }, {
        name: 'fakeCursorToolbarPlugin',
        plugin: function plugin() {
          return _fakeCursorForToolbar.default;
        }
      }, {
        name: 'hyperlinkInputRule',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              featureFlags = _ref2.featureFlags;
          return (0, _inputRule.createInputRulePlugin)(schema, skipAnalytics, featureFlags);
        }
      }, {
        name: 'hyperlinkKeymap',
        plugin: function plugin() {
          return (0, _keymap.createKeymapPlugin)(skipAnalytics);
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'hyperlink',
          title: formatMessage(_messages.messages.link),
          description: formatMessage(_messages.messages.linkDescription),
          keywords: ['hyperlink', 'url'],
          priority: 1200,
          keyshortcut: (0, _keymaps.tooltip)(_keymaps.addLink),
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconLink, null);
          },
          action: function action(insert, state) {
            var tr = insert(undefined);
            tr.setMeta(_main.stateKey, {
              type: _main.LinkAction.SHOW_INSERT_TOOLBAR
            });
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INVOKED,
              actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      },
      floatingToolbar: (0, _Toolbar.getToolbarConfig)(options)
    }
  };
};

var _default = hyperlinkPlugin;
exports.default = _default;