"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelIconMap = exports.getToolbarItems = exports.getToolbarConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _success = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/success"));

var _info = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/info"));

var _note = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/note"));

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _warning = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/warning"));

var _error = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/error"));

var _removeEmoji = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove-emoji"));

var _messages = _interopRequireDefault(require("../../messages"));

var _actions = require("./actions");

var _decoration = require("../base/pm-plugins/decoration");

var _panelBackgroundPalette = require("../../ui/ColorPalette/Palettes/panelBackgroundPalette");

var _panel = require("@atlaskit/editor-common/panel");

var _utils = require("./utils");

var _prosemirrorUtils = require("prosemirror-utils");

var _Palettes = require("../../ui/ColorPalette/Palettes");

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../analytics");

var _message = require("./message");

var _panelIconMap;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var panelIconMap = (_panelIconMap = {}, (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.INFO, {
  shortName: ':info:',
  id: 'atlassian-info'
}), (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.NOTE, {
  shortName: ':note:',
  id: 'atlassian-note'
}), (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.WARNING, {
  shortName: ':warning:',
  id: 'atlassian-warning'
}), (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.ERROR, {
  shortName: ':cross_mark:',
  id: 'atlassian-cross_mark'
}), (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.SUCCESS, {
  shortName: ':check_mark:',
  id: 'atlassian-check_mark'
}), (0, _defineProperty2.default)(_panelIconMap, _adfSchema.PanelType.TIP, {
  shortName: ':tip:',
  id: 'atlassian-tip'
}), _panelIconMap);
exports.panelIconMap = panelIconMap;

var getToolbarItems = function getToolbarItems(formatMessage, panelNodeType, isCustomPanelEnabled, isCustomPanelEditable, providerFactory, activePanelType, activePanelColor, activePanelIcon, state) {
  // TODO: ED-14403 investigate why these titles are not getting translated for the tooltips
  var items = [{
    id: 'editor.panel.info',
    type: 'button',
    icon: _info.default,
    onClick: (0, _actions.changePanelType)(_adfSchema.PanelType.INFO),
    selected: activePanelType === _adfSchema.PanelType.INFO,
    title: formatMessage(_message.messages.info),
    tabIndex: null
  }, {
    id: 'editor.panel.note',
    type: 'button',
    icon: _note.default,
    onClick: (0, _actions.changePanelType)(_adfSchema.PanelType.NOTE),
    selected: activePanelType === _adfSchema.PanelType.NOTE,
    title: formatMessage(_message.messages.note),
    tabIndex: null
  }, {
    id: 'editor.panel.success',
    type: 'button',
    icon: _success.default,
    onClick: (0, _actions.changePanelType)(_adfSchema.PanelType.SUCCESS),
    selected: activePanelType === _adfSchema.PanelType.SUCCESS,
    title: formatMessage(_message.messages.success),
    tabIndex: null
  }, {
    id: 'editor.panel.warning',
    type: 'button',
    icon: _warning.default,
    onClick: (0, _actions.changePanelType)(_adfSchema.PanelType.WARNING),
    selected: activePanelType === _adfSchema.PanelType.WARNING,
    title: formatMessage(_message.messages.warning),
    tabIndex: null
  }, {
    id: 'editor.panel.error',
    type: 'button',
    icon: _error.default,
    onClick: (0, _actions.changePanelType)(_adfSchema.PanelType.ERROR),
    selected: activePanelType === _adfSchema.PanelType.ERROR,
    title: formatMessage(_message.messages.error),
    tabIndex: null
  }];

  if (isCustomPanelEnabled) {
    var changeColor = function changeColor(color) {
      return function (state, dispatch) {
        var panelNode = (0, _utils.findPanel)(state);

        if (panelNode === undefined) {
          return false;
        }

        var previousColor = panelNode.node.attrs.panelColor || (0, _panel.getPanelTypeBackground)(panelNode.node.attrs.panelType);
        var emojiInfo = panelNode.node.attrs.panelType;
        var panelEmoji = panelIconMap[emojiInfo];
        var previousEmoji = panelEmoji ? {
          emoji: panelEmoji.shortName,
          emojiId: panelEmoji.id
        } : {};

        if (previousColor === color) {
          (0, _actions.changePanelType)(_adfSchema.PanelType.CUSTOM, _objectSpread({
            color: color
          }, previousEmoji), isCustomPanelEnabled)(state, dispatch);
          return false;
        }

        var payload = {
          action: _analytics.ACTION.CHANGED_BACKGROUND_COLOR,
          actionSubject: _analytics.ACTION_SUBJECT.PANEL,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.PANEL,
          attributes: {
            newColor: color,
            previousColor: previousColor
          },
          eventType: _analytics.EVENT_TYPE.TRACK
        };
        (0, _analytics.withAnalytics)(payload)((0, _actions.changePanelType)(_adfSchema.PanelType.CUSTOM, _objectSpread({
          color: color
        }, previousEmoji), isCustomPanelEnabled))(state, dispatch);
        return false;
      };
    };

    var changeEmoji = function changeEmoji(emoji) {
      return function (state, dispatch) {
        var panelNode = (0, _utils.findPanel)(state);

        if (panelNode === undefined) {
          return false;
        }

        var previousIcon = panelNode.node.attrs.panelIcon || '';

        if (previousIcon === emoji.shortName) {
          (0, _actions.changePanelType)(_adfSchema.PanelType.CUSTOM, {
            emoji: emoji.shortName,
            emojiId: emoji.id,
            emojiText: emoji.fallback
          }, true)(state, dispatch);
          return false;
        }

        var payload = {
          action: _analytics.ACTION.CHANGED_ICON,
          actionSubject: _analytics.ACTION_SUBJECT.PANEL,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.PANEL,
          attributes: {
            newIcon: emoji.shortName,
            previousIcon: previousIcon
          },
          eventType: _analytics.EVENT_TYPE.TRACK
        };
        (0, _analytics.withAnalytics)(payload)((0, _actions.changePanelType)(_adfSchema.PanelType.CUSTOM, {
          emoji: emoji.shortName,
          emojiId: emoji.id,
          emojiText: emoji.fallback
        }, true))(state, dispatch);
        return false;
      };
    };

    var removeEmoji = function removeEmoji() {
      return function (state, dispatch) {
        var panelNode = (0, _utils.findPanel)(state);

        if (activePanelType === _adfSchema.PanelType.CUSTOM && !activePanelIcon) {
          return false;
        }

        if (panelNode === undefined) {
          return false;
        }

        var payload = {
          action: _analytics.ACTION.REMOVE_ICON,
          actionSubject: _analytics.ACTION_SUBJECT.PANEL,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.PANEL,
          attributes: {
            icon: panelNode.node.attrs.panelIcon
          },
          eventType: _analytics.EVENT_TYPE.TRACK
        };
        (0, _analytics.withAnalytics)(payload)((0, _actions.changePanelType)(_adfSchema.PanelType.CUSTOM, {
          emoji: undefined,
          emojiId: undefined,
          emojiText: undefined
        }, isCustomPanelEnabled))(state, dispatch);
        return false;
      };
    };

    var panelColor = activePanelType === _adfSchema.PanelType.CUSTOM ? activePanelColor || (0, _panel.getPanelTypeBackground)(_adfSchema.PanelType.INFO) : (0, _panel.getPanelTypeBackground)(activePanelType);
    var defaultPalette = _panelBackgroundPalette.panelBackgroundPalette.find(function (item) {
      return item.value === panelColor;
    }) || {
      label: 'Custom',
      value: panelColor,
      border: _Palettes.DEFAULT_BORDER_COLOR
    };

    if (isCustomPanelEditable) {
      var colorPicker = {
        id: 'editor.panel.colorPicker',
        title: formatMessage(_message.messages.backgroundColor),
        type: 'select',
        selectType: 'color',
        defaultValue: defaultPalette,
        options: _panelBackgroundPalette.panelBackgroundPalette,
        onChange: function onChange(option) {
          return changeColor(option.value);
        }
      };
      var emojiPicker = {
        id: 'editor.panel.emojiPicker',
        title: formatMessage(_message.messages.emoji),
        type: 'select',
        selectType: 'emoji',
        options: [],
        selected: activePanelType === _adfSchema.PanelType.CUSTOM && !!activePanelIcon,
        onChange: function onChange(emoji) {
          return changeEmoji(emoji);
        }
      };
      var removeEmojiButton = {
        id: 'editor.panel.removeEmoji',
        type: 'button',
        icon: _removeEmoji.default,
        onClick: removeEmoji(),
        title: formatMessage(_messages.default.removeEmoji),
        disabled: activePanelIcon ? false : true
      };
      items.push(emojiPicker, removeEmojiButton, {
        type: 'separator'
      }, colorPicker);
    }
  }

  if (state) {
    items.push({
      type: 'copy-button',
      items: [{
        type: 'separator'
      }, {
        state: state,
        formatMessage: formatMessage,
        nodeType: panelNodeType
      }]
    });
  }

  items.push({
    type: 'separator'
  }, {
    id: 'editor.panel.delete',
    type: 'button',
    appearance: 'danger',
    icon: _remove.default,
    onClick: (0, _actions.removePanel)(),
    onMouseEnter: (0, _decoration.hoverDecoration)(panelNodeType, true),
    onMouseLeave: (0, _decoration.hoverDecoration)(panelNodeType, false),
    onFocus: (0, _decoration.hoverDecoration)(panelNodeType, true),
    onBlur: (0, _decoration.hoverDecoration)(panelNodeType, false),
    title: formatMessage(_messages.default.remove),
    tabIndex: null
  });
  return items;
};

exports.getToolbarItems = getToolbarItems;

var getToolbarConfig = function getToolbarConfig(state, intl) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var providerFactory = arguments.length > 3 ? arguments[3] : undefined;
  var formatMessage = intl.formatMessage;
  var panelObject = (0, _utils.findPanel)(state);

  if (panelObject) {
    var nodeType = state.schema.nodes.panel;
    var _panelObject$node$att = panelObject.node.attrs,
        panelType = _panelObject$node$att.panelType,
        panelColor = _panelObject$node$att.panelColor,
        panelIcon = _panelObject$node$att.panelIcon;

    var isStandardPanel = function isStandardPanel(panelType) {
      return panelType !== _adfSchema.PanelType.CUSTOM ? panelType : undefined;
    }; // force toolbar to be turned on


    var items = getToolbarItems(formatMessage, nodeType, options.allowCustomPanel || false, options.allowCustomPanel && options.allowCustomPanelEdit || false, providerFactory, panelType, options.allowCustomPanel ? panelColor : undefined, options.allowCustomPanel ? panelIcon || isStandardPanel(panelType) : undefined, state);

    var getDomRef = function getDomRef(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      var element = (0, _prosemirrorUtils.findDomRefAtPos)(panelObject.pos, domAtPos);
      return element;
    };

    return {
      title: 'Panel floating controls',
      getDomRef: getDomRef,
      nodeType: nodeType,
      items: items,
      scrollable: true
    };
  }

  return;
};

exports.getToolbarConfig = getToolbarConfig;