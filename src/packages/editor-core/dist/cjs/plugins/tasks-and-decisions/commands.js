"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSupportedSourceNode = exports.insertTaskDecisionWithAnalytics = exports.insertTaskDecisionCommand = exports.insertTaskDecisionAction = exports.getListTypes = exports.createListAtSelection = exports.changeInDepth = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorTransform = require("prosemirror-transform");

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../analytics");

var _gapCursorSelection = require("../selection/gap-cursor-selection");

var _pluginKey = require("./pm-plugins/plugin-key");

var _autojoin = require("../../utils/prosemirror/autojoin");

var getContextData = function getContextData() {
  var contextProvider = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var objectId = contextProvider.objectId,
      containerId = contextProvider.containerId;
  var userContext = objectId ? _analytics.USER_CONTEXT.EDIT : _analytics.USER_CONTEXT.NEW;
  return {
    objectId: objectId,
    containerId: containerId,
    userContext: userContext
  };
};

var generateAnalyticsPayload = function generateAnalyticsPayload(listType, contextData, inputMethod, itemLocalId, listLocalId, itemIdx, listSize) {
  var containerId;
  var objectId;
  var userContext;

  if (contextData) {
    containerId = contextData.containerId;
    objectId = contextData.objectId;
    userContext = contextData.userContext;
  }

  return {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: listType === 'taskList' ? _analytics.ACTION_SUBJECT_ID.ACTION : _analytics.ACTION_SUBJECT_ID.DECISION,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: inputMethod,
      containerAri: containerId,
      objectAri: objectId,
      userContext: userContext,
      localId: itemLocalId,
      listLocalId: listLocalId,
      position: itemIdx,
      listSize: listSize
    }
  };
};

var getListTypes = function getListTypes(listType, schema) {
  var _schema$nodes = schema.nodes,
      decisionList = _schema$nodes.decisionList,
      decisionItem = _schema$nodes.decisionItem,
      taskList = _schema$nodes.taskList,
      taskItem = _schema$nodes.taskItem;

  if (listType === 'taskList') {
    return {
      list: taskList,
      item: taskItem
    };
  }

  return {
    list: decisionList,
    item: decisionItem
  };
};

exports.getListTypes = getListTypes;

var insertTaskDecisionAction = function insertTaskDecisionAction(state, listType) {
  var inputMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _analytics.INPUT_METHOD.TOOLBAR;
  var addItem = arguments.length > 3 ? arguments[3] : undefined;
  var listLocalId = arguments.length > 4 ? arguments[4] : undefined;
  var itemLocalId = arguments.length > 5 ? arguments[5] : undefined;
  var schema = state.schema;

  var addAndCreateList = function addAndCreateList(_ref) {
    var tr = _ref.tr,
        list = _ref.list,
        item = _ref.item,
        listLocalId = _ref.listLocalId,
        itemLocalId = _ref.itemLocalId;
    return createListAtSelection(tr, list, item, schema, state, listLocalId, itemLocalId);
  };

  var addToList = function addToList(_ref2) {
    var state = _ref2.state,
        tr = _ref2.tr,
        item = _ref2.item,
        itemLocalId = _ref2.itemLocalId;
    var $to = state.selection.$to;
    var endPos = $to.end($to.depth);
    var newItemParagraphPos = endPos + 2;
    return tr.split(endPos, 1, [{
      type: item,
      attrs: {
        localId: itemLocalId
      }
    }]).setSelection(new _prosemirrorState.TextSelection(tr.doc.resolve(newItemParagraphPos)));
  };

  var addAndCreateListFn = addItem !== null && addItem !== void 0 ? addItem : addAndCreateList;
  var tr = insertTaskDecisionWithAnalytics(state, listType, inputMethod, addAndCreateListFn, addToList, listLocalId, itemLocalId);

  if (!tr) {
    return state.tr;
  }

  (0, _autojoin.autoJoinTr)(tr, ['taskList', 'decisionList']);
  return tr;
};

exports.insertTaskDecisionAction = insertTaskDecisionAction;

var insertTaskDecisionCommand = function insertTaskDecisionCommand(listType) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _analytics.INPUT_METHOD.TOOLBAR;
  var addItem = arguments.length > 2 ? arguments[2] : undefined;
  var listLocalId = arguments.length > 3 ? arguments[3] : undefined;
  var itemLocalId = arguments.length > 4 ? arguments[4] : undefined;
  return function (state, dispatch) {
    var tr = insertTaskDecisionAction(state, listType, inputMethod, addItem, listLocalId, itemLocalId);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.insertTaskDecisionCommand = insertTaskDecisionCommand;

var insertTaskDecisionWithAnalytics = function insertTaskDecisionWithAnalytics(state, listType, inputMethod, addAndCreateList, addToList, listLocalId, itemLocalId) {
  var schema = state.schema;

  var _getListTypes = getListTypes(listType, schema),
      list = _getListTypes.list,
      item = _getListTypes.item;

  var tr = state.tr;
  var $to = state.selection.$to;
  var listNode = (0, _prosemirrorUtils.findParentNodeOfType)(list)(state.selection);

  var contextIdentifierProvider = _pluginKey.stateKey.getState(state).contextIdentifierProvider;

  var contextData = getContextData(contextIdentifierProvider);
  var insertTrCreator;
  var itemIdx;
  var listSize;

  if (!listNode) {
    // Not a list - convert to one.
    itemIdx = 0;
    listSize = 1;
    insertTrCreator = addAndCreateList;
  } else if ($to.node().textContent.length >= 0) {
    listSize = listNode.node.childCount + 1;
    listLocalId = listLocalId || listNode.node.attrs.localId;
    var listItemNode = (0, _prosemirrorUtils.findParentNodeOfType)(item)(state.selection); // finds current item in list

    itemIdx = listItemNode ? state.doc.resolve(listItemNode.pos).index() + 1 : 0;
    insertTrCreator = addToList ? addToList : addAndCreateList;
  }

  listLocalId = listLocalId || _adfSchema.uuid.generate();
  itemLocalId = itemLocalId || _adfSchema.uuid.generate();

  if (insertTrCreator) {
    var insertTr = insertTrCreator({
      state: state,
      tr: tr,
      list: list,
      item: item,
      listLocalId: listLocalId,
      itemLocalId: itemLocalId
    });

    if (insertTr) {
      insertTr = (0, _analytics.addAnalytics)(state, insertTr, generateAnalyticsPayload(listType, contextData, inputMethod, itemLocalId, listLocalId, itemIdx || 0, listSize || 0));
    }

    return insertTr;
  }

  return null;
};

exports.insertTaskDecisionWithAnalytics = insertTaskDecisionWithAnalytics;

var isSupportedSourceNode = function isSupportedSourceNode(schema, selection) {
  var _schema$nodes2 = schema.nodes,
      paragraph = _schema$nodes2.paragraph,
      blockquote = _schema$nodes2.blockquote,
      decisionList = _schema$nodes2.decisionList,
      taskList = _schema$nodes2.taskList;
  return (0, _prosemirrorUtils.hasParentNodeOfType)([blockquote, paragraph, decisionList, taskList])(selection);
};

exports.isSupportedSourceNode = isSupportedSourceNode;

var changeInDepth = function changeInDepth(before, after) {
  return after.depth - before.depth;
};

exports.changeInDepth = changeInDepth;

var createListAtSelection = function createListAtSelection(tr, list, item, schema, state) {
  var listLocalId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _adfSchema.uuid.generate();
  var itemLocalId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _adfSchema.uuid.generate();
  var selection = state.selection;
  var $from = selection.$from,
      $to = selection.$to;

  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return null;
  }

  var _schema$nodes3 = schema.nodes,
      paragraph = _schema$nodes3.paragraph,
      blockquote = _schema$nodes3.blockquote,
      decisionList = _schema$nodes3.decisionList,
      taskList = _schema$nodes3.taskList,
      decisionItem = _schema$nodes3.decisionItem,
      taskItem = _schema$nodes3.taskItem,
      mediaGroup = _schema$nodes3.mediaGroup;

  if ($from.parent.type === mediaGroup) {
    return null;
  }

  var emptyList = list.create({
    localId: listLocalId
  }, [item.create({
    localId: itemLocalId
  })]); // we don't take the content of a block node next to the gap cursor and always create an empty task

  if (selection instanceof _gapCursorSelection.GapCursorSelection) {
    return (0, _prosemirrorUtils.safeInsert)(emptyList)(tr);
  } // try to replace when selection is in nodes which support it


  if (isSupportedSourceNode(schema, selection)) {
    var _selection$$from$node = selection.$from.node(),
        nodeType = _selection$$from$node.type,
        childCount = _selection$$from$node.childCount;

    var newListNode = list.create({
      localId: _adfSchema.uuid.generate()
    }, [item.create({
      localId: _adfSchema.uuid.generate()
    }, $from.node($from.depth).content)]);
    var hasBlockquoteParent = (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(selection);

    if (hasBlockquoteParent) {
      var liftedDepth = $from.depth - 1;
      var range = new _prosemirrorModel.NodeRange($from, $to, liftedDepth);
      tr.lift(range, (0, _prosemirrorTransform.liftTarget)(range));
    }

    var listParent = (0, _prosemirrorUtils.findParentNodeOfType)(taskList)(selection) || (0, _prosemirrorUtils.findParentNodeOfType)(decisionList)(selection);
    var listItem = (0, _prosemirrorUtils.findParentNodeOfType)(taskItem)(selection) || (0, _prosemirrorUtils.findParentNodeOfType)(decisionItem)(selection); // For a selection inside a task/decision list, we can't just simply replace the
    // node type as it will mess up lists with > 1 item

    if (listParent && listItem) {
      var start;
      var end;
      var selectionPos = selection.from; // if selection is in first item in list, we need to delete extra so that
      // this list isn't split

      if (listParent.node.firstChild === listItem.node) {
        start = listParent.start - 1;
        end = listItem.start + listItem.node.nodeSize;

        if (listParent.node.childCount === 1) {
          end = listParent.start + listParent.node.nodeSize - 1;
        }
      } else {
        start = listItem.start - 1;
        end = listItem.start + listItem.node.nodeSize;
        selectionPos += 2; // as we have added the new list node
      }

      tr.replaceWith(start, end, newListNode);
      tr = (0, _prosemirrorUtils.setTextSelection)(selectionPos)(tr);
      return tr;
    } // For a selection inside one of these node types we can just convert the node type


    var nodeTypesToReplace = [blockquote];

    if (nodeType === paragraph && childCount > 0 || hasBlockquoteParent) {
      // Only convert paragraphs containing content.
      // Empty paragraphs use the default flow.
      // This distinction ensures the text selection remains in the correct location.
      // We also want to replace the paragraph type when we are inside a blockQuote
      // to avoid inserting an extra taskList whilst keeping the paragraph
      nodeTypesToReplace.push(paragraph);
    }

    var newTr = tr;
    newTr = (0, _prosemirrorUtils.replaceParentNodeOfType)(nodeTypesToReplace, newListNode)(tr); // Adjust depth for new selection, if it has changed (e.g. paragraph to list (ol > li))

    var depthAdjustment = changeInDepth($to, newTr.selection.$to);
    tr = tr.setSelection(new _prosemirrorState.TextSelection(tr.doc.resolve($to.pos + depthAdjustment))); // replacing successful

    if (newTr !== tr) {
      return tr;
    }
  }

  return (0, _prosemirrorUtils.safeInsert)(emptyList)(tr);
};

exports.createListAtSelection = createListAtSelection;