"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _main.pluginKey;
  }
});

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _inputRule = _interopRequireDefault(require("./pm-plugins/input-rule"));

var _ToolbarBlockType = _interopRequireDefault(require("./ui/ToolbarBlockType"));

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _commands = require("./commands");

var _analytics = require("../analytics");

var keymaps = _interopRequireWildcard(require("../../keymaps"));

var _assets = require("../quick-insert/assets");

var _messages = require("./messages");

var _types = require("../../ui/Toolbar/types");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var headingPluginOptions = function headingPluginOptions(_ref, isAllowed) {
  var formatMessage = _ref.formatMessage;

  if (!isAllowed) {
    return [];
  }

  return Array.from({
    length: 6
  }, function (_v, idx) {
    var level = idx + 1;

    var descriptionDescriptor = _messages.messages["heading".concat(level, "Description")];

    var keyshortcut = keymaps.tooltip(keymaps["toggleHeading".concat(level)]);
    var id = "heading".concat(level);
    return {
      id: id,
      title: formatMessage(_messages.messages[id]),
      description: formatMessage(descriptionDescriptor),
      priority: 1300,
      keywords: ["h".concat(level)],
      keyshortcut: keyshortcut,
      icon: function icon() {
        return /*#__PURE__*/_react.default.createElement(_assets.IconHeading, {
          level: level
        });
      },
      action: function action(insert, state) {
        var tr = insert(state.schema.nodes.heading.createChecked({
          level: level
        }));
        return (0, _analytics.addAnalytics)(state, tr, {
          action: _analytics.ACTION.FORMATTED,
          actionSubject: _analytics.ACTION_SUBJECT.TEXT,
          eventType: _analytics.EVENT_TYPE.TRACK,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_HEADING,
          attributes: {
            inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT,
            newHeadingLevel: level
          }
        });
      }
    };
  });
};

var blockquotePluginOptions = function blockquotePluginOptions(_ref2, isAllowed) {
  var formatMessage = _ref2.formatMessage;

  if (!isAllowed) {
    return [];
  }

  return [{
    id: 'blockquote',
    title: formatMessage(_messages.messages.blockquote),
    description: formatMessage(_messages.messages.blockquoteDescription),
    priority: 1300,
    keyshortcut: keymaps.tooltip(keymaps.toggleBlockQuote),
    icon: function icon() {
      return /*#__PURE__*/_react.default.createElement(_assets.IconQuote, null);
    },
    action: function action(insert, state) {
      var tr = insert(state.schema.nodes.blockquote.createChecked({}, state.schema.nodes.paragraph.createChecked()));
      return (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.FORMATTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        eventType: _analytics.EVENT_TYPE.TRACK,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
        }
      });
    }
  }];
};

var blockTypePlugin = function blockTypePlugin(options) {
  return {
    name: 'blockType',
    nodes: function nodes() {
      var nodes = [{
        name: 'heading',
        node: _adfSchema.heading
      }, {
        name: 'blockquote',
        node: _adfSchema.blockquote
      }, {
        name: 'hardBreak',
        node: _adfSchema.hardBreak
      }];

      if (options && options.allowBlockType) {
        var exclude = options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
        return nodes.filter(function (node) {
          return exclude.indexOf(node.name) === -1;
        });
      }

      return nodes;
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'blockType',
        plugin: function plugin(_ref3) {
          var dispatch = _ref3.dispatch;
          return (0, _main.createPlugin)(dispatch, options && options.lastNodeMustBeParagraph);
        }
      }, {
        name: 'blockTypeInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return (0, _inputRule.default)(schema, featureFlags);
        }
      }, // Needs to be lower priority than editor-tables.tableEditing
      // plugin as it is currently swallowing right/down arrow events inside tables
      {
        name: 'blockTypeKeyMap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema,
              featureFlags = _ref5.featureFlags;
          return (0, _keymap.default)(schema, featureFlags);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          popupsMountPoint = _ref6.popupsMountPoint,
          popupsBoundariesElement = _ref6.popupsBoundariesElement,
          popupsScrollableElement = _ref6.popupsScrollableElement,
          toolbarSize = _ref6.toolbarSize,
          disabled = _ref6.disabled,
          isToolbarReducedSpacing = _ref6.isToolbarReducedSpacing,
          eventDispatcher = _ref6.eventDispatcher;
      var isSmall = options && options.isUndoRedoButtonsEnabled ? toolbarSize < _types.ToolbarSize.XXL : toolbarSize < _types.ToolbarSize.XL;

      var boundSetBlockType = function boundSetBlockType(name) {
        return (0, _commands.setBlockTypeWithAnalytics)(name, _analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
      };

      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        plugins: {
          pluginState: _main.pluginKey
        },
        render: function render(_ref7) {
          var pluginState = _ref7.pluginState;
          return /*#__PURE__*/_react.default.createElement(_ToolbarBlockType.default, {
            isSmall: isSmall,
            isDisabled: disabled,
            isReducedSpacing: isToolbarReducedSpacing,
            setBlockType: boundSetBlockType,
            pluginState: pluginState,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(intl) {
        var exclude = options && options.allowBlockType && options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
        return [].concat((0, _toConsumableArray2.default)(blockquotePluginOptions(intl, exclude.indexOf('blockquote') === -1)), (0, _toConsumableArray2.default)(headingPluginOptions(intl, exclude.indexOf('heading') === -1)));
      }
    }
  };
};

var _default = blockTypePlugin;
exports.default = _default;