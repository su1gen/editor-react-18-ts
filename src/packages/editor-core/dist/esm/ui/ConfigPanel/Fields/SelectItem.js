import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Avatar from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';
var itemWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n\n  small {\n    margin: 0;\n    display: block;\n    color: currentColor;\n  }\n"])));
var iconWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  line-height: 1;\n"])));
var iconWrapperMenu = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  align-self: flex-start;\n  margin-top: 3px;\n"])));

var getIconSize = function getIconSize(context, description) {
  if (context === 'value' || !description) {
    return 'xsmall';
  }

  return 'small';
};

export var formatOptionLabel = function formatOptionLabel(_ref, _ref2) {
  var label = _ref.label,
      icon = _ref.icon,
      description = _ref.description;
  var context = _ref2.context;
  return jsx("div", {
    css: itemWrapper
  }, jsx("span", {
    css: [iconWrapper, context === 'menu' && iconWrapperMenu]
  }, typeof icon === 'string' ? jsx(Avatar, {
    src: icon,
    size: getIconSize(context, description),
    appearance: "square"
  }) : icon), jsx("div", {
    style: {
      paddingLeft: icon ? gridSize() : 0
    }
  }, jsx("p", null, label, description && context !== 'value' && jsx("small", null, description))));
};