"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _avatarsWithPluginState = _interopRequireDefault(require("../../collab-edit/ui/avatars-with-plugin-state"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("../messages");

var _analytics = require("../../analytics");

var _templateObject, _templateObject2;

var toolbarButtonWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: flex-end;\n  flex-grow: 0;\n  align-items: center;\n  & > div {\n    margin-right: 0;\n  }\n"])));
var toolbarButtonWrapperFullWidth = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  flex-grow: 1;\n"])), toolbarButtonWrapper);

var AvatarGroupPluginWrapper = function AvatarGroupPluginWrapper(props) {
  var dispatchAnalyticsEvent = props.dispatchAnalyticsEvent;
  var intl = (0, _reactIntlNext.useIntl)();
  (0, _react.useEffect)(function () {
    if (!dispatchAnalyticsEvent) {
      return;
    }

    dispatchAnalyticsEvent({
      action: _analytics.ACTION.VIEWED,
      actionSubject: _analytics.ACTION_SUBJECT.BUTTON,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
      eventType: _analytics.EVENT_TYPE.UI
    });
  }, [dispatchAnalyticsEvent]);
  return (0, _react2.jsx)("div", {
    "aria-label": intl.formatMessage(_messages.avatarGroupMessages.editors),
    "data-testid": 'avatar-group-in-plugin',
    css: props.takeFullWidth ? toolbarButtonWrapperFullWidth : toolbarButtonWrapper
  }, (0, _react2.jsx)(_avatarsWithPluginState.default, {
    editorView: props.editorView,
    eventDispatcher: props.eventDispatcher,
    inviteToEditComponent: props.collabEdit && props.collabEdit.inviteToEditComponent,
    inviteToEditHandler: props.collabEdit && props.collabEdit.inviteToEditHandler,
    isInviteToEditButtonSelected: props.collabEdit && props.collabEdit.isInviteToEditButtonSelected
  }));
};

var _default = AvatarGroupPluginWrapper;
exports.default = _default;