import React from 'react';
import { MobileAppearance } from '../AppearanceComponents/Mobile';
import WidthEmitter from '../WidthEmitter';
export default function Mobile(_ref) {
  var editorView = _ref.editorView,
      maxHeight = _ref.maxHeight,
      persistScrollGutter = _ref.persistScrollGutter,
      editorDOMElement = _ref.editorDOMElement,
      disabled = _ref.disabled;
  return /*#__PURE__*/React.createElement(MobileAppearance, {
    editorView: editorView || null,
    maxHeight: maxHeight,
    persistScrollGutter: persistScrollGutter,
    editorDisabled: disabled
  }, editorDOMElement, editorView && /*#__PURE__*/React.createElement(WidthEmitter, {
    editorView: editorView
  }));
}