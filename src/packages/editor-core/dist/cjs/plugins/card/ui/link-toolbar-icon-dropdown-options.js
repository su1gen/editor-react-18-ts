"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIconDropdownOption = void 0;

var _messages = require("../messages");

var _card = require("./assets/card");

var _embed = require("./assets/embed");

var _inline = require("./assets/inline");

var _url = require("./assets/url");

var appearancePropsMap = {
  url: {
    title: _messages.messages.urlTitle,
    description: _messages.messages.urlDescription,
    icon: _url.IconUrl
  },
  inline: {
    title: _messages.messages.inlineTitle,
    description: _messages.messages.inlineDescription,
    icon: _inline.IconInline
  },
  block: {
    title: _messages.messages.blockTitle,
    description: _messages.messages.blockDescription,
    icon: _card.IconCard
  },
  embed: {
    title: _messages.messages.embedTitle,
    description: _messages.messages.embedDescription,
    icon: _embed.IconEmbed
  }
};

var getIconDropdownOption = function getIconDropdownOption(intl, dispatchCommand, _ref) {
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

exports.getIconDropdownOption = getIconDropdownOption;