import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';
var spinnerWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: center;\n  margin-top: 64px;\n"])));

var LoadingState = function LoadingState() {
  return jsx("div", {
    css: spinnerWrapper
  }, jsx(Spinner, {
    size: "small"
  }));
};

export default LoadingState;