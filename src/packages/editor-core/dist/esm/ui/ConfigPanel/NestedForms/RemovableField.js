import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { gridSize } from '@atlaskit/theme/constants';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import { N80, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { messages } from '../messages';
var removableFieldWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  margin-bottom: 0;\n"])));
var wrapperWithMarginBottom = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-bottom: ", "px;\n"])), gridSize() * 2);
var removeButtonWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  position: absolute;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n\n  color: ", ";\n\n  &:hover {\n    color: ", ";\n  }\n"])), token('color.icon.subtle', N80), token('color.icon.danger', R300));

var RemovableField = function RemovableField(_ref) {
  var _children$props$field;

  var name = _ref.name,
      canRemoveField = _ref.canRemoveField,
      onClickRemove = _ref.onClickRemove,
      children = _ref.children,
      intl = _ref.intl,
      className = _ref.className;
  var onClickCallback = React.useCallback(function () {
    return onClickRemove && onClickRemove(name);
  }, [name, onClickRemove]);
  var hasMarginBottom = ((_children$props$field = children.props.field) === null || _children$props$field === void 0 ? void 0 : _children$props$field.type) !== 'expand';
  return jsx("div", {
    css: [removableFieldWrapper, hasMarginBottom && wrapperWithMarginBottom],
    className: className
  }, children, canRemoveField && jsx("div", {
    css: removeButtonWrapper,
    "data-testid": "remove-field-".concat(name),
    onClick: onClickCallback
  }, jsx(Tooltip, {
    content: intl.formatMessage(messages.removeField),
    position: "left"
  }, jsx(CrossCircleIcon, {
    size: "small",
    label: intl.formatMessage(messages.removeField)
  }))));
};

export default injectIntl(RemovableField);