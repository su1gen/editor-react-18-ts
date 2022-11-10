/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import Button from '@atlaskit/button';
import NotFoundIllustration from './NotFoundIllustration';
import { token } from '@atlaskit/tokens';
export default function EmptyState({
  onExternalLinkClick
}) {
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
const emptyStateHeading = css`
  font-size: 1.42857em;
  line-height: 1.2;
  color: ${token('color.text', 'rgb(23, 43, 77)')};
  font-weight: 500;
  letter-spacing: -0.008em;
  margin-top: 28px;
`;
const emptyStateSubHeading = css`
  margin-top: 16px;
  max-width: 400px;
  text-align: center;
`;
const emptyStateWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const externalLinkWrapper = css`
  margin-top: 14px;
`;