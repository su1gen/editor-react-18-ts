"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnindentCommand = exports.getIndentCommand = exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _commands = require("../../../utils/commands");

var _analytics = require("../../analytics");

var _commands2 = require("../commands");

var _commands3 = require("./commands");

var _helpers = require("./helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var indentationAnalytics = function indentationAnalytics(curIndentLevel, direction, inputMethod) {
  return {
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_INDENT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: inputMethod,
      previousIndentationLevel: curIndentLevel,
      newIndentLevel: direction === _analytics.INDENT_DIRECTION.OUTDENT ? curIndentLevel - 1 : curIndentLevel + 1,
      direction: direction,
      indentType: _analytics.INDENT_TYPE.TASK_LIST
    }
  };
};

var nodeAfter = function nodeAfter($pos) {
  return $pos.doc.resolve($pos.end()).nodeAfter;
};

var actionDecisionFollowsOrNothing = function actionDecisionFollowsOrNothing($pos) {
  var after = nodeAfter($pos);
  return !after || (0, _helpers.isActionOrDecisionItem)(after);
};

var joinTaskDecisionFollowing = function joinTaskDecisionFollowing(state, dispatch) {
  // only run if selection is at end of text, and inside a task or decision item
  if (!(0, _commands.isEmptySelectionAtEnd)(state) || !(0, _helpers.isInsideTaskOrDecisionItem)(state) || !dispatch) {
    return false;
  } // look for the node after this current one


  var $next = (0, _helpers.walkOut)(state.selection.$from); // if there's no taskItem or taskList following, then
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
  var parentList = (0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($next, [taskList, taskItem, decisionList, decisionItem]);

  if (!parentList) {
    if ($next.parent.type === paragraph) {
      // try to join paragraph and taskList when backspacing
      return (0, _commands3.joinAtCut)($next.doc.resolve($next.pos))(state, dispatch);
    } // If the item we are joining is a list


    if ($next.parent.type === bulletList || $next.parent.type === orderedList) {
      // If the list has an item
      if ($next.parent.firstChild && $next.parent.firstChild.type === listItem) {
        // Place the cursor at the first listItem
        var resolvedStartPos = state.doc.resolve($next.pos + 1); // Unindent the first listItem.
        // As if placing your cursor just after the first dot of the list (before the text)
        // and pressing Shift-Tab.

        var tr = (0, _helpers.liftBlock)(state.tr, resolvedStartPos, resolvedStartPos); // If autoJoin not used, two ul/ol elements appear rather than one with multiple li elements

        return (0, _prosemirrorCommands.autoJoin)(function (state, dispatch) {
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

var getUnindentCommand = function getUnindentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return (0, _commands.filter)(_helpers.isInsideTask, function (state, dispatch) {
    var curIndentLevel = (0, _helpers.getCurrentIndentLevel)(state.selection);

    if (!curIndentLevel || curIndentLevel === 1) {
      return false;
    }

    return (0, _analytics.withAnalytics)(indentationAnalytics(curIndentLevel, _analytics.INDENT_DIRECTION.OUTDENT, inputMethod))((0, _prosemirrorCommands.autoJoin)(_commands3.liftSelection, ['taskList']))(state, dispatch);
  });
}; // if selection is decision item or first action item in table cell
// then dont consume the Tab, as table-keymap should tab to the next cell


exports.getUnindentCommand = getUnindentCommand;

var shouldLetTabThroughInTable = function shouldLetTabThroughInTable(state) {
  var curIndentLevel = (0, _helpers.getCurrentIndentLevel)(state.selection);
  var curIndex = (0, _helpers.getTaskItemIndex)(state);
  var _state$schema$nodes2 = state.schema.nodes,
      tableCell = _state$schema$nodes2.tableCell,
      tableHeader = _state$schema$nodes2.tableHeader;
  var cell = (0, _prosemirrorUtils.findParentNodeOfType)([tableCell, tableHeader])(state.selection);

  if ((curIndentLevel === 1 && curIndex === 0 || (0, _helpers.isInsideDecision)(state)) && cell) {
    return true;
  }

  return false;
};

var getIndentCommand = function getIndentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return (0, _commands.filter)(_helpers.isInsideTask, function (state, dispatch) {
    // limit ui indentation to 6 levels
    var curIndentLevel = (0, _helpers.getCurrentIndentLevel)(state.selection);

    if (!curIndentLevel || curIndentLevel >= 6) {
      return true;
    }

    var _state$schema$nodes3 = state.schema.nodes,
        taskList = _state$schema$nodes3.taskList,
        taskItem = _state$schema$nodes3.taskItem;
    var _state$selection = state.selection,
        $from = _state$selection.$from,
        $to = _state$selection.$to;
    var maxDepth = (0, _helpers.subtreeHeight)($from, $to, [taskList, taskItem]);

    if (maxDepth >= 6) {
      return true;
    }

    return (0, _analytics.withAnalytics)(indentationAnalytics(curIndentLevel, _analytics.INDENT_DIRECTION.INDENT, inputMethod))((0, _prosemirrorCommands.autoJoin)(_commands3.wrapSelectionInTaskList, ['taskList']))(state, dispatch);
  });
};

exports.getIndentCommand = getIndentCommand;

var backspaceFrom = function backspaceFrom($from) {
  return function (state, dispatch) {
    // previous was empty, just delete backwards
    var taskBefore = $from.doc.resolve($from.before());

    if (taskBefore.nodeBefore && (0, _helpers.isActionOrDecisionItem)(taskBefore.nodeBefore) && taskBefore.nodeBefore.nodeSize === 2) {
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

var backspace = (0, _commands.filter)(_commands.isEmptySelectionAtStart, (0, _prosemirrorCommands.autoJoin)((0, _prosemirrorCommands.chainCommands)(function (state, dispatch) {
  return (0, _commands3.joinAtCut)(state.selection.$from)(state, dispatch);
}, (0, _commands.filter)(_helpers.isInsideTaskOrDecisionItem, function (state, dispatch) {
  return backspaceFrom(state.selection.$from)(state, dispatch);
})), ['taskList', 'decisionList']));

var unindentTaskOrUnwrapTaskDecisionFollowing = function unindentTaskOrUnwrapTaskDecisionFollowing(state, dispatch) {
  var $from = state.selection.$from,
      _state$schema$nodes5 = state.schema.nodes,
      taskList = _state$schema$nodes5.taskList,
      doc = _state$schema$nodes5.doc,
      paragraph = _state$schema$nodes5.paragraph,
      tr = state.tr; // only run if cursor is at the end of the node

  if (!(0, _commands.isEmptySelectionAtEnd)(state) || !dispatch) {
    return false;
  } // look for the node after this current one


  var $next = (0, _helpers.walkOut)($from); // this is a top-level node it wont have $next.before()

  if (!$next.parent || $next.parent.type === doc) {
    return false;
  } // if nested, just unindent


  if ($next.node($next.depth - 2).type === taskList || // this is for the case when we are on a non-nested item and next one is nested
  $next.node($next.depth - 1).type === taskList && $next.parent.type === taskList) {
    (0, _helpers.liftBlock)(tr, $next, $next);
    dispatch(tr);
    return true;
  } // if next node is of same type, remove the node wrapping and create paragraph


  if (!(0, _helpers.isTable)($next.nodeAfter) && (0, _helpers.isActionOrDecisionItem)($from.parent) && actionDecisionFollowsOrNothing($from) && // only forward delete if the node is same type
  $next.node().type.name === $from.node().type.name) {
    var taskContent = state.doc.slice($next.start(), $next.end()).content; // might be end of document after

    var slice = taskContent.size ? paragraph.createChecked(undefined, taskContent) : [];
    dispatch(splitListItemWith(tr, slice, $next, false));
    return true;
  }

  return false;
};

var deleteForwards = (0, _prosemirrorCommands.autoJoin)((0, _prosemirrorCommands.chainCommands)((0, _commands.deleteEmptyParagraphAndMoveBlockUp)(_helpers.isActionOrDecisionList), joinTaskDecisionFollowing, unindentTaskOrUnwrapTaskDecisionFollowing), ['taskList', 'decisionList']);

var splitListItemWith = function splitListItemWith(tr, content, $from, setSelection) {
  var origDoc = tr.doc; // split just before the current item
  // we can only split if there was a list item before us

  var container = $from.node($from.depth - 2);
  var posInList = $from.index($from.depth - 1);
  var shouldSplit = !(!(0, _helpers.isActionOrDecisionList)(container) && posInList === 0);

  if (shouldSplit) {
    // this only splits a node to delete it, so we probably don't need a random uuid
    // but generate one anyway for correctness
    tr = tr.split($from.pos, 1, [{
      type: $from.parent.type,
      attrs: {
        localId: _adfSchema.uuid.generate()
      }
    }]);
  } // and delete the action at the current pos
  // we can do this because we know either first new child will be taskItem or nothing at all


  var frag = _prosemirrorModel.Fragment.from(content);

  tr = tr.replace(tr.mapping.map($from.start() - 2), tr.mapping.map($from.end() + 2), frag.size ? new _prosemirrorModel.Slice(frag, 0, 0) : _prosemirrorModel.Slice.empty); // put cursor inside paragraph

  if (setSelection) {
    tr = tr.setSelection(new _prosemirrorState.TextSelection(tr.doc.resolve($from.pos + 1 - (shouldSplit ? 0 : 2))));
  } // lift list up if the node after the initial one was a taskList
  // which means it would have empty placeholder content if we just immediately delete it
  //
  // if it's a taskItem then it can stand alone, so it's fine


  var $oldAfter = origDoc.resolve($from.after()); // if different levels then we shouldn't lift

  if ($oldAfter.depth === $from.depth - 1) {
    if ($oldAfter.nodeAfter && (0, _helpers.isActionOrDecisionList)($oldAfter.nodeAfter)) {
      // getBlockRange expects to be inside the taskItem
      var pos = tr.mapping.map($oldAfter.pos + 2);
      var $after = tr.doc.resolve(pos);
      var blockRange = (0, _helpers.getBlockRange)($after, tr.doc.resolve($after.after($after.depth - 1) - 1));

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

var enter = (0, _commands.filter)(_helpers.isInsideTaskOrDecisionItem, (0, _prosemirrorCommands.chainCommands)((0, _commands.filter)(_helpers.isEmptyTaskDecision, (0, _prosemirrorCommands.chainCommands)(getUnindentCommand(), splitListItem)), function (state, dispatch) {
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

  var insertTr = (0, _commands2.insertTaskDecisionWithAnalytics)(state, listType, _analytics.INPUT_METHOD.KEYBOARD, addItem);

  if (insertTr && dispatch) {
    insertTr.scrollIntoView();
    dispatch(insertTr);
  }

  return true;
}));

function keymapPlugin(schema, allowNestedTasks, consumeTabs) {
  var indentHandlers = {
    'Shift-Tab': (0, _commands.filter)([_helpers.isInsideTaskOrDecisionItem, function (state) {
      return !shouldLetTabThroughInTable(state);
    }], function (state, dispatch) {
      return getUnindentCommand(_analytics.INPUT_METHOD.KEYBOARD)(state, dispatch) || !!consumeTabs;
    }),
    Tab: (0, _commands.filter)([_helpers.isInsideTaskOrDecisionItem, function (state) {
      return !shouldLetTabThroughInTable(state);
    }], function (state, dispatch) {
      return getIndentCommand(_analytics.INPUT_METHOD.KEYBOARD)(state, dispatch) || !!consumeTabs;
    })
  };
  var defaultHandlers = consumeTabs ? {
    'Shift-Tab': _helpers.isInsideTaskOrDecisionItem,
    Tab: _helpers.isInsideTaskOrDecisionItem
  } : {};

  var keymaps = _objectSpread({
    Backspace: backspace,
    Delete: deleteForwards,
    'Ctrl-d': deleteForwards,
    Enter: enter
  }, allowNestedTasks ? indentHandlers : defaultHandlers);

  return (0, _prosemirrorKeymap.keymap)(keymaps);
}

var _default = keymapPlugin;
exports.default = _default;