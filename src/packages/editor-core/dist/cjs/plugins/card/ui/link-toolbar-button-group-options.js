"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getButtonGroupOption = void 0;

var _messages = require("../messages");

var _card = require("./assets/card");

var _embed = require("./assets/embed");

var _inline = require("./assets/inline");

var _url = require("./assets/url");

var appearancePropsMap = {
  url: {
    title: _messages.messages.urlTitle,
    icon: _url.IconUrl
  },
  inline: {
    title: _messages.messages.inlineTitle,
    icon: _inline.IconInline
  },
  block: {
    title: _messages.messages.blockTitle,
    icon: _card.IconCard
  },
  embed: {
    title: _messages.messages.embedTitle,
    icon: _embed.IconEmbed
  }
};

var getButtonGroupOption = function getButtonGroupOption(intl, dispatchCommand, _ref) {
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

exports.getButtonGroupOption = getButtonGroupOption;