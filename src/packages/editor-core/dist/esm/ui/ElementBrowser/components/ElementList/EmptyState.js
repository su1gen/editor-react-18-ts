import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import Button from '@atlaskit/button';
import NotFoundIllustration from './NotFoundIllustration';
import { token } from '@atlaskit/tokens';
export default function EmptyState(_ref) {
  var onExternalLinkClick = _ref.onExternalLinkClick;
  return jsx("div", {
    css: emptyStateWrapper
  }, jsx(NotFoundIllustration, null), jsx("div", {
    css: emptyStateHeading
  }, jsx(FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.heading",
    defaultMessage: "Nothing matches your search",
    description: "Empty state heading"
  })), jsx("div", {
    css: emptyStateSubHeading
  }, jsx("p", null, jsx(FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.sub-heading",
    defaultMessage: "Try searching with a different term or discover new apps for Atlassian products.",
    description: "Empty state sub-heading"
  })), jsx("div", {
    css: externalLinkWrapper
  }, jsx(Button, {
    appearance: "primary",
    target: "_blank",
    href: "https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence",
    onClick: onExternalLinkClick
  }, jsx(FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.sub-heading.link",
    defaultMessage: "Explore Atlassian Marketplace",
    description: "Empty state sub-heading external link"
  })))));
}
var emptyStateHeading = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  font-size: 1.42857em;\n  line-height: 1.2;\n  color: ", ";\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  margin-top: 28px;\n"])), token('color.text', 'rgb(23, 43, 77)'));
var emptyStateSubHeading = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-top: 16px;\n  max-width: 400px;\n  text-align: center;\n"])));
var emptyStateWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n"])));
var externalLinkWrapper = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  margin-top: 14px;\n"])));