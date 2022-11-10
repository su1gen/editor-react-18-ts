"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ToolbarListsIndentation;

var _react = require("@emotion/react");

var _onItemActivated = require("./onItemActivated");

var _ToolbarDropdown = require("./ToolbarDropdown");

var _Toolbar = require("./Toolbar");

/** @jsx jsx */
function ToolbarListsIndentation(props) {
  var disabled = props.disabled,
      isSmall = props.isSmall,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      bulletListDisabled = props.bulletListDisabled,
      orderedListActive = props.orderedListActive,
      orderedListDisabled = props.orderedListDisabled,
      showIndentationButtons = props.showIndentationButtons,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      indentDisabled = props.indentDisabled,
      outdentDisabled = props.outdentDisabled;

  if (isSmall) {
    return (0, _react.jsx)(_ToolbarDropdown.ToolbarDropdown, {
      editorView: props.editorView,
      isReducedSpacing: isReducedSpacing,
      popupsMountPoint: popupsMountPoint,
      popupsBoundariesElement: popupsBoundariesElement,
      popupsScrollableElement: popupsScrollableElement,
      bulletListActive: bulletListActive,
      bulletListDisabled: bulletListDisabled,
      showIndentationButtons: showIndentationButtons,
      orderedListActive: orderedListActive,
      orderedListDisabled: orderedListDisabled,
      indentDisabled: indentDisabled,
      outdentDisabled: outdentDisabled,
      disabled: disabled,
      onItemActivated: _onItemActivated.onItemActivated
    });
  }

  return (0, _react.jsx)(_Toolbar.Toolbar, {
    editorView: props.editorView,
    isReducedSpacing: isReducedSpacing,
    bulletListActive: bulletListActive,
    bulletListDisabled: bulletListDisabled,
    showIndentationButtons: showIndentationButtons,
    orderedListActive: orderedListActive,
    orderedListDisabled: orderedListDisabled,
    indentDisabled: indentDisabled,
    outdentDisabled: outdentDisabled,
    disabled: disabled,
    onItemActivated: _onItemActivated.onItemActivated
  });
}