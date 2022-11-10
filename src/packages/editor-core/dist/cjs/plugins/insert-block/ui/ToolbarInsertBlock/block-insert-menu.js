"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockInsertMenu = void 0;

var _react = _interopRequireDefault(require("react"));

var _blockInsertElementBrowser = require("./block-insert-element-browser");

var _blockInsertMenuLegacy = require("./block-insert-menu-legacy");

var _dropdownButton = require("./dropdown-button");

var BlockInsertMenu = function BlockInsertMenu(props) {
  if (props.items.length === 0) {
    return null;
  }

  if (props.disabled) {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_dropdownButton.DropDownButton, {
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
    return /*#__PURE__*/_react.default.createElement(_blockInsertElementBrowser.BlockInsertElementBrowser, {
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

  return /*#__PURE__*/_react.default.createElement(_blockInsertMenuLegacy.BlockInsertMenuLegacy, {
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

exports.BlockInsertMenu = BlockInsertMenu;