import { findWrapping, ReplaceAroundStep } from 'prosemirror-transform';
import { findCutBefore } from '../../../utils/commands';
import { getBlockRange, isActionOrDecisionItem, isActionOrDecisionList, liftBlock } from './helpers';
export var liftSelection = function liftSelection(state, dispatch) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  var tr = liftBlock(state.tr, $from, $to);

  if (dispatch && tr) {
    dispatch(tr);
  }

  return !!tr;
};
export var wrapSelectionInTaskList = function wrapSelectionInTaskList(state, dispatch) {
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      $to = _state$selection2.$to;
  var blockRange = getBlockRange($from, $to);

  if (!blockRange) {
    return true;
  }

  var wrapping = findWrapping(blockRange, state.schema.nodes.taskList);

  if (!wrapping) {
    return true;
  }

  if (dispatch) {
    dispatch(state.tr.wrap(blockRange, wrapping).scrollIntoView());
  }

  return true;
};
/**
 * Tries to move the paragraph content near the given position into the taskItem or decisionItem
 * before it.
 *
 * Looks backwards from the given position to find the "cut point" between the last taskItem and the
 * following paragraph. Then tries to move the content from that paragraph into the taskItem.
 *
 * @param $pos Position at the end of, or anywhere in paragraph following, the last taskItem
 * @see {joinToPreviousListItem}
 */

export var joinAtCut = function joinAtCut($pos) {
  return function (state, dispatch) {
    var $cut = findCutBefore($pos);

    if (!$cut) {
      return false;
    }

    var paragraph = $cut.doc.type.schema.nodes.paragraph; // find the boundary between the taskList and paragraph

    if ($cut.nodeBefore && isActionOrDecisionList($cut.nodeBefore) && $cut.nodeAfter && $cut.nodeAfter.type === paragraph) {
      // we'll find the boundary of a taskList
      // so resolve -1 to find the inside end of the last taskItem
      var $lastNode = $cut.doc.resolve($cut.pos - 1); // might have deeply nested taskList, keep trying to find it

      while (!isActionOrDecisionItem($lastNode.parent)) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      } // grab the structure between the taskItem and the paragraph
      // note: structure = true in ReplaceAroundStep


      var slice = state.tr.doc.slice($lastNode.pos, $cut.pos); // collapse the range between end of last taskItem and after the paragraph
      // with the gap being the paragraph's content (i.e. take that content)
      //
      // we pass the structure we found earlier to join the p and taskItem nodes
      //
      // see https://prosemirror.net/docs/ref/#transform.ReplaceStep.constructor
      // see https://prosemirror.net/docs/ref/#transform.ReplaceAroundStep.constructor

      var tr = state.tr.step(new ReplaceAroundStep($lastNode.pos, $cut.pos + $cut.nodeAfter.nodeSize, $cut.pos + 1, $cut.pos + $cut.nodeAfter.nodeSize - 1, slice, 0, true));

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};