import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _IconsMarkSchema;

/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx } from '@emotion/react';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { shortcutStyle } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import * as commands from '../../../commands/text-formatting';
import { TOOLBAR_ACTION_SUBJECT_ID } from '../../../../../plugins/analytics/types/toolbar-button';
import { pluginKey as textFormattingPluginKey } from '../../../pm-plugins/plugin-key';
import { toggleCode, toggleStrikethrough, toggleUnderline, tooltip, toggleBold, toggleItalic, toggleSubscript, toggleSuperscript, ToolTipContent } from '../../../../../keymaps';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
import { IconTypes } from '../types';

var withToolbarInputMethod = function withToolbarInputMethod(func) {
  return func({
    inputMethod: INPUT_METHOD.TOOLBAR
  });
};

var IconButtons = {
  strong: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_STRONG,
    command: withToolbarInputMethod(commands.toggleStrongWithAnalytics),
    message: toolbarMessages.bold,
    tooltipKeymap: toggleBold,
    component: function component() {
      return jsx(BoldIcon, {
        label: ""
      });
    }
  },
  em: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_ITALIC,
    command: withToolbarInputMethod(commands.toggleEmWithAnalytics),
    message: toolbarMessages.italic,
    tooltipKeymap: toggleItalic,
    component: function component() {
      return jsx(ItalicIcon, {
        label: ""
      });
    }
  },
  underline: {
    command: withToolbarInputMethod(commands.toggleUnderlineWithAnalytics),
    message: toolbarMessages.underline,
    tooltipKeymap: toggleUnderline
  },
  strike: {
    command: withToolbarInputMethod(commands.toggleStrikeWithAnalytics),
    message: toolbarMessages.strike,
    tooltipKeymap: toggleStrikethrough
  },
  code: {
    command: withToolbarInputMethod(commands.toggleCodeWithAnalytics),
    message: toolbarMessages.code,
    tooltipKeymap: toggleCode
  },
  subscript: {
    command: withToolbarInputMethod(commands.toggleSubscriptWithAnalytics),
    message: toolbarMessages.subscript,
    tooltipKeymap: toggleSubscript
  },
  superscript: {
    command: withToolbarInputMethod(commands.toggleSuperscriptWithAnalytics),
    message: toolbarMessages.superscript,
    tooltipKeymap: toggleSuperscript
  }
};

var getIcon = function getIcon(_ref) {
  var iconType = _ref.iconType,
      isDisabled = _ref.isDisabled,
      isActive = _ref.isActive,
      intl = _ref.intl;
  var icon = IconButtons[iconType];
  var content = intl.formatMessage(icon.message);
  var tooltipKeymap = icon.tooltipKeymap;
  return {
    content: content,
    buttonId: icon.buttonId,
    iconMark: iconType,
    key: iconType,
    command: icon.command,
    iconElement: icon.component ? icon.component() : undefined,
    tooltipElement: tooltipKeymap ? jsx(ToolTipContent, {
      description: content,
      keymap: tooltipKeymap
    }) : undefined,
    elemAfter: tooltipKeymap ? jsx("div", {
      css: shortcutStyle
    }, tooltip(tooltipKeymap)) : undefined,
    value: {
      name: iconType
    },
    isActive: isActive,
    isDisabled: isDisabled
  };
};

var IconsMarkSchema = (_IconsMarkSchema = {}, _defineProperty(_IconsMarkSchema, IconTypes.strong, 'strong'), _defineProperty(_IconsMarkSchema, IconTypes.em, 'em'), _defineProperty(_IconsMarkSchema, IconTypes.strike, 'strike'), _defineProperty(_IconsMarkSchema, IconTypes.code, 'code'), _defineProperty(_IconsMarkSchema, IconTypes.underline, 'underline'), _defineProperty(_IconsMarkSchema, IconTypes.superscript, 'subsup'), _defineProperty(_IconsMarkSchema, IconTypes.subscript, 'subsup'), _IconsMarkSchema);

var buildMenuIconState = function buildMenuIconState(iconMark) {
  return function (_ref2) {
    var schema = _ref2.schema,
        textFormattingPluginState = _ref2.textFormattingPluginState;
    var hasPluginState = Boolean(textFormattingPluginState);
    var markSchema = IconsMarkSchema[iconMark];
    var hasSchemaMark = Boolean(schema.marks[markSchema]);

    if (!hasPluginState) {
      return {
        isActive: false,
        isDisabled: true,
        isHidden: false,
        hasSchemaMark: hasSchemaMark
      };
    }

    var isActive = textFormattingPluginState["".concat(iconMark, "Active")];
    var isDisabled = textFormattingPluginState["".concat(iconMark, "Disabled")];
    var isHidden = textFormattingPluginState["".concat(iconMark, "Hidden")];
    return {
      isActive: Boolean(isActive),
      isDisabled: Boolean(isDisabled),
      isHidden: Boolean(isHidden),
      hasSchemaMark: hasSchemaMark
    };
  };
};

var buildIcon = function buildIcon(iconMark) {
  var getState = buildMenuIconState(iconMark);
  return function (_ref3) {
    var schema = _ref3.schema,
        textFormattingPluginState = _ref3.textFormattingPluginState,
        intl = _ref3.intl,
        isToolbarDisabled = _ref3.isToolbarDisabled;
    var iconState = getState({
      schema: schema,
      textFormattingPluginState: textFormattingPluginState
    });
    var isActive = iconState.isActive,
        isDisabled = iconState.isDisabled,
        isHidden = iconState.isHidden,
        hasSchemaMark = iconState.hasSchemaMark;
    var iconComponent = useMemo(function () {
      return getIcon({
        iconType: IconTypes[iconMark],
        isDisabled: isToolbarDisabled || isDisabled,
        isActive: isActive,
        intl: intl
      });
    }, [isToolbarDisabled, isDisabled, isActive, intl]);
    var shouldRenderIcon = hasSchemaMark && !isHidden;
    return useMemo(function () {
      return shouldRenderIcon ? iconComponent : null;
    }, [shouldRenderIcon, iconComponent]);
  };
};

var buildStrongIcon = buildIcon(IconTypes.strong);
var buildEmIcon = buildIcon(IconTypes.em);
var buildUnderlineIcon = buildIcon(IconTypes.underline);
var buildStrikeIcon = buildIcon(IconTypes.strike);
var buildCodeIcon = buildIcon(IconTypes.code);
var buildSubscriptIcon = buildIcon(IconTypes.subscript);
var buildSuperscriptIcon = buildIcon(IconTypes.superscript);

var useTextFormattingPluginState = function useTextFormattingPluginState(editorState) {
  return useMemo(function () {
    return textFormattingPluginKey.getState(editorState);
  }, [editorState]);
};

export var useFormattingIcons = function useFormattingIcons(_ref4) {
  var isToolbarDisabled = _ref4.isToolbarDisabled,
      editorState = _ref4.editorState,
      intl = _ref4.intl;
  var textFormattingPluginState = useTextFormattingPluginState(editorState);
  var schema = editorState.schema;
  var props = {
    schema: schema,
    textFormattingPluginState: textFormattingPluginState,
    intl: intl,
    isToolbarDisabled: Boolean(isToolbarDisabled)
  };
  var strongIcon = buildStrongIcon(props);
  var emIcon = buildEmIcon(props);
  var underlineIcon = buildUnderlineIcon(props);
  var strikeIcon = buildStrikeIcon(props);
  var codeIcon = buildCodeIcon(props);
  var subscriptIcon = buildSubscriptIcon(props);
  var superscriptIcon = buildSuperscriptIcon(props);
  var result = useMemo(function () {
    return [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon];
  }, [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon]);
  return result;
};
export var useHasFormattingActived = function useHasFormattingActived(_ref5) {
  var editorState = _ref5.editorState,
      iconTypeList = _ref5.iconTypeList;
  var textFormattingPluginState = useTextFormattingPluginState(editorState);
  var hasActiveFormatting = useMemo(function () {
    if (!textFormattingPluginState) {
      return false;
    }

    return iconTypeList.some(function (iconType) {
      return textFormattingPluginState["".concat(iconType, "Active")];
    });
  }, [textFormattingPluginState, iconTypeList]);
  return hasActiveFormatting;
};