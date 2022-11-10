"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _inputRules = _interopRequireDefault(require("./pm-plugins/input-rules"));

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _messages = require("./messages");

var _analytics = require("../analytics");

var _keymaps = require("../../keymaps");

var _assets = require("../quick-insert/assets");

var listPlugin = function listPlugin() {
  return {
    name: 'list',
    nodes: function nodes() {
      return [{
        name: 'bulletList',
        node: _adfSchema.bulletList
      }, {
        name: 'orderedList',
        node: _adfSchema.orderedList
      }, {
        name: 'listItem',
        node: _adfSchema.listItem
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'list',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _main.createPlugin)(dispatch);
        }
      }, {
        name: 'listInputRule',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              featureFlags = _ref2.featureFlags;
          return (0, _inputRules.default)(schema, featureFlags);
        }
      }, {
        name: 'listKeymap',
        plugin: function plugin() {
          return (0, _keymap.default)();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'unorderedList',
          title: formatMessage(_messages.messages.unorderedList),
          description: formatMessage(_messages.messages.unorderedListDescription),
          keywords: ['ul', 'unordered'],
          priority: 1100,
          keyshortcut: (0, _keymaps.tooltip)(_keymaps.toggleBulletList),
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconList, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.bulletList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.LIST,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
              eventType: _analytics.EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              }
            });
          }
        }, {
          id: 'orderedList',
          title: formatMessage(_messages.messages.orderedList),
          description: formatMessage(_messages.messages.orderedListDescription),
          keywords: ['ol', 'ordered'],
          priority: 1200,
          keyshortcut: (0, _keymaps.tooltip)(_keymaps.toggleOrderedList),
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconListNumber, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.orderedList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.LIST,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
              eventType: _analytics.EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              }
            });
          }
        }];
      }
    }
  };
};

var _default = listPlugin;
exports.default = _default;