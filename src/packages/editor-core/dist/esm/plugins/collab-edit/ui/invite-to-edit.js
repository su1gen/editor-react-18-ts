/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';
import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';
import ToolbarButton from '../../../ui/ToolbarButton';
import { inviteTeamWrapper } from './styles';

var ID = function ID(props) {
  return jsx(Fragment, null, props.children);
};

export var InviteToEditButton = function InviteToEditButton(props) {
  var Component = props.Component,
      onClick = props.onClick,
      selected = props.selected,
      title = props.title;
  var iconBefore = React.useMemo(function () {
    return jsx(InviteTeamIcon, {
      label: title
    });
  }, [title]);

  if (!Component && !onClick) {
    return null;
  }

  var Wrapper = Component ? Component : ID;
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