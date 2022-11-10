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

const withToolbarInputMethod = func => func({
  inputMethod: INPUT_METHOD.TOOLBAR
});

const IconButtons = {
  strong: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_STRONG,
    command: withToolbarInputMethod(commands.toggleStrongWithAnalytics),
    message: toolbarMessages.bold,
    tooltipKeymap: toggleBold,
    component: () => jsx(BoldIcon, {
      label: ""
    })
  },
  em: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_ITALIC,
    command: withToolbarInputMethod(commands.toggleEmWithAnalytics),
    message: toolbarMessages.italic,
    tooltipKeymap: toggleItalic,
    component: () => jsx(ItalicIcon, {
      label: ""
    })
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

const getIcon = ({
  iconType,
  isDisabled,
  isActive,
  intl
}) => {
  const icon = IconButtons[iconType];
  const content = intl.formatMessage(icon.message);
  const {
    tooltipKeymap
  } = icon;
  return {
    content,
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
    isActive,
    isDisabled
  };
};

const IconsMarkSchema = {
  [IconTypes.strong]: 'strong',
  [IconTypes.em]: 'em',
  [IconTypes.strike]: 'strike',
  [IconTypes.code]: 'code',
  [IconTypes.underline]: 'underline',
  [IconTypes.superscript]: 'subsup',
  [IconTypes.subscript]: 'subsup'
};

const buildMenuIconState = iconMark => ({
  schema,
  textFormattingPluginState
}) => {
  const hasPluginState = Boolean(textFormattingPluginState);
  const markSchema = IconsMarkSchema[iconMark];
  const hasSchemaMark = Boolean(schema.marks[markSchema]);

  if (!hasPluginState) {
    return {
      isActive: false,
      isDisabled: true,
      isHidden: false,
      hasSchemaMark
    };
  }

  const isActive = textFormattingPluginState[`${iconMark}Active`];
  const isDisabled = textFormattingPluginState[`${iconMark}Disabled`];
  const isHidden = textFormattingPluginState[`${iconMark}Hidden`];
  return {
    isActive: Boolean(isActive),
    isDisabled: Boolean(isDisabled),
    isHidden: Boolean(isHidden),
    hasSchemaMark
  };
};

const buildIcon = iconMark => {
  const getState = buildMenuIconState(iconMark);
  return ({
    schema,
    textFormattingPluginState,
    intl,
    isToolbarDisabled
  }) => {
    const iconState = getState({
      schema,
      textFormattingPluginState
    });
    const {
      isActive,
      isDisabled,
      isHidden,
      hasSchemaMark
    } = iconState;
    const iconComponent = useMemo(() => getIcon({
      iconType: IconTypes[iconMark],
      isDisabled: isToolbarDisabled || isDisabled,
      isActive,
      intl
    }), [isToolbarDisabled, isDisabled, isActive, intl]);
    const shouldRenderIcon = hasSchemaMark && !isHidden;
    return useMemo(() => shouldRenderIcon ? iconComponent : null, [shouldRenderIcon, iconComponent]);
  };
};

const buildStrongIcon = buildIcon(IconTypes.strong);
const buildEmIcon = buildIcon(IconTypes.em);
const buildUnderlineIcon = buildIcon(IconTypes.underline);
const buildStrikeIcon = buildIcon(IconTypes.strike);
const buildCodeIcon = buildIcon(IconTypes.code);
const buildSubscriptIcon = buildIcon(IconTypes.subscript);
const buildSuperscriptIcon = buildIcon(IconTypes.superscript);

const useTextFormattingPluginState = editorState => useMemo(() => textFormattingPluginKey.getState(editorState), [editorState]);

export const useFormattingIcons = ({
  isToolbarDisabled,
  editorState,
  intl
}) => {
  const textFormattingPluginState = useTextFormattingPluginState(editorState);
  const {
    schema
  } = editorState;
  const props = {
    schema,
    textFormattingPluginState,
    intl,
    isToolbarDisabled: Boolean(isToolbarDisabled)
  };
  const strongIcon = buildStrongIcon(props);
  const emIcon = buildEmIcon(props);
  const underlineIcon = buildUnderlineIcon(props);
  const strikeIcon = buildStrikeIcon(props);
  const codeIcon = buildCodeIcon(props);
  const subscriptIcon = buildSubscriptIcon(props);
  const superscriptIcon = buildSuperscriptIcon(props);
  const result = useMemo(() => [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon], [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon]);
  return result;
};
export const useHasFormattingActived = ({
  editorState,
  iconTypeList
}) => {
  const textFormattingPluginState = useTextFormattingPluginState(editorState);
  const hasActiveFormatting = useMemo(() => {
    if (!textFormattingPluginState) {
      return false;
    }

    return iconTypeList.some(iconType => textFormattingPluginState[`${iconType}Active`]);
  }, [textFormattingPluginState, iconTypeList]);
  return hasActiveFormatting;
};