import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import ToolBar from '../../ui/Toolbar';
import { useEditorSharedConfig } from './Editor';
export function Toolbar({
  containerElement
}) {
  const config = useEditorSharedConfig();

  if (!config) {
    return null;
  }

  return /*#__PURE__*/React.createElement(WithPluginState, {
    plugins: {
      disabled: disabledPluginKey
    },
    render: ({
      disabled
    }) => {
      var _disabled$editorDisab;

      return /*#__PURE__*/React.createElement(ToolBar, {
        editorView: config.editorView,
        eventDispatcher: config.eventDispatcher,
        providerFactory: config.providerFactory,
        items: config.primaryToolbarComponents,
        popupsMountPoint: config.popupsMountPoint,
        popupsBoundariesElement: config.popupsBoundariesElement,
        popupsScrollableElement: config.popupsScrollableElement,
        disabled: (_disabled$editorDisab = disabled === null || disabled === void 0 ? void 0 : disabled.editorDisabled) !== null && _disabled$editorDisab !== void 0 ? _disabled$editorDisab : false,
        containerElement: containerElement
      });
    }
  });
}