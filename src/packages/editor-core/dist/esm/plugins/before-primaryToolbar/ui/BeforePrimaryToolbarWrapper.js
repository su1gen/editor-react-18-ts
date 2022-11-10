import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
var beforePrimaryToolbarPluginWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  margin-right: 8px;\n  flex-grow: 1;\n  justify-content: flex-end;\n  align-items: center;\n"])));
export var BeforePrimaryToolbarWrapper = function BeforePrimaryToolbarWrapper(props) {
  return jsx("div", {
    css: beforePrimaryToolbarPluginWrapper,
    "data-testid": 'before-primary-toolbar-components-plugin'
  }, props.beforePrimaryToolbarComponents);
};