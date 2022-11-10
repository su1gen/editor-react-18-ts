"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _toolbar = require("./toolbar");

var _keymaps = _interopRequireDefault(require("./pm-plugins/keymaps"));

var _ideUx = _interopRequireDefault(require("./pm-plugins/ide-ux"));

var _codeBlockCopySelectionPlugin = require("./pm-plugins/codeBlockCopySelectionPlugin");

var _analytics = require("../analytics");

var _assets = require("../quick-insert/assets");

var _messages = require("../block-type/messages");

var _refreshBrowserSelection = _interopRequireDefault(require("./refresh-browser-selection"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var codeBlockPlugin = function codeBlockPlugin(options) {
  return {
    name: 'codeBlock',
    nodes: function nodes() {
      return [{
        name: 'codeBlock',
        node: _adfSchema.codeBlock
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'codeBlock',
        plugin: function plugin(_ref) {
          var getIntl = _ref.getIntl;
          return (0, _main.createPlugin)(_objectSpread(_objectSpread({}, options), {}, {
            getIntl: getIntl,
            appearance: options.appearance
          }));
        }
      }, {
        name: 'codeBlockIDEKeyBindings',
        plugin: function plugin() {
          return _ideUx.default;
        }
      }, {
        name: 'codeBlockKeyMap',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema;
          return (0, _keymaps.default)(schema);
        }
      }, {
        name: 'codeBlockCopySelection',
        plugin: function plugin() {
          return (0, _codeBlockCopySelectionPlugin.codeBlockCopySelectionPlugin)();
        }
      }];
    },
    // Workaround for a firefox issue where dom selection is off sync
    // https://product-fabric.atlassian.net/browse/ED-12442
    onEditorViewStateUpdated: function onEditorViewStateUpdated(props) {
      (0, _refreshBrowserSelection.default)(props.originalTransaction, props.newEditorState);
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'codeblock',
          title: formatMessage(_messages.messages.codeblock),
          description: formatMessage(_messages.messages.codeblockDescription),
          keywords: ['code block'],
          priority: 700,
          keyshortcut: '```',
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconCode, null);
          },
          action: function action(insert, state) {
            var schema = state.schema;
            var tr = insert(schema.nodes.codeBlock.createChecked());
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.CODE_BLOCK,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.TRACK
            });
          }
        }];
      },
      floatingToolbar: (0, _toolbar.getToolbarConfig)(options.allowCopyToClipboard)
    }
  };
};

var _default = codeBlockPlugin;
exports.default = _default;