"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPasteAnalyticsPayload = createPasteAnalyticsPayload;
exports.createPasteMeasurePayload = void 0;
exports.getContent = getContent;
exports.handleSelectedTableWithAnalytics = exports.handleRichTextWithAnalytics = exports.handlePastePreservingMarksWithAnalytics = exports.handlePastePanelIntoListWithAnalytics = exports.handlePasteLinkOnSelectedTextWithAnalytics = exports.handlePasteIntoTaskAndDecisionWithAnalytics = exports.handlePasteIntoCaptionWithAnalytics = exports.handlePasteAsPlainTextWithAnalytics = exports.handleMediaSingleWithAnalytics = exports.handleMarkdownWithAnalytics = exports.handleExpandWithAnalytics = exports.handleCodeBlockWithAnalytics = exports.getContentNodeTypes = void 0;
exports.pasteCommandWithAnalytics = pasteCommandWithAnalytics;
exports.sendPasteAnalyticsEvent = sendPasteAnalyticsEvent;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _analytics = require("../../analytics");

var _util = require("../util");

var _handlers = require("../handlers");

var _utils = require("../../../utils");

var _prosemirrorUtils = require("prosemirror-utils");

var _slice = require("../../../utils/slice");

var _utils2 = require("../../hyperlink/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var contentToPasteContent = {
  url: _analytics.PasteContents.url,
  paragraph: _analytics.PasteContents.text,
  bulletList: _analytics.PasteContents.bulletList,
  orderedList: _analytics.PasteContents.orderedList,
  heading: _analytics.PasteContents.heading,
  blockquote: _analytics.PasteContents.blockquote,
  codeBlock: _analytics.PasteContents.codeBlock,
  panel: _analytics.PasteContents.panel,
  rule: _analytics.PasteContents.rule,
  mediaSingle: _analytics.PasteContents.mediaSingle,
  mediaCard: _analytics.PasteContents.mediaCard,
  mediaGroup: _analytics.PasteContents.mediaGroup,
  table: _analytics.PasteContents.table,
  tableCells: _analytics.PasteContents.tableCells,
  tableHeader: _analytics.PasteContents.tableHeader,
  tableRow: _analytics.PasteContents.tableRow,
  decisionList: _analytics.PasteContents.decisionList,
  decisionItem: _analytics.PasteContents.decisionItem,
  taskList: _analytics.PasteContents.taskItem,
  extension: _analytics.PasteContents.extension,
  bodiedExtension: _analytics.PasteContents.bodiedExtension,
  blockCard: _analytics.PasteContents.blockCard,
  layoutSection: _analytics.PasteContents.layoutSection
};
var nodeToActionSubjectId = {
  blockquote: _analytics.ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE,
  blockCard: _analytics.ACTION_SUBJECT_ID.PASTE_BLOCK_CARD,
  bodiedExtension: _analytics.ACTION_SUBJECT_ID.PASTE_BODIED_EXTENSION,
  bulletList: _analytics.ACTION_SUBJECT_ID.PASTE_BULLET_LIST,
  codeBlock: _analytics.ACTION_SUBJECT_ID.PASTE_CODE_BLOCK,
  decisionList: _analytics.ACTION_SUBJECT_ID.PASTE_DECISION_LIST,
  extension: _analytics.ACTION_SUBJECT_ID.PASTE_EXTENSION,
  heading: _analytics.ACTION_SUBJECT_ID.PASTE_HEADING,
  mediaGroup: _analytics.ACTION_SUBJECT_ID.PASTE_MEDIA_GROUP,
  mediaSingle: _analytics.ACTION_SUBJECT_ID.PASTE_MEDIA_SINGLE,
  orderedList: _analytics.ACTION_SUBJECT_ID.PASTE_ORDERED_LIST,
  panel: _analytics.ACTION_SUBJECT_ID.PASTE_PANEL,
  rule: _analytics.ACTION_SUBJECT_ID.PASTE_RULE,
  table: _analytics.ACTION_SUBJECT_ID.PASTE_TABLE,
  tableCell: _analytics.ACTION_SUBJECT_ID.PASTE_TABLE_CELL,
  tableHeader: _analytics.ACTION_SUBJECT_ID.PASTE_TABLE_HEADER,
  tableRow: _analytics.ACTION_SUBJECT_ID.PASTE_TABLE_ROW,
  taskList: _analytics.ACTION_SUBJECT_ID.PASTE_TASK_LIST
};

function getContent(state, slice) {
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
    return _analytics.PasteContents.mixed;
  }

  if (nodeOrMarkName.size === 0) {
    return _analytics.PasteContents.uncategorized;
  }

  var type = nodeOrMarkName.values().next().value;
  var pasteContent = contentToPasteContent[type];
  return pasteContent ? pasteContent : _analytics.PasteContents.uncategorized;
}

function getActionSubjectId(view) {
  var _view$state = view.state,
      selection = _view$state.selection,
      _view$state$schema$no = _view$state.schema.nodes,
      paragraph = _view$state$schema$no.paragraph,
      listItem = _view$state$schema$no.listItem,
      taskItem = _view$state$schema$no.taskItem,
      decisionItem = _view$state$schema$no.decisionItem;
  var parent = (0, _prosemirrorUtils.findParentNode)(function (node) {
    if (node.type !== paragraph && node.type !== listItem && node.type !== taskItem && node.type !== decisionItem) {
      return true;
    }

    return false;
  })(selection);

  if (!parent) {
    return _analytics.ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
  }

  var parentType = parent.node.type;
  var actionSubjectId = nodeToActionSubjectId[parentType.name];
  return actionSubjectId ? actionSubjectId : _analytics.ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
}

function createPasteAsPlainPayload(actionSubjectId, text, linksInPasteCount) {
  return {
    action: _analytics.ACTION.PASTED_AS_PLAIN,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: actionSubjectId,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.KEYBOARD,
      pasteSize: text.length,
      linksInPasteCount: linksInPasteCount
    }
  };
}

function createPastePayload(actionSubjectId, attributes, linkDomain) {
  return _objectSpread({
    action: _analytics.ACTION.PASTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: actionSubjectId,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: _objectSpread({
      inputMethod: _analytics.INPUT_METHOD.KEYBOARD
    }, attributes)
  }, linkDomain && linkDomain.length > 0 ? {
    nonPrivacySafeAttributes: {
      linkDomain: linkDomain
    }
  } : {});
}

function createPasteAnalyticsPayload(view, event, slice, pasteContext) {
  var text = event.clipboardData ? event.clipboardData.getData('text/plain') || event.clipboardData.getData('text/uri-list') : '';
  var actionSubjectId = getActionSubjectId(view);
  var pasteSize = slice.size;
  var content = getContent(view.state, slice);
  var linkUrls = []; // If we have a link among the pasted content, grab the
  // domain and send it up with the analytics event

  if (content === _analytics.PasteContents.url || content === _analytics.PasteContents.mixed) {
    (0, _slice.mapSlice)(slice, function (node) {
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

  var source = (0, _util.getPasteSource)(event);

  if (pasteContext.type === _analytics.PasteTypes.plain) {
    return createPastePayload(actionSubjectId, {
      pasteSize: text.length,
      type: pasteContext.type,
      content: _analytics.PasteContents.text,
      source: source,
      hyperlinkPasteOnText: false,
      linksInPasteCount: linkUrls.length
    });
  }

  var linkDomains = linkUrls.map(_utils2.getLinkDomain);
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


function sendPasteAnalyticsEvent(view, event, slice, pasteContext) {
  var payload = createPasteAnalyticsPayload(view, event, slice, pasteContext);
  view.dispatch((0, _analytics.addAnalytics)(view.state, view.state.tr, payload));
}

function pasteCommandWithAnalytics(view, event, slice, pasteContext) {
  return (0, _analytics.withAnalytics)(function () {
    return createPasteAnalyticsPayload(view, event, slice, pasteContext);
  });
}

var handlePasteAsPlainTextWithAnalytics = function handlePasteAsPlainTextWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handlePasteAsPlainText, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.plain,
    asPlain: true
  }))(slice, event);
};

exports.handlePasteAsPlainTextWithAnalytics = handlePasteAsPlainTextWithAnalytics;

var handlePasteIntoTaskAndDecisionWithAnalytics = function handlePasteIntoTaskAndDecisionWithAnalytics(view, event, slice, type) {
  return (0, _utils.pipe)(_handlers.handlePasteIntoTaskOrDecisionOrPanel, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};

exports.handlePasteIntoTaskAndDecisionWithAnalytics = handlePasteIntoTaskAndDecisionWithAnalytics;

var handlePasteIntoCaptionWithAnalytics = function handlePasteIntoCaptionWithAnalytics(view, event, slice, type) {
  return (0, _utils.pipe)(_handlers.handlePasteIntoCaption, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};

exports.handlePasteIntoCaptionWithAnalytics = handlePasteIntoCaptionWithAnalytics;

var handleCodeBlockWithAnalytics = function handleCodeBlockWithAnalytics(view, event, slice, text) {
  return (0, _utils.pipe)(_handlers.handleCodeBlock, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.plain
  }))(text);
};

exports.handleCodeBlockWithAnalytics = handleCodeBlockWithAnalytics;

var handleMediaSingleWithAnalytics = function handleMediaSingleWithAnalytics(view, event, slice, type) {
  return (0, _utils.pipe)((0, _handlers.handleMediaSingle)(_analytics.INPUT_METHOD.CLIPBOARD), pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};

exports.handleMediaSingleWithAnalytics = handleMediaSingleWithAnalytics;

var handlePastePreservingMarksWithAnalytics = function handlePastePreservingMarksWithAnalytics(view, event, slice, type) {
  return (0, _utils.pipe)(_handlers.handlePastePreservingMarks, pasteCommandWithAnalytics(view, event, slice, {
    type: type
  }))(slice);
};

exports.handlePastePreservingMarksWithAnalytics = handlePastePreservingMarksWithAnalytics;

var handleMarkdownWithAnalytics = function handleMarkdownWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handleMarkdown, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.markdown
  }))(slice);
};

exports.handleMarkdownWithAnalytics = handleMarkdownWithAnalytics;

var handleRichTextWithAnalytics = function handleRichTextWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handleRichText, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.richText
  }))(slice);
};

exports.handleRichTextWithAnalytics = handleRichTextWithAnalytics;

var handlePastePanelIntoListWithAnalytics = function handlePastePanelIntoListWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handlePastePanelIntoList, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.richText
  }))(slice);
};

exports.handlePastePanelIntoListWithAnalytics = handlePastePanelIntoListWithAnalytics;

var handleExpandWithAnalytics = function handleExpandWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handleExpandPasteInTable, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.richText
  }))(slice);
};

exports.handleExpandWithAnalytics = handleExpandWithAnalytics;

var handleSelectedTableWithAnalytics = function handleSelectedTableWithAnalytics(view, event, slice) {
  return (0, _utils.pipe)(_handlers.handleSelectedTable, pasteCommandWithAnalytics(view, event, slice, {
    type: _analytics.PasteTypes.richText
  }))(slice);
};

exports.handleSelectedTableWithAnalytics = handleSelectedTableWithAnalytics;

var handlePasteLinkOnSelectedTextWithAnalytics = function handlePasteLinkOnSelectedTextWithAnalytics(view, event, slice, type) {
  return (0, _utils.pipe)(_handlers.handlePasteLinkOnSelectedText, pasteCommandWithAnalytics(view, event, slice, {
    type: type,
    hyperlinkPasteOnText: true
  }))(slice);
};

exports.handlePasteLinkOnSelectedTextWithAnalytics = handlePasteLinkOnSelectedTextWithAnalytics;

var createPasteMeasurePayload = function createPasteMeasurePayload(_ref) {
  var view = _ref.view,
      duration = _ref.duration,
      content = _ref.content,
      distortedDuration = _ref.distortedDuration;
  var pasteIntoNode = getActionSubjectId(view);
  return {
    action: _analytics.ACTION.PASTED_TIMED,
    actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
    eventType: _analytics.EVENT_TYPE.OPERATIONAL,
    attributes: {
      pasteIntoNode: pasteIntoNode,
      content: content,
      time: duration,
      distortedDuration: distortedDuration
    }
  };
};

exports.createPasteMeasurePayload = createPasteMeasurePayload;

var getContentNodeTypes = function getContentNodeTypes(content) {
  var nodeTypes = new Set();

  if (content.size) {
    content.forEach(function (node) {
      if (node.content && node.content.size) {
        nodeTypes = new Set([].concat((0, _toConsumableArray2.default)(nodeTypes), (0, _toConsumableArray2.default)(getContentNodeTypes(node.content))));
      }

      nodeTypes.add(node.type.name);
    });
  }

  return Array.from(nodeTypes);
};

exports.getContentNodeTypes = getContentNodeTypes;