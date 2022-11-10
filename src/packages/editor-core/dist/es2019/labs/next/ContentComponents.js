import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import PluginSlot from '../../ui/PluginSlot';
import { useEditorSharedConfig } from './Editor';
export function ContentComponents({
  disabled,
  wrapperElement,
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

      return /*#__PURE__*/React.createElement(PluginSlot, {
        editorView: config.editorView,
        eventDispatcher: config.eventDispatcher,
        providerFactory: config.providerFactory,
        items: config.contentComponents,
        popupsMountPoint: config.popupsMountPoint,
        popupsBoundariesElement: config.popupsBoundariesElement,
        popupsScrollableElement: config.popupsScrollableElement,
        containerElement: containerElement // TODO: Figure out how to pass containerElement here ED-8448
        ,
        wrapperElement: wrapperElement,
        disabled: (_disabled$editorDisab = disabled === null || disabled === void 0 ? void 0 : disabled.editorDisabled) !== null && _disabled$editorDisab !== void 0 ? _disabled$editorDisab : false
      });
    }
  });
}