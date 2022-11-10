import React from 'react';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';

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
      return /*#__PURE__*/React.createElement(AvatarGroupPluginWrapper, {
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        collabEdit: props.collabEdit,
        takeFullWidth: props.takeFullWidth
      });
    }
  };
};

export default avatarGroup;