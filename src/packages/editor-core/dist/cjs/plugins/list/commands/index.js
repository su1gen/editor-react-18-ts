"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enterKeyCommand = exports.deleteKeyCommand = exports.backspaceKeyCommand = void 0;
Object.defineProperty(exports, "indentList", {
  enumerable: true,
  get: function get() {
    return _indentList.indentList;
  }
});
Object.defineProperty(exports, "outdentList", {
  enumerable: true,
  get: function get() {
    return _outdentList.outdentList;
  }
});
exports.rootListDepth = void 0;
exports.toggleBulletList = toggleBulletList;
exports.toggleList = toggleList;
exports.toggleOrderedList = toggleOrderedList;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var baseCommand = _interopRequireWildcard(require("prosemirror-commands"));

var _prosemirrorUtils = require("prosemirror-utils");

var _document = require("../../../utils/document");

var _commands = require("../../../utils/commands");

var _utils = require("../../../utils");

var _transforms = require("../transforms");

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var _analytics = require("../../analytics");

var _selection = require("../utils/selection");

var _analytics2 = require("../utils/analytics");

var _listBackspace = require("./listBackspace");

var _joinListItemForward = require("./join-list-item-forward");

var _conversions = require("../actions/conversions");

var _wrapAndJoinLists = require("../actions/wrap-and-join-lists");

var _outdentList = require("./outdent-list");

var _indentList = require("./indent-list");

var _replaceContent = require("../utils/replace-content");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var enterKeyCommand = function enterKeyCommand(state, dispatch) {
  var selection = state.selection;

  if (selection.empty) {
    var $from = selection.$from;
    var _state$schema$nodes = state.schema.nodes,
        listItem = _state$schema$nodes.listItem,
        codeBlock = _state$schema$nodes.codeBlock;
    var wrapper = $from.node($from.depth - 1);

    if (wrapper && wrapper.type === listItem) {
      /** Check if the wrapper has any visible content */
      var wrapperHasContent = (0, _document.hasVisibleContent)(wrapper);

      if (!wrapperHasContent) {
        return (0, _outdentList.outdentList)(_analytics.INPUT_METHOD.KEYBOARD)(state, dispatch);
      } else if (!(0, _prosemirrorUtils.hasParentNodeOfType)(codeBlock)(selection)) {
        return splitListItem(listItem)(state, dispatch);
      }
    }
  }

  return false;
};

exports.enterKeyCommand = enterKeyCommand;

var backspaceKeyCommand = function backspaceKeyCommand(state, dispatch) {
  return baseCommand.chainCommands(_listBackspace.listBackspace, // if we're at the start of a list item, we need to either backspace
  // directly to an empty list item above, or outdent this node
  (0, _commands.filter)([_commands.isEmptySelectionAtStart, // list items might have multiple paragraphs; only do this at the first one
  _commands.isFirstChildOfParent, _selection.isInsideListItem], baseCommand.chainCommands(deletePreviousEmptyListItem, (0, _outdentList.outdentList)(_analytics.INPUT_METHOD.KEYBOARD))), // if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
  // the text to the previous list item, if one exists
  (0, _commands.filter)([_commands.isEmptySelectionAtStart, _selection.canJoinToPreviousListItem], joinToPreviousListItem))(state, dispatch);
};

exports.backspaceKeyCommand = backspaceKeyCommand;
var deleteKeyCommand = _joinListItemForward.joinListItemForward; // Get the depth of the nearest ancestor list

exports.deleteKeyCommand = deleteKeyCommand;

var rootListDepth = function rootListDepth(pos, nodes) {
  var bulletList = nodes.bulletList,
      orderedList = nodes.orderedList,
      listItem = nodes.listItem;
  var depth;

  for (var i = pos.depth - 1; i > 0; i--) {
    var node = pos.node(i);

    if (node.type === bulletList || node.type === orderedList) {
      depth = i;
    }

    if (node.type !== bulletList && node.type !== orderedList && node.type !== listItem) {
      break;
    }
  }

  return depth;
};

exports.rootListDepth = rootListDepth;

function untoggleSelectedList(tr) {
  var _tr = tr,
      selection = _tr.selection;
  var depth = rootListDepth(selection.$to, tr.doc.type.schema.nodes);
  tr = (0, _transforms.liftFollowingList)(selection.$to.pos, selection.$to.end(depth), depth || 0, tr);

  if (selection instanceof _prosemirrorState.NodeSelection || selection instanceof _gapCursorSelection.GapCursorSelection) {
    return (0, _transforms.liftNodeSelectionList)(selection, tr);
  }

  return (0, _transforms.liftTextSelectionList)(selection, tr);
}

function toggleList(inputMethod, listType) {
  return function (state, dispatch) {
    var tr = state.tr;
    var listInsideSelection = (0, _selection.selectionContainsList)(tr);
    var listNodeType = state.schema.nodes[listType];
    var actionSubjectId = listType === 'bulletList' ? _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    if (listInsideSelection) {
      var selection = state.selection; // for gap cursor or node selection - list is expected 1 level up (listItem -> list)
      // for text selection - list is expected 2 levels up (paragraph -> listItem -> list)

      var positionDiff = selection instanceof _gapCursorSelection.GapCursorSelection || selection instanceof _prosemirrorState.NodeSelection ? 1 : 2;
      var fromNode = selection.$from.node(selection.$from.depth - positionDiff);
      var toNode = selection.$to.node(selection.$to.depth - positionDiff);
      var transformedFrom = listInsideSelection.type.name === 'bulletList' ? _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

      if ((fromNode === null || fromNode === void 0 ? void 0 : fromNode.type.name) === listType && (toNode === null || toNode === void 0 ? void 0 : toNode.type.name) === listType) {
        var _tr2 = state.tr;
        untoggleSelectedList(_tr2);
        (0, _analytics.addAnalytics)(state, _tr2, {
          action: _analytics.ACTION.CONVERTED,
          actionSubject: _analytics.ACTION_SUBJECT.LIST,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.TEXT,
          eventType: _analytics.EVENT_TYPE.TRACK,
          attributes: _objectSpread(_objectSpread({}, (0, _analytics2.getCommonListAnalyticsAttributes)(state)), {}, {
            transformedFrom: transformedFrom,
            inputMethod: inputMethod
          })
        });

        if (dispatch) {
          dispatch(_tr2);
        }

        return true;
      }

      (0, _conversions.convertListType)({
        tr: tr,
        nextListNodeType: listNodeType
      });
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.CONVERTED,
        actionSubject: _analytics.ACTION_SUBJECT.LIST,
        actionSubjectId: actionSubjectId,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, (0, _analytics2.getCommonListAnalyticsAttributes)(state)), {}, {
          transformedFrom: transformedFrom,
          inputMethod: inputMethod
        })
      });
    } else {
      // Need to have this before wrapInList so the wrapping is done with valid content
      // For example, if trying to convert centre or right aligned paragraphs to lists
      (0, _utils.sanitiseMarksInSelection)(tr, listNodeType);
      (0, _wrapAndJoinLists.wrapInListAndJoin)(listNodeType, tr);
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.INSERTED,
        actionSubject: _analytics.ACTION_SUBJECT.LIST,
        actionSubjectId: actionSubjectId,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: inputMethod
        }
      });
    } // If document wasn't changed, return false from the command to indicate that the
    // editing action failed


    if (!tr.docChanged) {
      return false;
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function toggleBulletList(view) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _analytics.INPUT_METHOD.TOOLBAR;
  return toggleList(inputMethod, 'bulletList')(view.state, view.dispatch);
}

function toggleOrderedList(view) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _analytics.INPUT_METHOD.TOOLBAR;
  return toggleList(inputMethod, 'orderedList')(view.state, view.dispatch);
}
/**
 * Implementation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */


function splitListItem(itemType) {
  return function (state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var node = ref.node;

    if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    var grandParent = $from.node(-1);

    if (grandParent.type !== itemType) {
      return false;
    }
    /** --> The following line changed from the original PM implementation to allow list additions with multiple paragraphs */


    if (grandParent.content.content.length <= 1 && $from.parent.content.size === 0 && !(grandParent.content.size === 0)) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if ($from.depth === 2 || $from.node(-3).type !== itemType || $from.index(-2) !== $from.node(-2).childCount - 1) {
        return false;
      }

      if (dispatch) {
        var wrap = _prosemirrorModel.Fragment.empty;
        var keepItem = $from.index(-1) > 0; // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor

        for (var d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
          wrap = _prosemirrorModel.Fragment.from($from.node(d).copy(wrap));
        } // Add a second list item with an empty default start node


        wrap = wrap.append(_prosemirrorModel.Fragment.from(itemType.createAndFill()));
        var tr$1 = state.tr.replace($from.before(keepItem ? undefined : -1), $from.after(-3), new _prosemirrorModel.Slice(wrap, keepItem ? 3 : 2, 2));
        tr$1.setSelection(state.selection.constructor.near(tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2))));
        dispatch(tr$1.scrollIntoView());
      }

      return true;
    }

    var nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : undefined;
    var tr = state.tr.delete($from.pos, $to.pos);
    var types = nextType && [undefined, {
      type: nextType
    }];

    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    }

    return true;
  };
}

var deletePreviousEmptyListItem = function deletePreviousEmptyListItem(state, dispatch) {
  var $from = state.selection.$from;
  var listItem = state.schema.nodes.listItem;
  var $cut = (0, _commands.findCutBefore)($from);

  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }

  var previousListItemEmpty = $cut.nodeBefore.childCount === 1 && $cut.nodeBefore.firstChild.nodeSize <= 2;

  if (previousListItemEmpty) {
    var tr = state.tr;

    if (dispatch) {
      dispatch(tr.delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos).scrollIntoView());
    }

    return true;
  }

  return false;
};

var joinToPreviousListItem = function joinToPreviousListItem(state, dispatch) {
  var $from = state.selection.$from;
  var _state$schema$nodes2 = state.schema.nodes,
      paragraph = _state$schema$nodes2.paragraph,
      listItem = _state$schema$nodes2.listItem,
      codeBlock = _state$schema$nodes2.codeBlock,
      bulletList = _state$schema$nodes2.bulletList,
      orderedList = _state$schema$nodes2.orderedList;
  var isGapCursorShown = state.selection instanceof _gapCursorSelection.GapCursorSelection;
  var $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
  var $cut = (0, _commands.findCutBefore)($cutPos);

  if (!$cut) {
    return false;
  } // see if the containing node is a list


  if ($cut.nodeBefore && [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
    // and the node after this is a paragraph or a codeBlock
    if ($cut.nodeAfter && ($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)) {
      // find the nearest paragraph that precedes this node
      var $lastNode = $cut.doc.resolve($cut.pos - 1);

      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }

      var tr = state.tr;

      if (isGapCursorShown) {
        var nodeBeforePos = (0, _prosemirrorUtils.findPositionOfNodeBefore)(tr.selection);

        if (typeof nodeBeforePos !== 'number') {
          return false;
        } // append the codeblock to the list node


        var list = $cut.nodeBefore.copy($cut.nodeBefore.content.append(_prosemirrorModel.Fragment.from(listItem.createChecked({}, $cut.nodeAfter))));
        tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list);
      } else {
        var step = (0, _replaceContent.moveTargetIntoList)({
          insertPosition: $lastNode.pos,
          $target: $cut
        }); // ED-13966: check if the step will cause an ProseMirror error
        // if there's an error don't apply the step as it will might lead into a data loss.
        // It doesn't play well with media being a leaf node.

        var stepResult = state.tr.maybeStep(step);

        if (stepResult.failed) {
          return false;
        } else {
          tr = state.tr.step(step);
        }
      } // find out if there's now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]


      var $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize));

      if ($postCut.nodeBefore && $postCut.nodeAfter && $postCut.nodeBefore.type === $postCut.nodeAfter.type && [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1) {
        tr = tr.join($postCut.pos);
      }

      if (dispatch) {
        var _tr$doc$resolve$nodeB;

        if (!((_tr$doc$resolve$nodeB = tr.doc.resolve($lastNode.pos).nodeBefore) !== null && _tr$doc$resolve$nodeB !== void 0 && _tr$doc$resolve$nodeB.isBlock) || tr.doc.resolve($lastNode.pos).nodeBefore === null) {
          tr = tr.setSelection(_prosemirrorState.TextSelection.near(tr.doc.resolve(tr.mapping.map($cut.pos)), -1));
        }

        dispatch(tr.scrollIntoView());
      }

      return true;
    }
  }

  return false;
};