import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
export var MediaInlineNodeSelector = 'media-inline-node';
export var MediaSingleNodeSelector = 'media-single-node';
export var figureWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin: 0;\n"])));
var absoluteDiv = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n"])));
var forcedDimensions = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: 100%;\n  position: relative;\n"])));
export var MediaCardWrapper = function MediaCardWrapper(_ref) {
  var dimensions = _ref.dimensions,
      children = _ref.children,
      onContextMenu = _ref.onContextMenu;
  return jsx("div", {
    css: forcedDimensions,
    style: {
      paddingBottom: "".concat(dimensions.height / dimensions.width * 100, "%")
    },
    onContextMenuCapture: onContextMenu
  }, jsx("div", {
    css: absoluteDiv
  }, children));
};