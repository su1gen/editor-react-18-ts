import { NodeRange } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { findParentNodeOfType, hasParentNodeOfType, replaceParentNodeOfType, safeInsert, setTextSelection } from 'prosemirror-utils';
import { liftTarget } from 'prosemirror-transform';
import { uuid } from '@atlaskit/adf-schema';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD, USER_CONTEXT } from '../analytics';
import { GapCursorSelection } from '../selection/gap-cursor-selection';
import { stateKey as taskDecisionStateKey } from './pm-plugins/plugin-key';
import { autoJoinTr } from '../../utils/prosemirror/autojoin';

const getContextData = (contextProvider = {}) => {
  const {
    objectId,
    containerId
  } = contextProvider;
  const userContext = objectId ? USER_CONTEXT.EDIT : USER_CONTEXT.NEW;
  return {
    objectId,
    containerId,
    userContext
  };
};

const generateAnalyticsPayload = (listType, contextData, inputMethod, itemLocalId, listLocalId, itemIdx, listSize) => {
  let containerId;
  let objectId;
  let userContext;

  if (contextData) {
    ({
      containerId,
      objectId,
      userContext
    } = contextData);
  }

  return {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: listType === 'taskList' ? ACTION_SUBJECT_ID.ACTION : ACTION_SUBJECT_ID.DECISION,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod,
      containerAri: containerId,
      objectAri: objectId,
      userContext,
      localId: itemLocalId,
      listLocalId,
      position: itemIdx,
      listSize
    }
  };
};

export const getListTypes = (listType, schema) => {
  const {
    decisionList,
    decisionItem,
    taskList,
    taskItem
  } = schema.nodes;

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
export const insertTaskDecisionAction = (state, listType, inputMethod = INPUT_METHOD.TOOLBAR, addItem, listLocalId, itemLocalId) => {
  const {
    schema
  } = state;

  const addAndCreateList = ({
    tr,
    list,
    item,
    listLocalId,
    itemLocalId
  }) => createListAtSelection(tr, list, item, schema, state, listLocalId, itemLocalId);

  const addToList = ({
    state,
    tr,
    item,
    itemLocalId
  }) => {
    const {
      $to
    } = state.selection;
    const endPos = $to.end($to.depth);
    const newItemParagraphPos = endPos + 2;
    return tr.split(endPos, 1, [{
      type: item,
      attrs: {
        localId: itemLocalId
      }
    }]).setSelection(new TextSelection(tr.doc.resolve(newItemParagraphPos)));
  };

  const addAndCreateListFn = addItem !== null && addItem !== void 0 ? addItem : addAndCreateList;
  const tr = insertTaskDecisionWithAnalytics(state, listType, inputMethod, addAndCreateListFn, addToList, listLocalId, itemLocalId);

  if (!tr) {
    return state.tr;
  }

  autoJoinTr(tr, ['taskList', 'decisionList']);
  return tr;
};
export const insertTaskDecisionCommand = (listType, inputMethod = INPUT_METHOD.TOOLBAR, addItem, listLocalId, itemLocalId) => (state, dispatch) => {
  const tr = insertTaskDecisionAction(state, listType, inputMethod, addItem, listLocalId, itemLocalId);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};
export const insertTaskDecisionWithAnalytics = (state, listType, inputMethod, addAndCreateList, addToList, listLocalId, itemLocalId) => {
  const {
    schema
  } = state;
  const {
    list,
    item
  } = getListTypes(listType, schema);
  const {
    tr
  } = state;
  const {
    $to
  } = state.selection;
  const listNode = findParentNodeOfType(list)(state.selection);
  const contextIdentifierProvider = taskDecisionStateKey.getState(state).contextIdentifierProvider;
  const contextData = getContextData(contextIdentifierProvider);
  let insertTrCreator;
  let itemIdx;
  let listSize;

  if (!listNode) {
    // Not a list - convert to one.
    itemIdx = 0;
    listSize = 1;
    insertTrCreator = addAndCreateList;
  } else if ($to.node().textContent.length >= 0) {
    listSize = listNode.node.childCount + 1;
    listLocalId = listLocalId || listNode.node.attrs.localId;
    const listItemNode = findParentNodeOfType(item)(state.selection); // finds current item in list

    itemIdx = listItemNode ? state.doc.resolve(listItemNode.pos).index() + 1 : 0;
    insertTrCreator = addToList ? addToList : addAndCreateList;
  }

  listLocalId = listLocalId || uuid.generate();
  itemLocalId = itemLocalId || uuid.generate();

  if (insertTrCreator) {
    let insertTr = insertTrCreator({
      state,
      tr,
      list,
      item,
      listLocalId,
      itemLocalId
    });

    if (insertTr) {
      insertTr = addAnalytics(state, insertTr, generateAnalyticsPayload(listType, contextData, inputMethod, itemLocalId, listLocalId, itemIdx || 0, listSize || 0));
    }

    return insertTr;
  }

  return null;
};
export const isSupportedSourceNode = (schema, selection) => {
  const {
    paragraph,
    blockquote,
    decisionList,
    taskList
  } = schema.nodes;
  return hasParentNodeOfType([blockquote, paragraph, decisionList, taskList])(selection);
};
export const changeInDepth = (before, after) => after.depth - before.depth;
export const createListAtSelection = (tr, list, item, schema, state, listLocalId = uuid.generate(), itemLocalId = uuid.generate()) => {
  const {
    selection
  } = state;
  const {
    $from,
    $to
  } = selection;

  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return null;
  }

  const {
    paragraph,
    blockquote,
    decisionList,
    taskList,
    decisionItem,
    taskItem,
    mediaGroup
  } = schema.nodes;

  if ($from.parent.type === mediaGroup) {
    return null;
  }

  const emptyList = list.create({
    localId: listLocalId
  }, [item.create({
    localId: itemLocalId
  })]); // we don't take the content of a block node next to the gap cursor and always create an empty task

  if (selection instanceof GapCursorSelection) {
    return safeInsert(emptyList)(tr);
  } // try to replace when selection is in nodes which support it


  if (isSupportedSourceNode(schema, selection)) {
    const {
      type: nodeType,
      childCount
    } = selection.$from.node();
    const newListNode = list.create({
      localId: uuid.generate()
    }, [item.create({
      localId: uuid.generate()
    }, $from.node($from.depth).content)]);
    const hasBlockquoteParent = findParentNodeOfType(blockquote)(selection);

    if (hasBlockquoteParent) {
      const liftedDepth = $from.depth - 1;
      const range = new NodeRange($from, $to, liftedDepth);
      tr.lift(range, liftTarget(range));
    }

    const listParent = findParentNodeOfType(taskList)(selection) || findParentNodeOfType(decisionList)(selection);
    const listItem = findParentNodeOfType(taskItem)(selection) || findParentNodeOfType(decisionItem)(selection); // For a selection inside a task/decision list, we can't just simply replace the
    // node type as it will mess up lists with > 1 item

    if (listParent && listItem) {
      let start;
      let end;
      let selectionPos = selection.from; // if selection is in first item in list, we need to delete extra so that
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
      tr = setTextSelection(selectionPos)(tr);
      return tr;
    } // For a selection inside one of these node types we can just convert the node type


    const nodeTypesToReplace = [blockquote];

    if (nodeType === paragraph && childCount > 0 || hasBlockquoteParent) {
      // Only convert paragraphs containing content.
      // Empty paragraphs use the default flow.
      // This distinction ensures the text selection remains in the correct location.
      // We also want to replace the paragraph type when we are inside a blockQuote
      // to avoid inserting an extra taskList whilst keeping the paragraph
      nodeTypesToReplace.push(paragraph);
    }

    let newTr = tr;
    newTr = replaceParentNodeOfType(nodeTypesToReplace, newListNode)(tr); // Adjust depth for new selection, if it has changed (e.g. paragraph to list (ol > li))

    const depthAdjustment = changeInDepth($to, newTr.selection.$to);
    tr = tr.setSelection(new TextSelection(tr.doc.resolve($to.pos + depthAdjustment))); // replacing successful

    if (newTr !== tr) {
      return tr;
    }
  }

  return safeInsert(emptyList)(tr);
};