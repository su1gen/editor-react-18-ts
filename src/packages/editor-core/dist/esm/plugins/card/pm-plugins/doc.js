import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { NodeSelection } from 'prosemirror-state';
import { closeHistory } from 'prosemirror-history';
import { pluginKey } from './plugin-key';
import { queueCards, resolveCard } from './actions';
import { appearanceForNodeType } from '../utils';
import { nodesBetweenChanged, processRawValue } from '../../../utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../../../plugins/analytics';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { isFromCurrentDomain } from '../../hyperlink/utils';
import { shouldReplaceLink } from './shouldReplaceLink';
import { SMART_LINK_TYPE } from '../../../plugins/analytics/types/node-events';
import { getLinkCreationAnalyticsEvent } from '../../../plugins/hyperlink/analytics';
import { unlinkPayload } from '../../../utils/linking-utils';
import { getFeatureFlags } from '../../feature-flags-context';
/**
 * Attempt to replace the link into the respective card.
 */

function replaceLinksToCards(tr, cardAdf, schema, request) {
  var inlineCard = schema.nodes.inlineCard;
  var url = request.url;

  if (!isSafeUrl(url)) {
    return;
  } // replace all the outstanding links with their cards


  var pos = tr.mapping.map(request.pos);
  var $pos = tr.doc.resolve(pos);
  var node = tr.doc.nodeAt(pos);

  if (!node || !node.type.isText) {
    return;
  }

  var replaceLink = request.shouldReplaceLink || shouldReplaceLink(node, request.compareLinkText, url);

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

export var replaceQueuedUrlWithCard = function replaceQueuedUrlWithCard(url, cardData, analyticsAction, createAnalyticsEvent) {
  return function (editorState, dispatch) {
    var state = pluginKey.getState(editorState);

    if (!state) {
      return false;
    } // find the requests for this URL


    var requests = state.requests.filter(function (req) {
      return req.url === url;
    }); // try to transform response to ADF

    var schema = editorState.schema;
    var cardAdf = processRawValue(schema, cardData);
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
            _url$split2 = _slicedToArray(_url$split, 3),
            domainName = _url$split2[2];

        if (state.smartLinkEvents) {
          state.smartLinkEvents.insertSmartLink(domainName, 'inline', state.createAnalyticsEvent);
        }

        addAnalytics(editorState, tr, {
          action: analyticsAction || ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.SMART_LINK,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: requests[0].source
            /* TODO: what if each request has a different source?
               unlikely, but need to define behaviour.
                ignore analytics event? take first? provide 'mixed' as well?*/
            ,
            nodeType: nodeType,
            nodeContext: nodeContext,
            domainName: domainName,
            fromCurrentDomain: isFromCurrentDomain(url)
          }
        });
      }
    }

    if (dispatch) {
      dispatch(resolveCard(url)(closeHistory(tr)));
    }

    return true;
  };
};
export var handleFallbackWithAnalytics = function handleFallbackWithAnalytics(url, source) {
  return function (editorState, dispatch) {
    var state = pluginKey.getState(editorState);

    if (!state) {
      return false;
    }

    var tr = editorState.tr;
    addAnalytics(editorState, tr, getLinkCreationAnalyticsEvent(source, url));

    if (dispatch) {
      dispatch(resolveCard(url)(tr));
    }

    return true;
  };
};
export var queueCardsFromChangedTr = function queueCardsFromChangedTr(state, tr, source) {
  var normalizeLinkText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var schema = state.schema;
  var link = schema.marks.link;
  var requests = [];
  nodesBetweenChanged(tr, function (node, pos) {
    if (!node.isText) {
      return true;
    }

    var linkMark = node.marks.find(function (mark) {
      return mark.type === link;
    });

    if (linkMark) {
      if (!shouldReplaceLink(node, normalizeLinkText)) {
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
  return queueCards(requests)(tr);
};
export var convertHyperlinkToSmartCard = function convertHyperlinkToSmartCard(state, source, appearance) {
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
        analyticsAction: ACTION.CHANGED_TYPE,
        shouldReplaceLink: true
      };
      requests.push(request);
    }
  });
  return queueCards(requests)(state.tr);
};
export var changeSelectedCardToLink = function changeSelectedCardToLink(text, href, sendAnalytics, node, pos) {
  return function (state, dispatch) {
    var tr;

    if (node && pos) {
      tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
    } else {
      tr = cardToLinkWithTransaction(state, text, href);
    }

    var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

    if (sendAnalytics) {
      if (selectedNode) {
        var _getFeatureFlags = getFeatureFlags(state),
            viewChangingExperimentToolbarStyle = _getFeatureFlags.viewChangingExperimentToolbarStyle;

        addAnalytics(state, tr, {
          action: ACTION.CHANGED_TYPE,
          actionSubject: ACTION_SUBJECT.SMART_LINK,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            newType: SMART_LINK_TYPE.URL,
            previousType: appearanceForNodeType(selectedNode.type),
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
export var changeSelectedCardToLinkFallback = function changeSelectedCardToLinkFallback(text, href, sendAnalytics, node, pos) {
  return function (state, dispatch) {
    var tr;

    if (node && pos) {
      tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
    } else {
      tr = cardToLinkWithTransaction(state, text, href);
    }

    if (sendAnalytics) {
      addAnalytics(state, tr, {
        action: ACTION.ERRORED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        eventType: EVENT_TYPE.OPERATIONAL,
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
export var updateCard = function updateCard(href) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

    if (!selectedNode) {
      return false;
    }

    var tr = cardToLinkWithTransaction(state, href, href);
    queueCardsFromChangedTr(state, tr, INPUT_METHOD.MANUAL);

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

function cardToLinkWithTransaction(state, text, href) {
  var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

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

export var changeSelectedCardToText = function changeSelectedCardToText(text) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

    if (!selectedNode) {
      return false;
    }

    var tr = state.tr.replaceSelectionWith(state.schema.text(text), false);

    if (dispatch) {
      dispatch(addAnalytics(state, tr.scrollIntoView(), unlinkPayload(ACTION_SUBJECT_ID.CARD_INLINE)));
    }

    return true;
  };
};
export var setSelectedCardAppearance = function setSelectedCardAppearance(appearance) {
  return function (state, dispatch) {
    var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

    if (!selectedNode) {
      // When there is no selected node, we insert a new one
      // and replace the existing blue link
      var _tr = convertHyperlinkToSmartCard(state, INPUT_METHOD.MANUAL, appearance);

      if (dispatch) {
        dispatch(_tr.scrollIntoView());
      }

      return false;
    }

    if (appearanceForNodeType(selectedNode.type) === appearance) {
      return false;
    }

    var isEmbed = appearance === 'embed';
    var attrs = isEmbed ? _objectSpread(_objectSpread({}, selectedNode.attrs), {}, {
      layout: 'center'
    }) : selectedNode.attrs;
    var from = state.selection.from;
    var nodeType = getLinkNodeType(appearance, state.schema.nodes);
    var tr = state.tr.setNodeMarkup(from, nodeType, attrs, selectedNode.marks);

    var _getFeatureFlags2 = getFeatureFlags(state),
        viewChangingExperimentToolbarStyle = _getFeatureFlags2.viewChangingExperimentToolbarStyle;

    addAnalytics(state, tr, {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.SMART_LINK,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        newType: appearance,
        previousType: appearanceForNodeType(selectedNode.type),
        featureFlag: viewChangingExperimentToolbarStyle || 'noChange'
      }
    });

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

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