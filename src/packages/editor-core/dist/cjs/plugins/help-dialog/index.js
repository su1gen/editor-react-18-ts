"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorKeymap = require("prosemirror-keymap");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var keymaps = _interopRequireWildcard(require("../../keymaps"));

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _HelpDialogLoader = require("./ui/HelpDialogLoader");

var _quickInsert = require("../quick-insert");

var _analytics = require("../../plugins/analytics");

var _questionCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/question-circle"));

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _commands = require("./commands");

var _pluginKey = require("./plugin-key");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function createPlugin(dispatch, imageEnabled) {
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey,
    state: {
      init: function init() {
        return {
          isVisible: false,
          imageEnabled: imageEnabled
        };
      },
      apply: function apply(tr, _value, state) {
        var isVisible = tr.getMeta(_pluginKey.pluginKey);

        var currentState = _pluginKey.pluginKey.getState(state);

        if (isVisible !== undefined && isVisible !== currentState.isVisible) {
          var newState = _objectSpread(_objectSpread({}, currentState), {}, {
            isVisible: isVisible
          });

          dispatch(_pluginKey.pluginKey, newState);
          return newState;
        }

        return currentState;
      }
    }
  });
}

var helpDialog = function helpDialog(legacyImageUploadProvider) {
  return {
    name: 'helpDialog',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'helpDialog',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, !!legacyImageUploadProvider);
        }
      }, {
        name: 'helpDialogKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'helpdialog',
          title: formatMessage(_messages.messages.help),
          description: formatMessage(_messages.messages.helpDescription),
          keywords: ['?'],
          priority: 4000,
          keyshortcut: (0, keymaps.tooltip)(keymaps.openHelp),
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_questionCircle.default, {
              label: ""
            });
          },
          action: function action(insert, state) {
            var tr = insert('');
            (0, _commands.openHelpCommand)(tr);
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.HELP_OPENED,
              actionSubject: _analytics.ACTION_SUBJECT.HELP,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      }
    },
    contentComponent: function contentComponent(_ref3) {
      var editorView = _ref3.editorView;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          helpDialog: _pluginKey.pluginKey,
          quickInsert: _quickInsert.pluginKey
        },
        render: function render(_ref4) {
          var _ref4$helpDialog = _ref4.helpDialog,
              helpDialog = _ref4$helpDialog === void 0 ? {} : _ref4$helpDialog,
              quickInsert = _ref4.quickInsert;
          return /*#__PURE__*/_react.default.createElement(_HelpDialogLoader.HelpDialogLoader, {
            editorView: editorView,
            isVisible: helpDialog.isVisible,
            quickInsertEnabled: !!quickInsert,
            imageEnabled: helpDialog.imageEnabled
          });
        }
      });
    }
  };
};

var keymapPlugin = function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.openHelp.common, function (state, dispatch) {
    var tr = state.tr;
    var isVisible = tr.getMeta(_pluginKey.pluginKey);

    if (!isVisible) {
      tr = (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.CLICKED,
        actionSubject: _analytics.ACTION_SUBJECT.BUTTON,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.BUTTON_HELP,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.SHORTCUT
        },
        eventType: _analytics.EVENT_TYPE.UI
      });
      (0, _commands.openHelpCommand)(tr, dispatch);
    }

    return true;
  }, list);
  return (0, _prosemirrorKeymap.keymap)(list);
};

var _default = helpDialog;
exports.default = _default;