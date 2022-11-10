import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from '@emotion/react';
import AddIcon from '@atlaskit/icon/glyph/add';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { useCallback, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl-next';
import { avatarStyle, capitalizedStyle, mentionItemStyle, nameSectionStyle, rowStyle, ROW_SIDE_PADDING, AVATAR_HEIGHT, mentionItemSelectedStyle } from './styles';
import { messages } from '../../messages';
export const INVITE_ITEM_MIN_HEIGHT = AVATAR_HEIGHT + ROW_SIDE_PADDING * 2;
export const INVITE_ITEM_DESCRIPTION = {
  id: 'invite-teammate'
};

const leftClick = event => {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

const InviteItem = ({
  productName,
  onMount,
  onMouseEnter,
  onSelection,
  selected,
  userRole,
  intl
}) => {
  const onSelected = useCallback(event => {
    if (leftClick(event) && onSelection) {
      event.preventDefault();
      onSelection(INVITE_ITEM_DESCRIPTION, event);
    }
  }, [onSelection]);
  const onItemMouseEnter = useCallback(event => {
    if (onMouseEnter) {
      onMouseEnter(INVITE_ITEM_DESCRIPTION, event);
    }
  }, [onMouseEnter]);
  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);
  return jsx("div", {
    css: [mentionItemStyle, selected && mentionItemSelectedStyle],
    onMouseDown: onSelected,
    onMouseEnter: onItemMouseEnter,
    "data-id": INVITE_ITEM_DESCRIPTION.id
  }, jsx("div", {
    css: rowStyle
  }, jsx("span", {
    css: avatarStyle
  }, jsx(AddIcon, {
    label: intl.formatMessage(messages.mentionsAddLabel),
    primaryColor: token('color.icon.subtle', N300)
  })), jsx("div", {
    css: nameSectionStyle,
    "data-testid": "name-section"
  }, jsx(FormattedMessage, _extends({}, messages.inviteItemTitle, {
    values: {
      userRole: userRole || 'basic',
      productName: jsx("span", {
        css: capitalizedStyle,
        "data-testid": "capitalized-message"
      }, productName)
    }
  })))));
};

export default injectIntl(InviteItem);