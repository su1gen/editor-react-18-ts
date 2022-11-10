/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx } from '@emotion/react';
import { buttonGroupStyle } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
export var SingleToolbarButtons = /*#__PURE__*/React.memo(function (_ref) {
  var items = _ref.items,
      isReducedSpacing = _ref.isReducedSpacing,
      editorView = _ref.editorView;
  var onClick = useCallback(function (command) {
    return function () {
      command(editorView.state, editorView.dispatch);
      return false;
    };
  }, [editorView.state, editorView.dispatch]);
  return jsx("span", {
    css: buttonGroupStyle
  }, items.map(function (item) {
    return jsx(ToolbarButton, {
      key: item.key,
      buttonId: item.buttonId,
      spacing: isReducedSpacing ? 'none' : 'default',
      onClick: onClick(item.command),
      selected: item.isActive,
      disabled: item.isDisabled,
      title: item.tooltipElement,
      iconBefore: item.iconElement,
      "aria-pressed": item.isActive,
      "aria-label": String(item.content)
    });
  }));
});