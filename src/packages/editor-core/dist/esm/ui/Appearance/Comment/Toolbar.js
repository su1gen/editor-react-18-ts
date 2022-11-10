import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { akEditorToolbarKeylineHeight, akEditorGridLineZIndex, akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
export var TableControlsPadding = 20;
var mainToolbarWrapperStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  align-items: center;\n  padding: ", "px ", "px 0;\n  display: flex;\n  height: auto;\n  background-color: ", ";\n  box-shadow: none;\n  padding-left: ", "px;\n\n  & > div {\n    > :first-child:not(style),\n    > style:first-child + * {\n      margin-left: 0;\n    }\n  }\n\n  .block-type-btn {\n    padding-left: 0;\n  }\n"])), gridSize(), gridSize(), token('elevation.surface', 'white'), TableControlsPadding);
var stickyToolbarWrapperStyle = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  /* stylelint-disable declaration-block-no-duplicate-properties */\n  position: relative;\n  position: sticky;\n  /* stylelint-enable declaration-block-no-duplicate-properties */\n  padding-bottom: ", "px;\n  z-index: ", ";\n  transition: box-shadow ease-in-out 0.2s;\n  &.show-keyline {\n    box-shadow: 0 ", "px 0 0\n      ", ";\n  }\n"])), gridSize(), akEditorGridLineZIndex + akEditorMenuZIndex, akEditorToolbarKeylineHeight, token('color.border', N30));

var StickyToolbar = function StickyToolbar(props) {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      top = _useState2[0],
      setTop = _useState2[1];

  useEffect(function () {
    var _props$externalToolba, _props$externalToolba2;

    setTop(((_props$externalToolba = props.externalToolbarRef) === null || _props$externalToolba === void 0 ? void 0 : (_props$externalToolba2 = _props$externalToolba.current) === null || _props$externalToolba2 === void 0 ? void 0 : _props$externalToolba2.clientHeight) || 0);
  }, [setTop, props.externalToolbarRef]);
  return jsx("div", {
    css: [mainToolbarWrapperStyle, stickyToolbarWrapperStyle, css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n          top: ", ";\n        "])), top)],
    "data-testid": "ak-editor-main-toolbar",
    className: 'show-keyline'
  }, props.children);
};

var FixedToolbar = function FixedToolbar(props) {
  return jsx("div", {
    css: mainToolbarWrapperStyle,
    "data-testid": "ak-editor-main-toolbar"
  }, props.children);
};

export var MainToolbar = function MainToolbar(_ref) {
  var useStickyToolbar = _ref.useStickyToolbar,
      children = _ref.children;

  if (!!useStickyToolbar) {
    return jsx(StickyToolbar, {
      externalToolbarRef: typeof useStickyToolbar === 'boolean' ? undefined : useStickyToolbar
    }, children);
  }

  return jsx(FixedToolbar, null, children);
};
export var mainToolbarCustomComponentsSlotStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  flex-grow: 1;\n  padding-right: ", "px;\n  > div {\n    display: flex;\n    flex-shrink: 0;\n  }\n"])), TableControlsPadding);