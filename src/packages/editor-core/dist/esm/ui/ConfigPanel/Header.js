import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

/** @jsx jsx */
import { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import Loadable from 'react-loadable';
import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { borderRadius } from '@atlaskit/theme/constants';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { messages } from './messages';
var iconWidth = 40;
var buttonWidth = 40;
var margin = 16;
var gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;
var item = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  margin-bottom: 24px;\n"])));
var itemIcon = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: ", "px;\n  height: ", "px;\n  overflow: hidden;\n  border: 1px solid ", "; /* N60 at 50% */\n  border-radius: ", "px;\n  box-sizing: border-box;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  div {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), iconWidth, iconWidth, token('color.border', 'rgba(223, 225, 229, 0.5)'), borderRadius(), iconWidth, iconWidth);
var itemBody = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n  margin: 0 16px;\n  flex-grow: 3;\n  max-width: calc(100% - ", "px);\n"])), gapSizeForEllipsis);
var centeredItemTitle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"])));
var itemText = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  max-width: 100%;\n  white-space: initial;\n  .item-summary {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 4px;\n\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n"])), relativeFontSizeToBase16(11.67), token('color.text.subtlest', N200));
var descriptionStyle = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  margin-bottom: 24px;\n"])));
var closeButtonWrapper = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  width: ", "px;\n  text-align: right;\n"])), buttonWidth);

var Header = function Header(_ref) {
  var icon = _ref.icon,
      title = _ref.title,
      description = _ref.description,
      summary = _ref.summary,
      documentationUrl = _ref.documentationUrl,
      onClose = _ref.onClose,
      intl = _ref.intl;
  var ResolvedIcon = Loadable({
    loader: icon,
    loading: function loading() {
      return null;
    }
  });
  return jsx(Fragment, null, jsx("div", {
    css: item
  }, jsx("div", {
    css: itemIcon
  }, jsx(ResolvedIcon, {
    label: title
  })), jsx("div", {
    css: itemBody
  }, summary ? jsx("div", {
    css: itemText
  }, jsx("div", {
    className: "item-title",
    id: "context-panel-title"
  }, title), jsx("div", {
    className: "item-summary"
  }, summary)) : jsx("div", {
    css: centeredItemTitle,
    id: "context-panel-title"
  }, title)), jsx("div", {
    css: closeButtonWrapper
  }, jsx(Button, {
    appearance: "subtle",
    iconBefore: jsx(CrossIcon, {
      label: intl.formatMessage(messages.close)
    }),
    onClick: onClose
  }))), (description || documentationUrl) && jsx("p", {
    css: descriptionStyle
  }, description && jsx(Fragment, null, description.replace(/([^.])$/, '$1.'), " "), documentationUrl && jsx("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: documentationUrl
  }, intl.formatMessage(messages.documentation))));
};

export default injectIntl(Header);