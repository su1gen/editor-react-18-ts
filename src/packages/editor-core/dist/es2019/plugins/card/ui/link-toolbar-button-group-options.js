import { messages } from '../messages';
import { IconCard } from './assets/card';
import { IconEmbed } from './assets/embed';
import { IconInline } from './assets/inline';
import { IconUrl } from './assets/url';
const appearancePropsMap = {
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
export const getButtonGroupOption = (intl, dispatchCommand, {
  disabled,
  onClick,
  selected,
  appearance,
  testId,
  tooltip
}) => {
  const {
    title,
    icon
  } = appearancePropsMap[appearance !== null && appearance !== void 0 ? appearance : 'url'];
  return {
    title: intl.formatMessage(title),
    icon,
    onClick: () => dispatchCommand(onClick),
    disabled: Boolean(disabled),
    tooltipContent: tooltip || null,
    testId,
    selected
  };
};