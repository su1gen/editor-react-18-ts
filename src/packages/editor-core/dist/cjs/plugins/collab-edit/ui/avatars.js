"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Avatars = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _avatarGroup = _interopRequireDefault(require("@atlaskit/avatar-group"));

var _styles = require("./styles");

var _toAvatar = _interopRequireDefault(require("./to-avatar"));

var _utils = require("../utils");

var _featureFlagsContext = require("../../feature-flags-context");

/** @jsx jsx */
var Avatars = /*#__PURE__*/_react.default.memo(function (props) {
  var sessionId = props.sessionId,
      editorView = props.editorView;
  var participants = props.participants.toArray();
  var avatars = participants.sort(function (p) {
    return p.sessionId === sessionId ? -1 : 1;
  }).map(_toAvatar.default);

  if (!avatars.length) {
    return null;
  }

  return (0, _react2.jsx)("div", {
    css: _styles.avatarContainer
  }, (0, _react2.jsx)(_avatarGroup.default, {
    appearance: "stack",
    size: "medium",
    data: avatars,
    maxCount: 3,
    onAvatarClick: function onAvatarClick(_event, _analytics, index) {
      if (!editorView) {
        return;
      }

      var featureFlags = (0, _featureFlagsContext.getFeatureFlags)(editorView.state);
      var allowCollabAvatarScroll = featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.collabAvatarScroll; // user does not need to scroll to their own position (index 0)

      if (allowCollabAvatarScroll && index > 0) {
        (0, _utils.scrollToCollabCursor)(editorView, participants, props.sessionId, index);
      }
    }
  }), props.children);
});

exports.Avatars = Avatars;