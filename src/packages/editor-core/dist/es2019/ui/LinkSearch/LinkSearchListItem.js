import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react'; // AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

import { fontSizeSmall } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { N20, N300, N800 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { getCorrectAltByIconUrl } from './listItemAlts';
import { transformTimeStamp } from './transformTimeStamp';
import { injectIntl } from 'react-intl-next';
export const container = css`
  background-color: transparent;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  margin-top: 0;
`;
export const containerSelected = css`
  background-color: ${token('color.background.neutral.subtle.hovered', N20)};
`;
const nameWrapper = css`
  overflow: hidden;
`;
export const nameStyle = css`
  color: ${token('color.text', N800)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
`;
export const containerName = css`
  color: ${token('color.text.subtlest', N300)};
  line-height: 14px;
  font-size: ${relativeFontSizeToBase16(fontSizeSmall())};
`;
const iconStyle = css`
  min-width: 16px;
  margin-top: 3px;
  margin-right: 12px;

  img {
    max-width: 16px;
  }
`;

class LinkSearchListItem extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleSelect", e => {
      e.preventDefault(); // don't let editor lose focus

      const {
        item,
        onSelect
      } = this.props;
      onSelect(item.url, item.name);
    });

    _defineProperty(this, "handleMouseMove", () => {
      const {
        onMouseMove,
        item
      } = this.props;
      onMouseMove && onMouseMove(item.objectId);
    });

    _defineProperty(this, "handleMouseEnter", () => {
      const {
        onMouseEnter,
        item
      } = this.props;
      onMouseEnter && onMouseEnter(item.objectId);
    });

    _defineProperty(this, "handleMouseLeave", () => {
      const {
        onMouseLeave,
        item
      } = this.props;
      onMouseLeave && onMouseLeave(item.objectId);
    });
  }

  renderIcon() {
    const {
      item: {
        icon,
        iconUrl
      },
      intl
    } = this.props;

    if (icon) {
      return jsx("span", {
        css: iconStyle
      }, icon);
    }

    if (iconUrl) {
      return jsx("span", {
        css: iconStyle
      }, jsx("img", {
        src: iconUrl,
        alt: getCorrectAltByIconUrl(iconUrl, intl)
      }));
    }

    return null;
  }

  renderTimeStamp() {
    const {
      item,
      intl
    } = this.props;
    const date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);
    return date && jsx(Fragment, null, "\xA0 \u2022", jsx("span", {
      className: "link-search-timestamp",
      "data-test-id": "link-search-timestamp"
    }, "\xA0 ", date.pageAction, " ", date.dateString, " ", date.timeSince || ''));
  }

  render() {
    const {
      item,
      selected,
      id,
      role
    } = this.props;
    return jsx("li", {
      css: [container, selected && containerSelected],
      role: role,
      id: id,
      "aria-selected": selected,
      "data-testid": "link-search-list-item",
      onMouseMove: this.handleMouseMove,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onClick: this.handleSelect
    }, this.renderIcon(), jsx("span", {
      css: nameWrapper
    }, jsx("div", {
      css: nameStyle
    }, item.name), jsx("div", {
      "data-testid": "link-search-list-item-container",
      css: containerName
    }, item.container, this.renderTimeStamp())));
  }

}

export default injectIntl(LinkSearchListItem);