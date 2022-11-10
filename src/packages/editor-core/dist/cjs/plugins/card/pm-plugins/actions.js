"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showLinkToolbar = exports.setProvider = exports.resolveCard = exports.registerSmartCardEvents = exports.registerCard = exports.queueCards = exports.hideLinkToolbar = exports.cardAction = void 0;

var _pluginKey = require("./plugin-key");

var cardAction = function cardAction(tr, action) {
  return tr.setMeta(_pluginKey.pluginKey, action);
};

exports.cardAction = cardAction;

var resolveCard = function resolveCard(url) {
  return function (tr) {
    return cardAction(tr, {
      type: 'RESOLVE',
      url: url
    });
  };
};

exports.resolveCard = resolveCard;

var queueCards = function queueCards(requests) {
  return function (tr) {
    return cardAction(tr, {
      type: 'QUEUE',
      requests: requests
    });
  };
};

exports.queueCards = queueCards;

var registerCard = function registerCard(info) {
  return function (tr) {
    return cardAction(tr, {
      type: 'REGISTER',
      info: info
    });
  };
};

exports.registerCard = registerCard;

var registerSmartCardEvents = function registerSmartCardEvents(smartLinkEvents) {
  return function (tr) {
    return cardAction(tr, {
      type: 'REGISTER_EVENTS',
      smartLinkEvents: smartLinkEvents
    });
  };
};

exports.registerSmartCardEvents = registerSmartCardEvents;

var setProvider = function setProvider(cardProvider) {
  return function (tr) {
    return cardAction(tr, {
      type: 'SET_PROVIDER',
      provider: cardProvider
    });
  };
};

exports.setProvider = setProvider;

var showLinkToolbar = function showLinkToolbar(tr) {
  return cardAction(tr, {
    type: 'SHOW_LINK_TOOLBAR'
  });
};

exports.showLinkToolbar = showLinkToolbar;

var hideLinkToolbar = function hideLinkToolbar(tr) {
  return cardAction(tr, {
    type: 'HIDE_LINK_TOOLBAR'
  });
};

exports.hideLinkToolbar = hideLinkToolbar;