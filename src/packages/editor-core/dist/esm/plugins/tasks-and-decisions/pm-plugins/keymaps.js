import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { autoJoin, chainCommands } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { Fragment, Slice } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { findParentNodeOfType, findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { uuid } from '@atlaskit/adf-schema';
import { filter, isEmptySelectionAtStart, deleteEmptyParagraphAndMoveBlockUp, isEmptySelectionAtEnd } from '../../../utils/commands';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INDENT_DIRECTION, INDENT_TYPE, INPUT_METHOD, withAnalytics } from '../../analytics';
import { insertTaskDecisionWithAnalytics } from '../commands';
import { joinAtCut, liftSelection, wrapSelectionInTaskList } from './commands';
import { getBlockRange, getCurrentIndentLevel, isActionOrDecisionItem, isActionOrDecisionList, isEmptyTaskDecision, isInsideTask, isInsideTaskOrDecisionItem, liftBlock, subtreeHeight, walkOut, getTaskItemIndex, isInsideDecision, isTable } from './helpers';

var indentationAnalytics = function indentationAnalytics(curIndentLevel, direction, inputMethod) {
  return {
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: inputMethod,
      previousIndentationLevel: curIndentLevel,
      newIndentLevel: direction === INDENT_DIRECTION.OUTDENT ? curIndentLevel - 1 : curIndentLevel + 1,
      direction: direction,
      indentType: INDENT_TYPE.TASK_LIST
    }
  };
};

var nodeAfter = function nodeAfter($pos) {
  return $pos.doc.resolve($pos.end()).nodeAfter;
};

var actionDecisionFollowsOrNothing = function actionDecisionFollowsOrNothing($pos) {
  var after = nodeAfter($pos);
  return !after || isActionOrDecisionItem(after);
};

var joinTaskDecisionFollowing = function joinTaskDecisionFollowing(state, dispatch) {
  // only run if selection is at end of text, and inside a task or decision item
  if (!isEmptySelectionAtEnd(state) || !isInsideTaskOrDecisionItem(state) || !dispatch) {
    return false;
  } // look for the node after this current one


  var $next = walkOut(state.selection.$from); // if there's no taskItem or taskList following, then
  // we just do the normal behaviour

  var _state$schema$nodes = state.schema.nodes,
      taskList = _state$schema$nodes.taskList,
      taskItem = _state$schema$nodes.taskItem,
      decisionList = _state$schema$nodes.decisionList,
      decisionItem = _state$schema$nodes.decisionItem,
      paragraph = _state$schema$nodes.paragraph,
      bulletList = _state$schema$nodes.bulletList,
      orderedList = _state$schema$nodes.orderedList,
      listItem = _state$schema$nodes.listItem;
  var parentList = findParentNodeOfTypeClosestToPos($next, [taskList, taskItem, decisionList, decisionItem]);

  if (!parentList) {
    if ($next.parent.type === paragraph) {
      // try to join paragraph and taskList when backspacing
      return joinAtCut($next.doc.resolve($next.pos))(state, dispatch);
    } // If the item we are joining is a list


    if ($next.parent.type === bulletList || $next.parent.type === orderedList) {
      // If the list has an item
      if ($next.parent.firstChild && $next.parent.firstChild.type === listItem) {
        // Place the cursor at the first listItem
        var resolvedStartPos = state.doc.resolve($next.pos + 1); // Unindent the first listItem.
        // As if placing your cursor just after the first dot of the list (before the text)
        // and pressing Shift-Tab.

        var tr = liftBlock(state.tr, resolvedStartPos, resolvedStartPos); // If autoJoin not used, two ul/ol elements appear rather than one with multiple li elements

        return autoJoin(function (state, dispatch) {
          if (tr) {
            if (dispatch) {
              dispatch(tr);
            }

            return true;
          }

          return false;
        }, ['bulletList', 'orderedList'])(state, dispatch);
      }
    }
  }

  return false;
};

export var getUnindentCommand = function getUnindentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return filter(isInsideTask, function (state, dispatch) {
    var curIndentLevel = getCurrentIndentLevel(state.selection);

    if (!curIndentLevel || curIndentLevel === 1) {
      return false;
    }

    return withAnalytics(indentationAnalytics(curIndentLevel, INDENT_DIRECTION.OUTDENT, inputMethod))(autoJoin(liftSelection, ['taskList']))(state, dispatch);
  });
}; // if selection is decision item or first action item in table cell
// then dont consume the Tab, as table-keymap should tab to the next cell

var shouldLetTabThroughInTable = function shouldLetTabThroughInTable(state) {
  var curIndentLevel = getCurrentIndentLevel(state.selection);
  var curIndex = getTaskItemIndex(state);
  var _state$schema$nodes2 = state.schema.nodes,
      tableCell = _state$schema$nodes2.tableCell,
      tableHeader = _state$schema$nodes2.tableHeader;
  var cell = findParentNodeOfType([tableCell, tableHeader])(state.selection);

  if ((curIndentLevel === 1 && curIndex === 0 || isInsideDecision(state)) && cell) {
    return true;
  }

  return false;
};

export var getIndentCommand = function getIndentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return filter(isInsideTask, function (state, dispatch) {
    // limit ui indentation to 6 levels
    var curIndentLevel = getCurrentIndentLevel(state.selection);

    if (!curIndentLevel || curIndentLevel >= 6) {
      return true;
    }

    var _state$schema$nodes3 = state.schema.nodes,
        taskList = _state$schema$nodes3.taskList,
        taskItem = _state$schema$nodes3.taskItem;
    var _state$selection = state.selection,
        $from = _state$selection.$from,
        $to = _state$selection.$to;
    var maxDepth = subtreeHeight($from, $to, [taskList, taskItem]);

    if (maxDepth >= 6) {
      return true;
    }

    return withAnalytics(indentationAnalytics(curIndentLevel, INDENT_DIRECTION.INDENT, inputMethod))(autoJoin(wrapSelectionInTaskList, ['taskList']))(state, dispatch);
  });
};

var backspaceFrom = function backspaceFrom($from) {
  return function (state, dispatch) {
    // previous was empty, just delete backwards
    var taskBefore = $from.doc.resolve($from.before());

    if (taskBefore.nodeBefore && isActionOrDecisionItem(taskBefore.nodeBefore) && taskBefore.nodeBefore.nodeSize === 2) {
      return false;
    } // if nested, just unindent


    var _state$schema$nodes4 = state.schema.nodes,
        taskList = _state$schema$nodes4.taskList,
        paragraph = _state$schema$nodes4.paragraph;

    if ($from.node($from.depth - 2).type === taskList) {
      return getUnindentCommand()(state, dispatch);
    } // bottom level, should "unwrap" taskItem contents into paragraph
    // we achieve this by slicing the content out, and replacing


    if (actionDecisionFollowsOrNothing($from)) {
      if (dispatch) {
        var taskContent = state.doc.slice($from.start(), $from.end()).content; // might be end of document after

        var slice = taskContent.size ? paragraph.createChecked(undefined, taskContent) : paragraph.createChecked();
        dispatch(splitListItemWith(state.tr, slice, $from, true));
      }

      return true;
    }

    return false;
  };
};

var backspace = filter(isEmptySelectionAtStart, autoJoin(chainCommands(function (state, dispatch) {
  return joinAtCut(state.selection.$from)(state, dispatch);
}, filter(isInsideTaskOrDecisionItem, function (state, dispatch) {
  return backspaceFrom(state.selection.$from)(state, dispatch);
})), ['taskList', 'decisionList']));

var unindentTaskOrUnwrapTaskDecisionFollowing = function unindentTaskOrUnwrapTaskDecisionFollowing(state, dispatch) {
  var $from = state.selection.$from,
      _state$schema$nodes5 = state.schema.nodes,
      taskList = _state$schema$nodes5.taskList,
      doc = _state$schema$nodes5.doc,
      paragraph = _state$schema$nodes5.paragraph,
      tr = state.tr; // only run if cursor is at the end of the node

  if (!isEmptySelectionAtEnd(state) || !dispatch) {
    return false;
  } // look for the node after this current one


  var $next = walkOut($from); // this is a top-level node it wont have $next.before()

  if (!$next.parent || $next.parent.type === doc) {
    return false;
  } // if nested, just unindent


  if ($next.node($next.depth - 2).type === taskList || // this is for the case when we are on a non-nested item and next one is nested
  $next.node($next.depth - 1).type === taskList && $next.parent.type === taskList) {
    liftBlock(tr, $next, $next);
    dispatch(tr);
    return true;
  } // if next node is of same type, remove the node wrapping and create paragraph


  if (!isTable($next.nodeAfter) && isActionOrDecisionItem($from.parent) && actionDecisionFollowsOrNothing($from) && // only forward delete if the node is same type
  $next.node().type.name === $from.node().type.name) {
    var taskContent = state.doc.slice($next.start(), $next.end()).content; // might be end of document after

    var slice = taskContent.size ? paragraph.createChecked(undefined, taskContent) : [];
    dispatch(splitListItemWith(tr, slice, $next, false));
    return true;
  }

  return false;
};

var deleteForwards = autoJoin(chainCommands(deleteEmptyParagraphAndMoveBlockUp(isActionOrDecisionList), joinTaskDecisionFollowing, unindentTaskOrUnwrapTaskDecisionFollowing), ['taskList', 'decisionList']);

var splitListItemWith = function splitListItemWith(tr, content, $from, setSelection) {
  var origDoc = tr.doc; // split just before the current item
  // we can only split if there was a list item before us

  var container = $from.node($from.depth - 2);
  var posInList = $from.index($from.depth - 1);
  var shouldSplit = !(!isActionOrDecisionList(container) && posInList === 0);

  if (shouldSplit) {
    // this only splits a node to delete it, so we probably don't need a random uuid
    // but generate one anyway for correctness
    tr = tr.split($from.pos, 1, [{
      type: $from.parent.type,
      attrs: {
        localId: uuid.generate()
      }
    }]);
  } // and delete the action at the current pos
  // we can do this because we know either first new child will be taskItem or nothing at all


  var frag = Fragment.from(content);
  tr = tr.replace(tr.mapping.map($from.start() - 2), tr.mapping.map($from.end() + 2), frag.size ? new Slice(frag, 0, 0) : Slice.empty); // put cursor inside paragraph

  if (setSelection) {
    tr = tr.setSelection(new TextSelection(tr.doc.resolve($from.pos + 1 - (shouldSplit ? 0 : 2))));
  } // lift list up if the node after the initial one was a taskList
  // which means it would have empty placeholder content if we just immediately delete it
  //
  // if it's a taskItem then it can stand alone, so it's fine


  var $oldAfter = origDoc.resolve($from.after()); // if different levels then we shouldn't lift

  if ($oldAfter.depth === $from.depth - 1) {
    if ($oldAfter.nodeAfter && isActionOrDecisionList($oldAfter.nodeAfter)) {
      // getBlockRange expects to be inside the taskItem
      var pos = tr.mapping.map($oldAfter.pos + 2);
      var $after = tr.doc.resolve(pos);
      var blockRange = getBlockRange($after, tr.doc.resolve($after.after($after.depth - 1) - 1));

      if (blockRange) {
        tr = tr.lift(blockRange, blockRange.depth - 1).scrollIntoView();
      } // we delete 1 past the range of the empty taskItem
      // otherwise we hit a bug in prosemirror-transform:
      // Cannot read property 'content' of undefined


      tr = tr.deleteRange(pos - 3, pos - 1);
    }
  }

  return tr;
};

var splitListItem = function splitListItem(state, dispatch) {
  var tr = state.tr,
      $from = state.selection.$from;
  var paragraph = state.schema.nodes.paragraph;

  if (actionDecisionFollowsOrNothing($from)) {
    if (dispatch) {
      dispatch(splitListItemWith(tr, paragraph.createChecked(), $from, true));
    }

    return true;
  }

  return false;
};

var enter = filter(isInsideTaskOrDecisionItem, chainCommands(filter(isEmptyTaskDecision, chainCommands(getUnindentCommand(), splitListItem)), function (state, dispatch) {
  var selection = state.selection,
      schema = state.schema;
  var taskItem = schema.nodes.taskItem;
  var $from = selection.$from,
      $to = selection.$to;
  var node = $from.node($from.depth);
  var nodeType = node && node.type;
  var listType = nodeType === taskItem ? 'taskList' : 'decisionList';

  var addItem = function addItem(_ref) {
    var tr = _ref.tr,
        itemLocalId = _ref.itemLocalId;

    // ED-8932: When cursor is at the beginning of a task item, instead of split, we insert above.
    if ($from.pos === $to.pos && $from.parentOffset === 0) {
      var newTask = nodeType.createAndFill({
        localId: itemLocalId
      });

      if (newTask) {
        // Current position will point to text node, but we want to insert above the taskItem node
        return tr.insert($from.pos - 1, newTask);
      }
    }

    return tr.split($from.pos, 1, [{
      type: nodeType,
      attrs: {
        localId: itemLocalId
      }
    }]);
  };

  var insertTr = insertTaskDecisionWithAnalytics(state, listType, INPUT_METHOD.KEYBOARD, addItem);

  if (insertTr && dispatch) {
    insertTr.scrollIntoView();
    dispatch(insertTr);
  }

  return true;
}));
export function keymapPlugin(schema, allowNestedTasks, consumeTabs) {
  var indentHandlers = {
    'Shift-Tab': filter([isInsideTaskOrDecisionItem, function (state) {
      return !shouldLetTabThroughInTable(state);
    }], function (state, dispatch) {
      return getUnindentCommand(INPUT_METHOD.KEYBOARD)(state, dispatch) || !!consumeTabs;
    }),
    Tab: filter([isInsideTaskOrDecisionItem, function (state) {
      return !shouldLetTabThroughInTable(state);
    }], function (state, dispatch) {
      return getIndentCommand(INPUT_METHOD.KEYBOARD)(state, dispatch) || !!consumeTabs;
    })
  };
  var defaultHandlers = consumeTabs ? {
    'Shift-Tab': isInsideTaskOrDecisionItem,
    Tab: isInsideTaskOrDecisionItem
  } : {};

  var keymaps = _objectSpread({
    Backspace: backspace,
    Delete: deleteForwards,
    'Ctrl-d': deleteForwards,
    Enter: enter
  }, allowNestedTasks ? indentHandlers : defaultHandlers);

  return keymap(keymaps);
}
export default keymapPlugin;