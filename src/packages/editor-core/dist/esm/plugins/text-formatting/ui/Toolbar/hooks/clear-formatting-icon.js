/** @jsx jsx */
import { useMemo } from 'react';
import { jsx } from '@emotion/react';
import { shortcutStyle } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import { clearFormattingWithAnalytics } from '../../../commands/clear-formatting';
import { pluginKey as clearFormattingPluginKey } from '../../../pm-plugins/clear-formatting';
import { clearFormatting as clearFormattingKeymap, tooltip } from '../../../../../keymaps';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
var clearFormattingToolbar = clearFormattingWithAnalytics(INPUT_METHOD.TOOLBAR);

var useClearFormattingPluginState = function useClearFormattingPluginState(editorState) {
  return useMemo(function () {
    return clearFormattingPluginKey.getState(editorState);
  }, [editorState]);
};

export var useClearIcon = function useClearIcon(_ref) {
  var intl = _ref.intl,
      editorState = _ref.editorState;
  var pluginState = useClearFormattingPluginState(editorState);
  var isPluginAvailable = Boolean(pluginState);
  var formattingIsPresent = Boolean(pluginState === null || pluginState === void 0 ? void 0 : pluginState.formattingIsPresent);
  var clearFormattingLabel = intl.formatMessage(toolbarMessages.clearFormatting);
  return useMemo(function () {
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