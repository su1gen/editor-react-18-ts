import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import PluginSlot from '../../ui/PluginSlot';
import { useEditorSharedConfig } from './Editor';
export function ContentComponents(_ref) {
  var disabled = _ref.disabled,
      wrapperElement = _ref.wrapperElement,
      containerElement = _ref.containerElement;
  var config = useEditorSharedConfig();

  if (!config) {
    return null;
  }

  return /*#__PURE__*/React.createElement(WithPluginState, {
    plugins: {
      disabled: disabledPluginKey
    },
    render: function render(_ref2) {
      var _disabled$editorDisab;

      var disabled = _ref2.disabled;
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