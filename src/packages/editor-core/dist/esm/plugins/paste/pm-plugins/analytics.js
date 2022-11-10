import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { ACTION, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, PasteTypes, PasteContents, withAnalytics } from '../../analytics';
import { getPasteSource } from '../util';
import { handlePasteAsPlainText, handlePasteIntoTaskOrDecisionOrPanel, handleCodeBlock, handleMediaSingle, handlePastePreservingMarks, handleMarkdown, handleRichText, handleExpandPasteInTable, handleSelectedTable, handlePasteLinkOnSelectedText, handlePasteIntoCaption, handlePastePanelIntoList } from '../handlers';
import { pipe } from '../../../utils';
import { findParentNode } from 'prosemirror-utils';
import { mapSlice } from '../../../utils/slice';
import { getLinkDomain } from '../../hyperlink/utils';
var contentToPasteContent = {
  url: PasteContents.url,
  paragraph: PasteContents.text,
  bulletList: PasteContents.bulletList,
  orderedList: PasteContents.orderedList,
  heading: PasteContents.heading,
  blockquote: PasteContents.blockquote,
  codeBlock: PasteContents.codeBlock,
  panel: PasteContents.panel,
  rule: PasteContents.rule,
  mediaSingle: PasteContents.mediaSingle,
  mediaCard: PasteContents.mediaCard,
  mediaGroup: PasteContents.mediaGroup,
  table: PasteContents.table,
  tableCells: PasteContents.tableCells,
  tableHeader: PasteContents.tableHeader,
  tableRow: PasteContents.tableRow,
  decisionList: PasteContents.decisionList,
  decisionItem: PasteContents.decisionItem,
  taskList: PasteContents.taskItem,
  extension: PasteContents.extension,
  bodiedExtension: PasteContents.bodiedExtension,
  blockCard: PasteContents.blockCard,
  layoutSection: PasteContents.layoutSection
};
var nodeToActionSubjectId = {
  blockquote: ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE,
  blockCard: ACTION_SUBJECT_ID.PASTE_BLOCK_CARD,
  bodiedExtension: ACTION_SUBJECT_ID.PASTE_BODIED_EXTENSION,
  bulletList: ACTION_SUBJECT_ID.PASTE_BULLET_LIST,
  codeBlock: ACTION_SUBJECT_ID.PASTE_CODE_BLOCK,
  decisionList: ACTION_SUBJECT_ID.PASTE_DECISION_LIST,
  extension: ACTION_SUBJECT_ID.PASTE_EXTENSION,
  heading: ACTION_SUBJECT_ID.PASTE_HEADING,
  mediaGroup: ACTION_SUBJECT_ID.PASTE_MEDIA_GROUP,
  mediaSingle: ACTION_SUBJECT_ID.PASTE_MEDIA_SINGLE,
  orderedList: ACTION_SUBJECT_ID.PASTE_ORDERED_LIST,
  panel: ACTION_SUBJECT_ID.PASTE_PANEL,
  rule: ACTION_SUBJECT_ID.PASTE_RULE,
  table: ACTION_SUBJECT_ID.PASTE_TABLE,
  tableCell: ACTION_SUBJECT_ID.PASTE_TABLE_CELL,
  tableHeader: ACTION_SUBJECT_ID.PASTE_TABLE_HEADER,
  tableRow: ACTION_SUBJECT_ID.PASTE_TABLE_ROW,
  taskList: ACTION_SUBJECT_ID.PASTE_TASK_LIST
};
export function getContent(state, slice) {
  var _state$schema = state.schema,
      paragraph = _state$schema.nodes.paragraph,
      link = _state$schema.marks.link;
  var nodeOrMarkName = new Set();
  slice.content.forEach(function (node) {
    if (node.type === paragraph && node.content.size === 0) {
      // Skip empty paragraph
      return;
    }

    if (node.type.name === 'text' && link.isInSet(node.marks)) {
      nodeOrMarkName.add('url');
      return;
    } // Check node contain link


    if (node.type === paragraph && node.rangeHasMark(0, node.nodeSize - 2, link)) {
      nodeOrMarkName.add('url');
      return;
    }

    nodeOrMarkName.add(node.type.name);
  });

  if (nodeOrMarkName.size > 1) {
    return PasteContents.mixed;
  }

  if (nodeOrMarkName.size === 0) {
    return PasteContents.uncategorized;
  }

  var type = nodeOrMarkName.values().next().value;
  var pasteContent = contentToPasteContent[type];
  return pasteContent ? pasteContent : PasteContents.uncategorized;
}

function getActionSubjectId(view) {
  var _view$state = view.state,
      selection = _view$state.selection,
      _view$state$schema$no = _view$state.schema.nodes,
      paragraph = _view$state$schema$no.paragraph,
      listItem = _view$state$schema$no.listItem,
      taskItem = _view$state$schema$no.taskItem,
      decisionItem = _view$state$schema$no.decisionItem;
  var parent = findParentNode(function (node) {
    if (node.type !== paragraph && node.type !== listItem && node.type !== taskItem && node.type !== decisionItem) {
      return true;
    }

    return false;
  })(selection);

  if (!parent) {
    return ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
  }

  var parentType = parent.node.type;
  var actionSubjectId = nodeToActionSubjectId[parentType.name];
  return actionSubjectId ? actionSubjectId : ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
}

function createPasteAsPlainPayload(actionSubjectId, text, linksInPasteCount) {
  return {
    action: ACTION.PASTED_AS_PLAIN,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      pasteSize: text.length,
      linksInPasteCount: linksInPasteCount
    }
  };
}

function createPastePayload(actionSubjectId, attributes, linkDomain) {
  return _objectSpread({
    action: ACTION.PASTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: _objectSpread({
      inputMethod: INPUT_METHOD.KEYBOARD
    }, attributes)
  }, linkDomain && linkDomain.length > 0 ? {
    nonPrivacySafeAttributes: {
      linkDomain: linkDomain
    }
  } : {});
}

export function createPasteAnalyticsPayload(view, event, slice, pasteContext) {
  var text = event.clipboardData ? event.clipboardData.getData('text/plain') || event.clipboardData.getData('text/uri-list') : '';
  var actionSubjectId = getActionSubjectId(view);
  var pasteSize = slice.size;
  var content = getContent(view.state, slice);
  var linkUrls = []; // If we have a link among the pasted content, grab the
  // domain and send it up with the analytics event

  if (content === PasteContents.url || content === PasteContents.mixed) {
    mapSlice(slice, function (node) {
      var linkMark = node.marks.find(function (mark) {
        return mark.type.name === 'link';
      });

      if (linkMark) {
        linkUrls.push(linkMark.attrs.href);
      }

      return node;
    });
  }

  if (pasteContext.asPlain) {
    return createPasteAsPlainPayload(actionSubjectId, text, linkUrls.length);
  }

  var source = getPasteSource(event);

  if (pasteContext.type === PasteTypes.plain) {
    return createPastePayload(actionSubjectId, {
      pasteSize: text.length,
      type: pasteContext.type,
      content: PasteContents.text,
      source: source,
      hyperlinkPasteOnText: false,
      linksInPasteCount: linkUrls.length
    });
  }

  var linkDomains = linkUrls.map(getLinkDomain);
  return createPastePayload(actionSubjectId, {
    type: pasteContext.type,
    pasteSize: pasteSize,
    content: content,
    source: source,
    hyperlinkPasteOnText: !!pasteContext.hyperlinkPasteOnText,
    linksInPasteCount: linkUrls.length
  }, linkDomains);
} // TODO: ED-6612 We should not dispatch only analytics, it's preferred to wrap each command with his own analytics.
// However, handlers like handleMacroAutoConvert dispatch multiple time,
// so pasteCommandWithAnalytics is useless in this case.

export function sendPasteAnalyticsEvent(view, event, slice, pasteContext) {
  var payload = createPasteAnalyticsPayload(view, event, slice, pasteContext);
  view.dispatch(addAnalytics(view.state, view.state.tr, payload));
}
export function pasteCommandWithAnalytics(view, event, slice, pasteContext) {
  return withAnalytics(function () {
    return createPasteAnalyticsPayload(view, event, slice, pasteContext);
  });
}
export var handlePasteAsPlainTextWithAnalytics = function handlePasteAsPlainTextWithAnalytics(view, event, slice) {
  return pipe(handlePasteAsPlainText, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.plain,
    asPlain: true
  }))(slice, event);
};
export var handlePasteIntoTaskAndDecisionWithAnalytics = function handlePasteIntoTaskAndDecisionWithAnalytics(view, event, slice, type) {
  return pipe(handlePasteIntoTaskOrDecisionOrPanel, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};
export var handlePasteIntoCaptionWithAnalytics = function handlePasteIntoCaptionWithAnalytics(view, event, slice, type) {
  return pipe(handlePasteIntoCaption, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};
export var handleCodeBlockWithAnalytics = function handleCodeBlockWithAnalytics(view, event, slice, text) {
  return pipe(handleCodeBlock, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.plain
  }))(text);
};
export var handleMediaSingleWithAnalytics = function handleMediaSingleWithAnalytics(view, event, slice, type) {
  return pipe(handleMediaSingle(INPUT_METHOD.CLIPBOARD), pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};
export var handlePastePreservingMarksWithAnalytics = function handlePastePreservingMarksWithAnalytics(view, event, slice, type) {
  return pipe(handlePastePreservingMarks, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};
export var handleMarkdownWithAnalytics = function handleMarkdownWithAnalytics(view, event, slice) {
  return pipe(handleMarkdown, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.markdown
  }))(slice);
};
export var handleRichTextWithAnalytics = function handleRichTextWithAnalytics(view, event, slice) {
  return pipe(handleRichText, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.richText
  }))(slice);
};
export var handlePastePanelIntoListWithAnalytics = function handlePastePanelIntoListWithAnalytics(view, event, slice) {
  return pipe(handlePastePanelIntoList, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.richText
  }))(slice);
};
export var handleExpandWithAnalytics = function handleExpandWithAnalytics(view, event, slice) {
  return pipe(handleExpandPasteInTable, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.richText
  }))(slice);
};
export var handleSelectedTableWithAnalytics = function handleSelectedTableWithAnalytics(view, event, slice) {
  return pipe(handleSelectedTable, pasteCommandWithAnalytics(view, event, slice, {
    type: PasteTypes.richText
  }))(slice);
};
export var handlePasteLinkOnSelectedTextWithAnalytics = function handlePasteLinkOnSelectedTextWithAnalytics(view, event, slice, type) {
  return pipe(handlePasteLinkOnSelectedText, pasteCommandWithAnalytics(view, event, slice, {
    type: type,
    hyperlinkPasteOnText: true
  }))(slice);
};
export var createPasteMeasurePayload = function createPasteMeasurePayload(_ref) {
  var view = _ref.view,
      duration = _ref.duration,
      content = _ref.content,
      distortedDuration = _ref.distortedDuration;
  var pasteIntoNode = getActionSubjectId(view);
  return {
    action: ACTION.PASTED_TIMED,
    actionSubject: ACTION_SUBJECT.EDITOR,
    eventType: EVENT_TYPE.OPERATIONAL,
    attributes: {
      pasteIntoNode: pasteIntoNode,
      content: content,
      time: duration,
      distortedDuration: distortedDuration
    }
  };
};
export var getContentNodeTypes = function getContentNodeTypes(content) {
  var nodeTypes = new Set();

  if (content.size) {
    content.forEach(function (node) {
      if (node.content && node.content.size) {
        nodeTypes = new Set([].concat(_toConsumableArray(nodeTypes), _toConsumableArray(getContentNodeTypes(node.content))));
      }

      nodeTypes.add(node.type.name);
    });
  }

  return Array.from(nodeTypes);
};