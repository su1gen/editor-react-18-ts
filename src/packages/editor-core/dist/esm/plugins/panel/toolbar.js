import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _panelIconMap;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import RemoveEmojiIcon from '@atlaskit/icon/glyph/editor/remove-emoji';
import commonMessages from '../../messages';
import { removePanel, changePanelType } from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { panelBackgroundPalette } from '../../ui/ColorPalette/Palettes/panelBackgroundPalette';
import { getPanelTypeBackground } from '@atlaskit/editor-common/panel';
import { findPanel } from './utils';
import { findDomRefAtPos } from 'prosemirror-utils';
import { DEFAULT_BORDER_COLOR } from '../../ui/ColorPalette/Palettes';
import { PanelType } from '@atlaskit/adf-schema';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID, withAnalytics } from '../analytics';
import { messages } from './message';
export var panelIconMap = (_panelIconMap = {}, _defineProperty(_panelIconMap, PanelType.INFO, {
  shortName: ':info:',
  id: 'atlassian-info'
}), _defineProperty(_panelIconMap, PanelType.NOTE, {
  shortName: ':note:',
  id: 'atlassian-note'
}), _defineProperty(_panelIconMap, PanelType.WARNING, {
  shortName: ':warning:',
  id: 'atlassian-warning'
}), _defineProperty(_panelIconMap, PanelType.ERROR, {
  shortName: ':cross_mark:',
  id: 'atlassian-cross_mark'
}), _defineProperty(_panelIconMap, PanelType.SUCCESS, {
  shortName: ':check_mark:',
  id: 'atlassian-check_mark'
}), _defineProperty(_panelIconMap, PanelType.TIP, {
  shortName: ':tip:',
  id: 'atlassian-tip'
}), _panelIconMap);
export var getToolbarItems = function getToolbarItems(formatMessage, panelNodeType, isCustomPanelEnabled, isCustomPanelEditable, providerFactory, activePanelType, activePanelColor, activePanelIcon, state) {
  // TODO: ED-14403 investigate why these titles are not getting translated for the tooltips
  var items = [{
    id: 'editor.panel.info',
    type: 'button',
    icon: InfoIcon,
    onClick: changePanelType(PanelType.INFO),
    selected: activePanelType === PanelType.INFO,
    title: formatMessage(messages.info),
    tabIndex: null
  }, {
    id: 'editor.panel.note',
    type: 'button',
    icon: NoteIcon,
    onClick: changePanelType(PanelType.NOTE),
    selected: activePanelType === PanelType.NOTE,
    title: formatMessage(messages.note),
    tabIndex: null
  }, {
    id: 'editor.panel.success',
    type: 'button',
    icon: SuccessIcon,
    onClick: changePanelType(PanelType.SUCCESS),
    selected: activePanelType === PanelType.SUCCESS,
    title: formatMessage(messages.success),
    tabIndex: null
  }, {
    id: 'editor.panel.warning',
    type: 'button',
    icon: WarningIcon,
    onClick: changePanelType(PanelType.WARNING),
    selected: activePanelType === PanelType.WARNING,
    title: formatMessage(messages.warning),
    tabIndex: null
  }, {
    id: 'editor.panel.error',
    type: 'button',
    icon: ErrorIcon,
    onClick: changePanelType(PanelType.ERROR),
    selected: activePanelType === PanelType.ERROR,
    title: formatMessage(messages.error),
    tabIndex: null
  }];

  if (isCustomPanelEnabled) {
    var changeColor = function changeColor(color) {
      return function (state, dispatch) {
        var panelNode = findPanel(state);

        if (panelNode === undefined) {
          return false;
        }

        var previousColor = panelNode.node.attrs.panelColor || getPanelTypeBackground(panelNode.node.attrs.panelType);
        var emojiInfo = panelNode.node.attrs.panelType;
        var panelEmoji = panelIconMap[emojiInfo];
        var previousEmoji = panelEmoji ? {
          emoji: panelEmoji.shortName,
          emojiId: panelEmoji.id
        } : {};

        if (previousColor === color) {
          changePanelType(PanelType.CUSTOM, _objectSpread({
            color: color
          }, previousEmoji), isCustomPanelEnabled)(state, dispatch);
          return false;
        }

        var payload = {
          action: ACTION.CHANGED_BACKGROUND_COLOR,
          actionSubject: ACTION_SUBJECT.PANEL,
          actionSubjectId: ACTION_SUBJECT_ID.PANEL,
          attributes: {
            newColor: color,
            previousColor: previousColor
          },
          eventType: EVENT_TYPE.TRACK
        };
        withAnalytics(payload)(changePanelType(PanelType.CUSTOM, _objectSpread({
          color: color
        }, previousEmoji), isCustomPanelEnabled))(state, dispatch);
        return false;
      };
    };

    var changeEmoji = function changeEmoji(emoji) {
      return function (state, dispatch) {
        var panelNode = findPanel(state);

        if (panelNode === undefined) {
          return false;
        }

        var previousIcon = panelNode.node.attrs.panelIcon || '';

        if (previousIcon === emoji.shortName) {
          changePanelType(PanelType.CUSTOM, {
            emoji: emoji.shortName,
            emojiId: emoji.id,
            emojiText: emoji.fallback
          }, true)(state, dispatch);
          return false;
        }

        var payload = {
          action: ACTION.CHANGED_ICON,
          actionSubject: ACTION_SUBJECT.PANEL,
          actionSubjectId: ACTION_SUBJECT_ID.PANEL,
          attributes: {
            newIcon: emoji.shortName,
            previousIcon: previousIcon
          },
          eventType: EVENT_TYPE.TRACK
        };
        withAnalytics(payload)(changePanelType(PanelType.CUSTOM, {
          emoji: emoji.shortName,
          emojiId: emoji.id,
          emojiText: emoji.fallback
        }, true))(state, dispatch);
        return false;
      };
    };

    var removeEmoji = function removeEmoji() {
      return function (state, dispatch) {
        var panelNode = findPanel(state);

        if (activePanelType === PanelType.CUSTOM && !activePanelIcon) {
          return false;
        }

        if (panelNode === undefined) {
          return false;
        }

        var payload = {
          action: ACTION.REMOVE_ICON,
          actionSubject: ACTION_SUBJECT.PANEL,
          actionSubjectId: ACTION_SUBJECT_ID.PANEL,
          attributes: {
            icon: panelNode.node.attrs.panelIcon
          },
          eventType: EVENT_TYPE.TRACK
        };
        withAnalytics(payload)(changePanelType(PanelType.CUSTOM, {
          emoji: undefined,
          emojiId: undefined,
          emojiText: undefined
        }, isCustomPanelEnabled))(state, dispatch);
        return false;
      };
    };

    var panelColor = activePanelType === PanelType.CUSTOM ? activePanelColor || getPanelTypeBackground(PanelType.INFO) : getPanelTypeBackground(activePanelType);
    var defaultPalette = panelBackgroundPalette.find(function (item) {
      return item.value === panelColor;
    }) || {
      label: 'Custom',
      value: panelColor,
      border: DEFAULT_BORDER_COLOR
    };

    if (isCustomPanelEditable) {
      var colorPicker = {
        id: 'editor.panel.colorPicker',
        title: formatMessage(messages.backgroundColor),
        type: 'select',
        selectType: 'color',
        defaultValue: defaultPalette,
        options: panelBackgroundPalette,
        onChange: function onChange(option) {
          return changeColor(option.value);
        }
      };
      var emojiPicker = {
        id: 'editor.panel.emojiPicker',
        title: formatMessage(messages.emoji),
        type: 'select',
        selectType: 'emoji',
        options: [],
        selected: activePanelType === PanelType.CUSTOM && !!activePanelIcon,
        onChange: function onChange(emoji) {
          return changeEmoji(emoji);
        }
      };
      var removeEmojiButton = {
        id: 'editor.panel.removeEmoji',
        type: 'button',
        icon: RemoveEmojiIcon,
        onClick: removeEmoji(),
        title: formatMessage(commonMessages.removeEmoji),
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
    icon: RemoveIcon,
    onClick: removePanel(),
    onMouseEnter: hoverDecoration(panelNodeType, true),
    onMouseLeave: hoverDecoration(panelNodeType, false),
    onFocus: hoverDecoration(panelNodeType, true),
    onBlur: hoverDecoration(panelNodeType, false),
    title: formatMessage(commonMessages.remove),
    tabIndex: null
  });
  return items;
};
export var getToolbarConfig = function getToolbarConfig(state, intl) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var providerFactory = arguments.length > 3 ? arguments[3] : undefined;
  var formatMessage = intl.formatMessage;
  var panelObject = findPanel(state);

  if (panelObject) {
    var nodeType = state.schema.nodes.panel;
    var _panelObject$node$att = panelObject.node.attrs,
        panelType = _panelObject$node$att.panelType,
        panelColor = _panelObject$node$att.panelColor,
        panelIcon = _panelObject$node$att.panelIcon;

    var isStandardPanel = function isStandardPanel(panelType) {
      return panelType !== PanelType.CUSTOM ? panelType : undefined;
    }; // force toolbar to be turned on


    var items = getToolbarItems(formatMessage, nodeType, options.allowCustomPanel || false, options.allowCustomPanel && options.allowCustomPanelEdit || false, providerFactory, panelType, options.allowCustomPanel ? panelColor : undefined, options.allowCustomPanel ? panelIcon || isStandardPanel(panelType) : undefined, state);

    var getDomRef = function getDomRef(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      var element = findDomRefAtPos(panelObject.pos, domAtPos);
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