import { NodeSelection } from 'prosemirror-state';
import { GapCursorSelection } from '../../plugins/selection/gap-cursor/selection';
export function atTheEndOfDoc(state) {
  var selection = state.selection,
      doc = state.doc;
  return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}
export function atTheBeginningOfDoc(state) {
  var selection = state.selection;
  return selection.$from.pos === selection.$from.depth;
}
export function atTheEndOfBlock(state) {
  var selection = state.selection;
  var $to = selection.$to;

  if (selection instanceof GapCursorSelection) {
    return false;
  }

  if (selection instanceof NodeSelection && selection.node.isBlock) {
    return true;
  }

  return endPositionOfParent($to) === $to.pos + 1;
}
export function atTheBeginningOfBlock(state) {
  var selection = state.selection;
  var $from = selection.$from;

  if (selection instanceof GapCursorSelection) {
    return false;
  }

  if (selection instanceof NodeSelection && selection.node.isBlock) {
    return true;
  }

  return startPositionOfParent($from) === $from.pos;
}
export function startPositionOfParent(resolvedPos) {
  return resolvedPos.start(resolvedPos.depth);
}
export function endPositionOfParent(resolvedPos) {
  return resolvedPos.end(resolvedPos.depth) + 1;
}