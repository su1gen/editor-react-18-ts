/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';
import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';
import ToolbarButton from '../../../ui/ToolbarButton';
import { inviteTeamWrapper } from './styles';

const ID = props => jsx(Fragment, null, props.children);

export const InviteToEditButton = props => {
  const {
    Component,
    onClick,
    selected,
    title
  } = props;
  const iconBefore = React.useMemo(() => jsx(InviteTeamIcon, {
    label: title
  }), [title]);

  if (!Component && !onClick) {
    return null;
  }

  const Wrapper = Component ? Component : ID;
  return jsx("div", {
    css: inviteTeamWrapper
  }, jsx(Wrapper, null, jsx(ToolbarButton, {
    className: "invite-to-edit",
    onClick: onClick,
    selected: selected,
    title: title,
    titlePosition: "bottom",
    iconBefore: iconBefore
  })));
};