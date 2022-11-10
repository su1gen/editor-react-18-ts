import { pluginKey } from './plugin-key';
export var cardAction = function cardAction(tr, action) {
  return tr.setMeta(pluginKey, action);
};
export var resolveCard = function resolveCard(url) {
  return function (tr) {
    return cardAction(tr, {
      type: 'RESOLVE',
      url: url
    });
  };
};
export var queueCards = function queueCards(requests) {
  return function (tr) {
    return cardAction(tr, {
      type: 'QUEUE',
      requests: requests
    });
  };
};
export var registerCard = function registerCard(info) {
  return function (tr) {
    return cardAction(tr, {
      type: 'REGISTER',
      info: info
    });
  };
};
export var registerSmartCardEvents = function registerSmartCardEvents(smartLinkEvents) {
  return function (tr) {
    return cardAction(tr, {
      type: 'REGISTER_EVENTS',
      smartLinkEvents: smartLinkEvents
    });
  };
};
export var setProvider = function setProvider(cardProvider) {
  return function (tr) {
    return cardAction(tr, {
      type: 'SET_PROVIDER',
      provider: cardProvider
    });
  };
};
export var showLinkToolbar = function showLinkToolbar(tr) {
  return cardAction(tr, {
    type: 'SHOW_LINK_TOOLBAR'
  });
};
export var hideLinkToolbar = function hideLinkToolbar(tr) {
  return cardAction(tr, {
    type: 'HIDE_LINK_TOOLBAR'
  });
};