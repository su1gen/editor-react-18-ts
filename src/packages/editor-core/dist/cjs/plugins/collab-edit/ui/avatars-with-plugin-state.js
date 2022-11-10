"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _plugin = require("../plugin");

var _messages = _interopRequireDefault(require("../../../messages"));

var _avatars = require("./avatars");

var _inviteToEdit = require("./invite-to-edit");

var AvatarsWithPluginState = function AvatarsWithPluginState(props) {
  var title = props.intl.formatMessage(_messages.default.inviteToEditButtonTitle);
  var selected = props.isInviteToEditButtonSelected,
      onClick = props.inviteToEditHandler,
      Component = props.inviteToEditComponent,
      editorView = props.editorView;

  var render = _react.default.useCallback(function (_ref) {
    var data = _ref.data;

    if (!data) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_avatars.Avatars, {
      sessionId: data.sessionId,
      participants: data.activeParticipants,
      editorView: editorView
    }, /*#__PURE__*/_react.default.createElement(_inviteToEdit.InviteToEditButton, {
      title: title,
      selected: selected,
      onClick: onClick,
      Component: Component
    }));
  }, [selected, onClick, Component, title, editorView]);

  return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
    plugins: {
      data: _plugin.pluginKey
    },
    render: render,
    editorView: editorView
  });
};

var _default = (0, _reactIntlNext.injectIntl)(AvatarsWithPluginState);

exports.default = _default;