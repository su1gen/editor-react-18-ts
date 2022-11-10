import { findSupportedNodeForBreakout } from '../utils/find-breakout-node';
import { NodeSelection } from 'prosemirror-state';
export function setBreakoutMode(mode) {
  return function (state, dispatch) {
    var node = findSupportedNodeForBreakout(state.selection);

    if (!node) {
      return false;
    }

    var tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, [state.schema.marks.breakout.create({
      mode: mode
    })]);
    tr.setMeta('scrollIntoView', false);

    if (state.selection instanceof NodeSelection) {
      if (state.selection.$anchor.pos === node.pos) {
        tr.setSelection(NodeSelection.create(tr.doc, node.pos));
      }
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}