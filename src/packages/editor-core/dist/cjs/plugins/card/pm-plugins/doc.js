"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCard = exports.setSelectedCardAppearance = exports.replaceQueuedUrlWithCard = exports.queueCardsFromChangedTr = exports.handleFallbackWithAnalytics = exports.convertHyperlinkToSmartCard = exports.changeSelectedCardToText = exports.changeSelectedCardToLinkFallback = exports.changeSelectedCardToLink = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorHistory = require("prosemirror-history");

var _pluginKey = require("./plugin-key");

var _actions = require("./actions");

var _utils = require("../utils");

var _utils2 = require("../../../utils");

var _analytics = require("../../../plugins/analytics");

var _adfSchema = require("@atlaskit/adf-schema");

var _utils3 = require("../../hyperlink/utils");

var _shouldReplaceLink = require("./shouldReplaceLink");

var _nodeEvents = require("../../../plugins/analytics/types/node-events");

var _analytics2 = require("../../../plugins/hyperlink/analytics");

var _linkingUtils = require("../../../utils/linking-utils");

var _featureFlagsContext = require("../../feature-flags-context");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Attempt to replace the link into the respective card.
 */
function replaceLinksToCards(tr, cardAdf, schema, request) {
  var inlineCard = schema.nodes.inlineCard;
  var url = request.url;

  if (!(0, _adfSchema.isSafeUrl)(url)) {
    return;
  } // replace all the outstanding links with their cards


  var pos = tr.mapping.map(request.pos);
  var $pos = tr.doc.resolve(pos);
  var node = tr.doc.nodeAt(pos);

  if (!node || !node.type.isText) {
    return;
  }

  var replaceLink = request.shouldReplaceLink || (0, _shouldReplaceLink.shouldReplaceLink)(node, request.compareLinkText, url);

  if (!replaceLink) {
    return;
  } // ED-5638: add an extra space after inline cards to avoid re-rendering them


  var nodes = [cardAdf];

  if (cardAdf.type === inlineCard) {
    nodes.push(schema.text(' '));
  }

  tr.replaceWith(pos, pos + (node.text || url).length, nodes);
  return $pos.node($pos.depth - 1).type.name;
}

var replaceQueuedUrlWithCard = function replaceQueuedUrlWithCard(url, cardData, analyticsAction, createAnalyticsEvent) {
  return function (editorState, dispatch) {
    var state = _pluginKey.pluginKey.getState(editorState);

    if (!state) {
      return false;
    } // find the requests for this URL


    var requests = state.requests.filter(function (req) {
      return req.url === url;
    }); // try to transform response to ADF

    var schema = editorState.schema;
    var cardAdf = (0, _utils2.processRawValue)(schema, cardData);
    var tr = editorState.tr;

    if (cardAdf) {
      // Should prevent any other node than cards? [inlineCard, blockCard].includes(cardAdf.type)
      var nodeContexts = requests.map(function (request) {
        return replaceLinksToCards(tr, cardAdf, schema, request);
      }).filter(function (context) {
        return !!context;
      }); // context exist
      // Send analytics information

      if (nodeContexts.length) {
        var nodeContext = nodeContexts.every(function (context) {
          return context === nodeContexts[0];
        }) ? nodeContexts[0] : 'mixed';
        /** For block links v1, default to inline links */

        var nodeType = 'inlineCard';

        var _url$split = url.split('/'),
            _url$split2 = (0, _slicedToArray2.default)(_url$split, 3),
            domainName = _url$split2[2];

        if (state.smartLinkEvents) {
          state.smartLinkEvents.insertSmartLink(domainName, 'inline', state.createAnalyticsEvent);
        }

        (0, _analytics.addAnalytics)(editorState, tr, {
          action: analyticsAction || _analytics.ACTION.INSERTED,
          actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.SMART_LINK,
          eventType: _analytics.EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: requests[0].source
            /* TODO: what if each request has a different source?
               unlikely, but need to define behaviour.
                ignore analytics event? take first? provide 'mixed' as well?*/
            ,
            nodeType: nodeType,
            nodeContext: nodeContext,
            domainName: domainName,
            fromCurrentDomain: (0, _utils3.isFromCurrentDomain)(url)
          }
        });
      }
    }

    if (dispatch) {
      dispatch((0, _actions.resolveCard)(url)((0, _prosemirrorHistory.closeHistory)(tr)));
    }

    return true;
  };
};

exports.replaceQueuedUrlWithCard = replaceQueuedUrlWithCard;

var handleFallbackWithAnalytics = function handleFallbackWithAnalytics(url, source) {
  return function (editorState, dispatch) {
    var state = _pluginKey.pluginKey.getState(editorState);

    if (!state) {
      return false;
    }

    var tr = editorState.tr;
    (0, _analytics.addAnalytics)(editorState, tr, (0, _analytics2.getLinkCreationAnalyticsEvent)(source, url));

    if (dispatch) {
      dispatch((0, _actions.resolveCard)(url)(tr));
    }

    return true;
  };
};

exports.handleFallbackWithAnalytics = handleFallbackWithAnalytics;

var queueCardsFromChangedTr = function queueCardsFromChangedTr(state, tr, source) {
  var normalizeLinkText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var schema = state.schema;
  var link = schema.marks.link;
  var requests = [];
  (0, _utils2.nodesBetweenChanged)(tr, function (node, pos) {
    if (!node.isText) {
      return true;
    }

    var linkMark = node.marks.find(function (mark) {
      return mark.type === link;
    });

    if (linkMark) {
      if (!(0, _shouldReplaceLink.shouldReplaceLink)(node, normalizeLinkText)) {
        return false;
      }

      requests.push({
        url: linkMark.attrs.href,
        pos: pos,
        appearance: 'inline',
        compareLinkText: normalizeLinkText,
        source: source
      });
    }

    return false;
  });
  return (0, _actions.queueCards)(requests)(tr);
};

exports.queueCardsFromChangedTr = queueCardsFromChangedTr;

var convertHyperlinkToSmartCard = function convertHyperlinkToSmartCard(state, source, appearance) {
  var normalizeLinkText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var schema = state.schema;
  var link = schema.marks.link;
  var requests = [];
  state.tr.doc.nodesBetween(state.selection.from, state.selection.to, function (node, pos) {
    var linkMark = node.marks.find(function (mark) {
      return mark.type === link;
    });

    if (linkMark) {
      var request = {
        url: linkMark.attrs.href,
        pos: pos,
        appearance: appearance,
        compareLinkText: normalizeLinkText,
        source: source,
        analyticsAction: _analytics.ACTION.CHANGED_TYPE,
        shouldReplaceLink: true
      };
      requests.push(request);
    }
  });
  return (0, _actions.queueCards)(requests)(state.tr);
};

exports.convertHyperlinkToSmartCard = convertHyperlinkToSmartCard;

var changeSelectedCardToLink = function changeSelectedCardToLink(text, href, sendAnalytics, node, pos) {
  return function (state, dispatch) {
    var tr;

    if (node && pos) {
      tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
    } else {
      tr = cardToLinkWithTransaction(state, text, href);
    }

    var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

    if (sendAnalytics) {
      if (selectedNode) {
        var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(state),
            viewChangingExperimentToolbarStyle = _getFeatureFlags.viewChangingExperimentToolbarStyle;

        (0, _analytics.addAnalytics)(state, tr, {
          action: _analytics.ACTION.CHANGED_TYPE,
          actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
          eventType: _analytics.EVENT_TYPE.TRACK,
          attributes: {
            newType: _nodeEvents.SMART_LINK_TYPE.URL,
            previousType: (0, _utils.appearanceForNodeType)(selectedNode.type),
            featureFlag: viewChangingExperimentToolbarStyle || 'noChange'
          }
        });
      }
    }

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

exports.changeSelectedCardToLink = changeSelectedCardToLink;

var changeSelectedCardToLinkFallback = function changeSelectedCardToLinkFallback(text, href, sendAnalytics, node, pos) {
  return function (state, dispatch) {
    var tr;

    if (node && pos) {
      tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
    } else {
      tr = cardToLinkWithTransaction(state, text, href);
    }

    if (sendAnalytics) {
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.ERRORED,
        actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          error: 'Smart card falling back to link.'
        }
      });
    }

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

exports.changeSelectedCardToLinkFallback = changeSelectedCardToLinkFallback;

var updateCard = function updateCard(href) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

    if (!selectedNode) {
      return false;
    }

    var tr = cardToLinkWithTransaction(state, href, href);
    queueCardsFromChangedTr(state, tr, _analytics.INPUT_METHOD.MANUAL);

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

exports.updateCard = updateCard;

function cardToLinkWithTransaction(state, text, href) {
  var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

  if (!selectedNode) {
    return state.tr;
  }

  var link = state.schema.marks.link;
  var url = selectedNode.attrs.url || selectedNode.attrs.data.url;
  var tr = state.tr.replaceSelectionWith(state.schema.text(text || url, [link.create({
    href: href || url
  })]), false);
  return tr;
}

function cardNodeToLinkWithTransaction(state, text, href, node, pos) {
  var link = state.schema.marks.link;
  var url = node.attrs.url || node.attrs.data.url;
  return state.tr.replaceWith(pos, pos + node.nodeSize, state.schema.text(text || url, [link.create({
    href: href || url
  })]));
}

var changeSelectedCardToText = function changeSelectedCardToText(text) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

    if (!selectedNode) {
      return false;
    }

    var tr = state.tr.replaceSelectionWith(state.schema.text(text), false);

    if (dispatch) {
      dispatch((0, _analytics.addAnalytics)(state, tr.scrollIntoView(), (0, _linkingUtils.unlinkPayload)(_analytics.ACTION_SUBJECT_ID.CARD_INLINE)));
    }

    return true;
  };
};

exports.changeSelectedCardToText = changeSelectedCardToText;

var setSelectedCardAppearance = function setSelectedCardAppearance(appearance) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

    if (!selectedNode) {
      // When there is no selected node, we insert a new one
      // and replace the existing blue link
      var _tr = convertHyperlinkToSmartCard(state, _analytics.INPUT_METHOD.MANUAL, appearance);

      if (dispatch) {
        dispatch(_tr.scrollIntoView());
      }

      return false;
    }

    if ((0, _utils.appearanceForNodeType)(selectedNode.type) === appearance) {
      return false;
    }

    var isEmbed = appearance === 'embed';
    var attrs = isEmbed ? _objectSpread(_objectSpread({}, selectedNode.attrs), {}, {
      layout: 'center'
    }) : selectedNode.attrs;
    var from = state.selection.from;
    var nodeType = getLinkNodeType(appearance, state.schema.nodes);
    var tr = state.tr.setNodeMarkup(from, nodeType, attrs, selectedNode.marks);

    var _getFeatureFlags2 = (0, _featureFlagsContext.getFeatureFlags)(state),
        viewChangingExperimentToolbarStyle = _getFeatureFlags2.viewChangingExperimentToolbarStyle;

    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.CHANGED_TYPE,
      actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        newType: appearance,
        previousType: (0, _utils.appearanceForNodeType)(selectedNode.type),
        featureFlag: viewChangingExperimentToolbarStyle || 'noChange'
      }
    });

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

exports.setSelectedCardAppearance = setSelectedCardAppearance;

var getLinkNodeType = function getLinkNodeType(appearance, linkNodes) {
  switch (appearance) {
    case 'inline':
      return linkNodes.inlineCard;

    case 'block':
      return linkNodes.blockCard;

    case 'embed':
      return linkNodes.embedCard;
  }
};