import React from 'react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { DropDownButton } from './dropdown-button';
export var BlockInsertMenuLegacy = function BlockInsertMenuLegacy(props) {
  var items = props.items;
  var dropdownItems = React.useMemo(function () {
    return [{
      items: items
    }];
  }, [items]);
  return /*#__PURE__*/React.createElement(DropdownMenu, {
    items: dropdownItems,
    onItemActivated: props.onItemActivated,
    onOpenChange: props.onOpenChange,
    mountTo: props.popupsMountPoint,
    boundariesElement: props.popupsBoundariesElement,
    scrollableElement: props.popupsScrollableElement,
    isOpen: props.open,
    fitHeight: 188,
    fitWidth: 175,
    zIndex: akEditorMenuZIndex
  }, /*#__PURE__*/React.createElement(DropDownButton, {
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