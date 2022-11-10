import { messages } from '../messages';
import { IconCard } from './assets/card';
import { IconEmbed } from './assets/embed';
import { IconInline } from './assets/inline';
import { IconUrl } from './assets/url';
var appearancePropsMap = {
  url: {
    title: messages.urlTitle,
    description: messages.urlDescription,
    icon: IconUrl
  },
  inline: {
    title: messages.inlineTitle,
    description: messages.inlineDescription,
    icon: IconInline
  },
  block: {
    title: messages.blockTitle,
    description: messages.blockDescription,
    icon: IconCard
  },
  embed: {
    title: messages.embedTitle,
    description: messages.embedDescription,
    icon: IconEmbed
  }
};
export var getIconDropdownOption = function getIconDropdownOption(intl, dispatchCommand, _ref) {
  var disabled = _ref.disabled,
      _onClick = _ref.onClick,
      selected = _ref.selected,
      appearance = _ref.appearance,
      testId = _ref.testId,
      tooltip = _ref.tooltip;
  var _appearancePropsMap = appearancePropsMap[appearance !== null && appearance !== void 0 ? appearance : 'url'],
      title = _appearancePropsMap.title,
      description = _appearancePropsMap.description,
      icon = _appearancePropsMap.icon;
  return {
    title: intl.formatMessage(title),
    description: intl.formatMessage(description),
    icon: icon,
    onClick: function onClick() {
      return dispatchCommand(_onClick);
    },
    selected: Boolean(selected),
    disabled: Boolean(disabled),
    tooltipContent: tooltip,
    testId: testId
  };
};