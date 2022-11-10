import React from 'react';
import { Popup } from '@atlaskit/editor-common/ui';
import InsertMenu from '../../../../ui/ElementBrowser/InsertMenu';
import { DropDownButton } from './dropdown-button';
export const BlockInsertElementBrowser = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.open && /*#__PURE__*/React.createElement(Popup, {
    target: props.plusButtonRef,
    fitHeight: 500,
    fitWidth: 350,
    offset: [0, 3],
    mountTo: props.popupsMountPoint,
    boundariesElement: props.popupsBoundariesElement,
    scrollableElement: props.popupsScrollableElement
  }, /*#__PURE__*/React.createElement(InsertMenu, {
    editorView: props.editorView,
    dropdownItems: props.items,
    onInsert: props.onInsert,
    toggleVisiblity: props.togglePlusMenuVisibility
  })), /*#__PURE__*/React.createElement(DropDownButton, {
    "aria-expanded": props.open,
    "aria-haspopup": true,
    handleRef: props.onRef,
    selected: props.open,
    disabled: props.disabled,
    onClick: props.onClick,
    spacing: props.spacing,
    label: props.label
  }));
};