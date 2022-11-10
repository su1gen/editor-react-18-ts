"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockInsertMenuLegacy = void 0;

var _react = _interopRequireDefault(require("react"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _DropdownMenu = _interopRequireDefault(require("../../../../ui/DropdownMenu"));

var _dropdownButton = require("./dropdown-button");

var BlockInsertMenuLegacy = function BlockInsertMenuLegacy(props) {
  var items = props.items;

  var dropdownItems = _react.default.useMemo(function () {
    return [{
      items: items
    }];
  }, [items]);

  return /*#__PURE__*/_react.default.createElement(_DropdownMenu.default, {
    items: dropdownItems,
    onItemActivated: props.onItemActivated,
    onOpenChange: props.onOpenChange,
    mountTo: props.popupsMountPoint,
    boundariesElement: props.popupsBoundariesElement,
    scrollableElement: props.popupsScrollableElement,
    isOpen: props.open,
    fitHeight: 188,
    fitWidth: 175,
    zIndex: _editorSharedStyles.akEditorMenuZIndex
  }, /*#__PURE__*/_react.default.createElement(_dropdownButton.DropDownButton, {
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

exports.BlockInsertMenuLegacy = BlockInsertMenuLegacy;