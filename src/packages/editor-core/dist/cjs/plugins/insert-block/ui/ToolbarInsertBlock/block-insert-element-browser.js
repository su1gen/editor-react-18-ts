"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockInsertElementBrowser = void 0;

var _react = _interopRequireDefault(require("react"));

var _ui = require("@atlaskit/editor-common/ui");

var _InsertMenu = _interopRequireDefault(require("../../../../ui/ElementBrowser/InsertMenu"));

var _dropdownButton = require("./dropdown-button");

var BlockInsertElementBrowser = function BlockInsertElementBrowser(props) {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, props.open && /*#__PURE__*/_react.default.createElement(_ui.Popup, {
    target: props.plusButtonRef,
    fitHeight: 500,
    fitWidth: 350,
    offset: [0, 3],
    mountTo: props.popupsMountPoint,
    boundariesElement: props.popupsBoundariesElement,
    scrollableElement: props.popupsScrollableElement
  }, /*#__PURE__*/_react.default.createElement(_InsertMenu.default, {
    editorView: props.editorView,
    dropdownItems: props.items,
    onInsert: props.onInsert,
    toggleVisiblity: props.togglePlusMenuVisibility
  })), /*#__PURE__*/_react.default.createElement(_dropdownButton.DropDownButton, {
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

exports.BlockInsertElementBrowser = BlockInsertElementBrowser;