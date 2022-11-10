"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.isExpandInsertionEnabled = isExpandInsertionEnabled;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginFactory.pluginKey;
  }
});

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _keymap = require("./pm-plugins/keymap");

var _assets = require("../quick-insert/assets");

var _analytics = require("../analytics");

var _toolbar = require("./toolbar");

var _commands = require("./commands");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _pluginFactory = require("./pm-plugins/plugin-factory");

var expandPlugin = function expandPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'expand',
    nodes: function nodes() {
      return [{
        name: 'expand',
        node: _adfSchema.expand
      }, {
        name: 'nestedExpand',
        node: _adfSchema.nestedExpand
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'expand',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              getIntl = _ref.getIntl;
          return (0, _main.createPlugin)(dispatch, getIntl, options.appearance, options.useLongPressSelection);
        }
      }, {
        name: 'expandKeymap',
        plugin: _keymap.expandKeymap
      }];
    },
    pluginsOptions: {
      floatingToolbar: _toolbar.getToolbarConfig,
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;

        if (options && options.allowInsertion !== true) {
          return [];
        }

        return [{
          id: 'expand',
          title: formatMessage(_messages.messages.expand),
          description: formatMessage(_messages.messages.expandDescription),
          keywords: ['accordion', 'collapse'],
          priority: 600,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconExpand, null);
          },
          action: function action(insert, state) {
            var node = (0, _commands.createExpandNode)(state);
            var tr = insert(node);
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: node.type === state.schema.nodes.nestedExpand ? _analytics.ACTION_SUBJECT_ID.NESTED_EXPAND : _analytics.ACTION_SUBJECT_ID.EXPAND,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.TRACK
            });
          }
        }];
      }
    }
  };
};

var _default = expandPlugin;
exports.default = _default;

function isExpandInsertionEnabled(_ref3) {
  var allowExpand = _ref3.allowExpand;

  if (allowExpand && (0, _typeof2.default)(allowExpand) === 'object') {
    return !!allowExpand.allowInsertion;
  }

  return false;
}