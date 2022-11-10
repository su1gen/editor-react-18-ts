import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import React, { useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { mobileDimensionsPluginKey } from '../../plugins/mobile-dimensions/plugin-factory';
import WithPluginState from '../WithPluginState';
import WithFlash from '../WithFlash';
import { createEditorContentStyle } from '../ContentStyles';
import { ClickAreaMobile as ClickArea } from '../Addon';
var mobileEditor = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  min-height: 30px;\n  width: 100%;\n  max-width: inherit;\n  box-sizing: border-box;\n  word-wrap: break-word;\n\n  div > .ProseMirror {\n    outline: none;\n    white-space: pre-wrap;\n    padding: 0;\n    margin: 0;\n  }\n"])));
var ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';
export function MobileAppearance(_ref) {
  var editorView = _ref.editorView,
      persistScrollGutter = _ref.persistScrollGutter,
      children = _ref.children,
      editorDisabled = _ref.editorDisabled;
  var render = useCallback(function (_ref2) {
    var maxContentSize = _ref2.maxContentSize,
        mobileDimensions = _ref2.mobileDimensions;
    var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
    var minHeight = 100;
    var currentIsExpanded = true; // isExpanded prop should always be true for Hybrid Editor

    if (mobileDimensions) {
      var keyboardHeight = mobileDimensions.keyboardHeight,
          windowHeight = mobileDimensions.windowHeight,
          mobilePaddingTop = mobileDimensions.mobilePaddingTop,
          isExpanded = mobileDimensions.isExpanded;
      /*
        We calculate the min-height based on the windowHeight - keyboardHeight - paddingTop.
        This is needed due to scrolling issues when there is no content to scroll (like, only having 1 paragraph),
        but if the clickable area is bigger than the windowHeight - keyboard (including toolbar) then the view
        is scrolled nevertheless, and it gives the sensation that the content was lost.
      */

      if (!persistScrollGutter) {
        // in iOS Hybrid Editor windowHeight doesn't exclude keyboardHeight
        // in Android keyboardHeight is always set to -1;
        minHeight = windowHeight - keyboardHeight - 2 * mobilePaddingTop;
      } else {
        // in iOS Compact Editor windowHeight excludes keyboardHeight
        minHeight = windowHeight - mobilePaddingTop; // isExpanded can be true of false for Compact editor

        currentIsExpanded = isExpanded;
      }
    }

    return jsx(WithFlash, {
      animate: maxContentSizeReached
    }, jsx("div", {
      css: mobileEditor
    }, jsx(ClickArea, {
      editorView: editorView || undefined,
      minHeight: minHeight,
      persistScrollGutter: persistScrollGutter,
      isExpanded: currentIsExpanded,
      editorDisabled: editorDisabled
    }, jsx(ContentArea, null, jsx("div", {
      className: "ak-editor-content-area"
    }, children)))));
  }, [children, editorView, persistScrollGutter, editorDisabled]);
  return jsx(WithPluginState, {
    plugins: {
      maxContentSize: maxContentSizePluginKey,
      mobileDimensions: mobileDimensionsPluginKey
    },
    render: render
  });
}