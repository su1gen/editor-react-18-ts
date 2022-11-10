import { messages } from '../messages';
import { IconCard } from './assets/card';
import { IconEmbed } from './assets/embed';
import { IconInline } from './assets/inline';
import { IconUrl } from './assets/url';
var appearancePropsMap = {
  url: {
    title: messages.urlTitle,
    icon: IconUrl
  },
  inline: {
    title: messages.inlineTitle,
    icon: IconInline
  },
  block: {
    title: messages.blockTitle,
    icon: IconCard
  },
  embed: {
    title: messages.embedTitle,
    icon: IconEmbed
  }
};
export var getButtonGroupOption = function getButtonGroupOption(intl, dispatchCommand, _ref) {
  var disabled = _ref.disabled,
      _onClick = _ref.onClick,
      selected = _ref.selected,
      appearance = _ref.appearance,
      testId = _ref.testId,
      tooltip = _ref.tooltip;
  var _appearancePropsMap = appearancePropsMap[appearance !== null && appearance !== void 0 ? appearance : 'url'],
      title = _appearancePropsMap.title,
      icon = _appearancePropsMap.icon;
  return {
    title: intl.formatMessage(title),
    icon: icon,
    onClick: function onClick() {
      return dispatchCommand(_onClick);
    },
    disabled: Boolean(disabled),
    tooltipContent: tooltip || null,
    testId: testId,
    selected: selected
  };
};