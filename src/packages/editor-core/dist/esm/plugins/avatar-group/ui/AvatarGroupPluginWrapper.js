import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

/** @jsx jsx */
import { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import AvatarsWithPluginState from '../../collab-edit/ui/avatars-with-plugin-state';
import { useIntl } from 'react-intl-next';
import { avatarGroupMessages } from '../messages';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../analytics';
var toolbarButtonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  flex-grow: 0;\n  align-items: center;\n  & > div {\n    margin-right: 0;\n  }\n"])));
var toolbarButtonWrapperFullWidth = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ", "\n  flex-grow: 1;\n"])), toolbarButtonWrapper);

var AvatarGroupPluginWrapper = function AvatarGroupPluginWrapper(props) {
  var dispatchAnalyticsEvent = props.dispatchAnalyticsEvent;
  var intl = useIntl();
  useEffect(function () {
    if (!dispatchAnalyticsEvent) {
      return;
    }

    dispatchAnalyticsEvent({
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.BUTTON,
      actionSubjectId: ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
      eventType: EVENT_TYPE.UI
    });
  }, [dispatchAnalyticsEvent]);
  return jsx("div", {
    "aria-label": intl.formatMessage(avatarGroupMessages.editors),
    "data-testid": 'avatar-group-in-plugin',
    css: props.takeFullWidth ? toolbarButtonWrapperFullWidth : toolbarButtonWrapper
  }, jsx(AvatarsWithPluginState, {
    editorView: props.editorView,
    eventDispatcher: props.eventDispatcher,
    inviteToEditComponent: props.collabEdit && props.collabEdit.inviteToEditComponent,
    inviteToEditHandler: props.collabEdit && props.collabEdit.inviteToEditHandler,
    isInviteToEditButtonSelected: props.collabEdit && props.collabEdit.isInviteToEditButtonSelected
  }));
};

export default AvatarGroupPluginWrapper;