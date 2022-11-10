import React from 'react';
import { MobileAppearance } from '../AppearanceComponents/Mobile';
import WidthEmitter from '../WidthEmitter';
export default function Mobile({
  editorView,
  maxHeight,
  persistScrollGutter,
  editorDOMElement,
  disabled
}) {
  return /*#__PURE__*/React.createElement(MobileAppearance, {
    editorView: editorView || null,
    maxHeight: maxHeight,
    persistScrollGutter: persistScrollGutter,
    editorDisabled: disabled
  }, editorDOMElement, editorView && /*#__PURE__*/React.createElement(WidthEmitter, {
    editorView: editorView
  }));
}