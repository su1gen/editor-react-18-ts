import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import Icon from '@atlaskit/icon';

var IconUrlGlyph = function IconUrlGlyph(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "15",
    width: "20",
    height: "2",
    rx: "1",
    fill: "currentColor"
  }));
};

export var IconUrl = function IconUrl(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    glyph: IconUrlGlyph
  }, props));
};