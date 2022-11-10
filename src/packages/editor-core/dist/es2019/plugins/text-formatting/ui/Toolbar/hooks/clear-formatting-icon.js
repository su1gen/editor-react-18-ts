/** @jsx jsx */
import { useMemo } from 'react';
import { jsx } from '@emotion/react';
import { shortcutStyle } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import { clearFormattingWithAnalytics } from '../../../commands/clear-formatting';
import { pluginKey as clearFormattingPluginKey } from '../../../pm-plugins/clear-formatting';
import { clearFormatting as clearFormattingKeymap, tooltip } from '../../../../../keymaps';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
const clearFormattingToolbar = clearFormattingWithAnalytics(INPUT_METHOD.TOOLBAR);

const useClearFormattingPluginState = editorState => {
  return useMemo(() => clearFormattingPluginKey.getState(editorState), [editorState]);
};

export const useClearIcon = ({
  intl,
  editorState
}) => {
  const pluginState = useClearFormattingPluginState(editorState);
  const isPluginAvailable = Boolean(pluginState);
  const formattingIsPresent = Boolean(pluginState === null || pluginState === void 0 ? void 0 : pluginState.formattingIsPresent);
  const clearFormattingLabel = intl.formatMessage(toolbarMessages.clearFormatting);
  return useMemo(() => {
    if (!isPluginAvailable) {
      return null;
    }

    return {
      key: 'clearFormatting',
      command: clearFormattingToolbar,
      content: clearFormattingLabel,
      elemAfter: jsx("div", {
        css: shortcutStyle
      }, tooltip(clearFormattingKeymap)),
      value: {
        name: 'clearFormatting'
      },
      isActive: false,
      isDisabled: !formattingIsPresent
    };
  }, [clearFormattingLabel, isPluginAvailable, formattingIsPresent]);
};