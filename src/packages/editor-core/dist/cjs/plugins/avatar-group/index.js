"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _AvatarGroupPluginWrapper = _interopRequireDefault(require("./ui/AvatarGroupPluginWrapper"));

var avatarGroup = function avatarGroup(props) {
  return {
    name: 'avatarGroup',
    primaryToolbarComponent: function primaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          popupsMountPoint = _ref.popupsMountPoint,
          popupsBoundariesElement = _ref.popupsBoundariesElement,
          popupsScrollableElement = _ref.popupsScrollableElement,
          disabled = _ref.disabled,
          isToolbarReducedSpacing = _ref.isToolbarReducedSpacing,
          eventDispatcher = _ref.eventDispatcher,
          dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
      return /*#__PURE__*/_react.default.createElement(_AvatarGroupPluginWrapper.default, {
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        collabEdit: props.collabEdit,
        takeFullWidth: props.takeFullWidth
      });
    }
  };
};

var _default = avatarGroup;
exports.default = _default;