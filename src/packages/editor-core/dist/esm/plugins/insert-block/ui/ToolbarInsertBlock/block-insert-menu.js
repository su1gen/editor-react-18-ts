import React from 'react';
import { BlockInsertElementBrowser } from './block-insert-element-browser';
import { BlockInsertMenuLegacy } from './block-insert-menu-legacy';
import { DropDownButton } from './dropdown-button';
export var BlockInsertMenu = function BlockInsertMenu(props) {
  if (props.items.length === 0) {
    return null;
  }

  if (props.disabled) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DropDownButton, {
      "aria-expanded": props.open,
      "aria-haspopup": true,
      handleRef: props.onRef,
      selected: props.open,
      disabled: props.disabled,
      onClick: props.onClick,
      spacing: props.spacing,
      label: props.label
    }));
  }

  if (props.replacePlusMenuWithElementBrowser) {
    return /*#__PURE__*/React.createElement(BlockInsertElementBrowser, {
      disabled: props.disabled,
      editorView: props.editorView,
      items: props.items,
      label: props.label,
      onClick: props.onClick,
      onInsert: props.onInsert,
      onRef: props.onPlusButtonRef,
      open: props.open,
      plusButtonRef: props.plusButtonRef,
      popupsBoundariesElement: props.popupsBoundariesElement,
      popupsMountPoint: props.popupsMountPoint,
      popupsScrollableElement: props.popupsScrollableElement,
      spacing: props.spacing,
      togglePlusMenuVisibility: props.togglePlusMenuVisibility
    });
  }

  return /*#__PURE__*/React.createElement(BlockInsertMenuLegacy, {
    disabled: props.disabled,
    items: props.items,
    label: props.label,
    onClick: props.onClick,
    onItemActivated: props.onItemActivated,
    onOpenChange: props.onOpenChange,
    onRef: props.onRef,
    open: props.open,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsMountPoint: props.popupsMountPoint,
    popupsScrollableElement: props.popupsScrollableElement,
    spacing: props.spacing
  });
};