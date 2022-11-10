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
  const {
    inlineCard
  } = schema.nodes;
  const {
    url
  } = request;

  if (!isSafeUrl(url)) {
    return;
  } // replace all the outstanding links with their cards


  const pos = tr.mapping.map(request.pos);
  const $pos = tr.doc.resolve(pos);
  const node = tr.doc.nodeAt(pos);

  if (!node || !node.type.isText) {
    return;
  }

  const replaceLink = request.shouldReplaceLink || shouldReplaceLink(node, request.compareLinkText, url);

  if (!replaceLink) {
    return;
  } // ED-5638: add an extra space after inline cards to avoid re-rendering them


  const nodes = [cardAdf];

  if (cardAdf.type === inlineCard) {
    nodes.push(schema.text(' '));
  }

  tr.replaceWith(pos, pos + (node.text || url).length, nodes);
  return $pos.node($pos.depth - 1).type.name;
}

export const replaceQueuedUrlWithCard = (url, cardData, analyticsAction, createAnalyticsEvent) => (editorState, dispatch) => {
  const state = pluginKey.getState(editorState);

  if (!state) {
    return false;
  } // find the requests for this URL


  const requests = state.requests.filter(req => req.url === url); // try to transform response to ADF

  const schema = editorState.schema;
  const cardAdf = processRawValue(schema, cardData);
  let tr = editorState.tr;

  if (cardAdf) {
    // Should prevent any other node than cards? [inlineCard, blockCard].includes(cardAdf.type)
    const nodeContexts = requests.map(request => replaceLinksToCards(tr, cardAdf, schema, request)).filter(context => !!context); // context exist
    // Send analytics information

    if (nodeContexts.length) {
      const nodeContext = nodeContexts.every(context => context === nodeContexts[0]) ? nodeContexts[0] : 'mixed';
      /** For block links v1, default to inline links */

      const nodeType = 'inlineCard';
      const [,, domainName] = url.split('/');

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
          nodeType,
          nodeContext: nodeContext,
          domainName,
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
export const handleFallbackWithAnalytics = (url, source) => (editorState, dispatch) => {
  const state = pluginKey.getState(editorState);

  if (!state) {
    return false;
  }

  const tr = editorState.tr;
  addAnalytics(editorState, tr, getLinkCreationAnalyticsEvent(source, url));

  if (dispatch) {
    dispatch(resolveCard(url)(tr));
  }

  return true;
};
export const queueCardsFromChangedTr = (state, tr, source, normalizeLinkText = true) => {
  const {
    schema
  } = state;
  const {
    link
  } = schema.marks;
  const requests = [];
  nodesBetweenChanged(tr, (node, pos) => {
    if (!node.isText) {
      return true;
    }

    const linkMark = node.marks.find(mark => mark.type === link);

    if (linkMark) {
      if (!shouldReplaceLink(node, normalizeLinkText)) {
        return false;
      }

      requests.push({
        url: linkMark.attrs.href,
        pos,
        appearance: 'inline',
        compareLinkText: normalizeLinkText,
        source
      });
    }

    return false;
  });
  return queueCards(requests)(tr);
};
export const convertHyperlinkToSmartCard = (state, source, appearance, normalizeLinkText = true) => {
  const {
    schema
  } = state;
  const {
    link
  } = schema.marks;
  const requests = [];
  state.tr.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
    const linkMark = node.marks.find(mark => mark.type === link);

    if (linkMark) {
      const request = {
        url: linkMark.attrs.href,
        pos,
        appearance,
        compareLinkText: normalizeLinkText,
        source,
        analyticsAction: ACTION.CHANGED_TYPE,
        shouldReplaceLink: true
      };
      requests.push(request);
    }
  });
  return queueCards(requests)(state.tr);
};
export const changeSelectedCardToLink = (text, href, sendAnalytics, node, pos) => (state, dispatch) => {
  let tr;

  if (node && pos) {
    tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
  } else {
    tr = cardToLinkWithTransaction(state, text, href);
  }

  const selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (sendAnalytics) {
    if (selectedNode) {
      const {
        viewChangingExperimentToolbarStyle
      } = getFeatureFlags(state);
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
export const changeSelectedCardToLinkFallback = (text, href, sendAnalytics, node, pos) => (state, dispatch) => {
  let tr;

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
export const updateCard = href => (state, dispatch) => {
  const selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode) {
    return false;
  }

  const tr = cardToLinkWithTransaction(state, href, href);
  queueCardsFromChangedTr(state, tr, INPUT_METHOD.MANUAL);

  if (dispatch) {
    dispatch(tr.scrollIntoView());
  }

  return true;
};

function cardToLinkWithTransaction(state, text, href) {
  const selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode) {
    return state.tr;
  }

  const {
    link
  } = state.schema.marks;
  const url = selectedNode.attrs.url || selectedNode.attrs.data.url;
  const tr = state.tr.replaceSelectionWith(state.schema.text(text || url, [link.create({
    href: href || url
  })]), false);
  return tr;
}

function cardNodeToLinkWithTransaction(state, text, href, node, pos) {
  const {
    link
  } = state.schema.marks;
  const url = node.attrs.url || node.attrs.data.url;
  return state.tr.replaceWith(pos, pos + node.nodeSize, state.schema.text(text || url, [link.create({
    href: href || url
  })]));
}

export const changeSelectedCardToText = text => (state, dispatch) => {
  const selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode) {
    return false;
  }

  const tr = state.tr.replaceSelectionWith(state.schema.text(text), false);

  if (dispatch) {
    dispatch(addAnalytics(state, tr.scrollIntoView(), unlinkPayload(ACTION_SUBJECT_ID.CARD_INLINE)));
  }

  return true;
};
export const setSelectedCardAppearance = appearance => (state, dispatch) => {
  const selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode) {
    // When there is no selected node, we insert a new one
    // and replace the existing blue link
    const tr = convertHyperlinkToSmartCard(state, INPUT_METHOD.MANUAL, appearance);

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return false;
  }

  if (appearanceForNodeType(selectedNode.type) === appearance) {
    return false;
  }

  const isEmbed = appearance === 'embed';
  const attrs = isEmbed ? { ...selectedNode.attrs,
    layout: 'center'
  } : selectedNode.attrs;
  const {
    from
  } = state.selection;
  const nodeType = getLinkNodeType(appearance, state.schema.nodes);
  const tr = state.tr.setNodeMarkup(from, nodeType, attrs, selectedNode.marks);
  const {
    viewChangingExperimentToolbarStyle
  } = getFeatureFlags(state);
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

const getLinkNodeType = (appearance, linkNodes) => {
  switch (appearance) {
    case 'inline':
      return linkNodes.inlineCard;

    case 'block':
      return linkNodes.blockCard;

    case 'embed':
      return linkNodes.embedCard;
  }
};