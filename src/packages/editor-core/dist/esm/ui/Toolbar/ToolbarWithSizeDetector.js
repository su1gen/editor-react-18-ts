import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { WidthObserver } from '@atlaskit/width-detector';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { useElementWidth } from './hooks';
import { widthToToolbarSize, toolbarSizeToWidth } from './toolbar-size';
import { Toolbar } from './Toolbar';
import { ToolbarSize } from './types';
import { isFullPage } from '../../utils/is-full-page';
var toolbar = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 100%;\n  position: relative;\n  @media (max-width: ", "px) {\n    grid-column: 1 / 2;\n    grid-row: 2;\n    width: calc(100% - 30px);\n    margin: 0 15px;\n  }\n"])), akEditorMobileMaxWidth);
export var ToolbarWithSizeDetector = function ToolbarWithSizeDetector(props) {
  var ref = /*#__PURE__*/React.createRef();

  var _React$useState = React.useState(undefined),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      width = _React$useState2[0],
      setWidth = _React$useState2[1];

  var elementWidth = useElementWidth(ref, {
    skip: typeof width !== 'undefined'
  });
  var toolbarSize = typeof width === 'undefined' && typeof elementWidth === 'undefined' ? undefined : widthToToolbarSize(width || elementWidth, props.appearance);
  var toolbarStyle = useMemo(function () {
    var toolbarWidth = isFullPage(props.appearance) && props.twoLineEditorToolbar ? ToolbarSize.S : ToolbarSize.M;
    var toolbarMinWidth = toolbarSizeToWidth(toolbarWidth, props.appearance);
    var minWidth = "min-width: ".concat(props.hasMinWidth ? toolbarMinWidth : '254', "px");
    return [toolbar, minWidth];
  }, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);
  return jsx("div", {
    css: toolbarStyle
  }, jsx(WidthObserver, {
    setWidth: setWidth
  }), props.editorView && toolbarSize ? jsx(Toolbar, _extends({}, props, {
    toolbarSize: toolbarSize
  })) : jsx("div", {
    ref: ref
  }));
};