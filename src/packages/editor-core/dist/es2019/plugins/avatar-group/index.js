import React from 'react';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';

const avatarGroup = props => ({
  name: 'avatarGroup',

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
    eventDispatcher,
    dispatchAnalyticsEvent
  }) {
    return /*#__PURE__*/React.createElement(AvatarGroupPluginWrapper, {
      dispatchAnalyticsEvent: dispatchAnalyticsEvent,
      editorView: editorView,
      eventDispatcher: eventDispatcher,
      collabEdit: props.collabEdit,
      takeFullWidth: props.takeFullWidth
    });
  }

});

export default avatarGroup;