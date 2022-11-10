import { findSupportedNodeForBreakout } from '../utils/find-breakout-node';
import { NodeSelection } from 'prosemirror-state';
export function removeBreakout() {
  return function (state, dispatch) {
    var node = findSupportedNodeForBreakout(state.selection);

    if (!node) {
      return false;
    }

    var marks = node.node.marks.filter(function (m) {
      return m.type.name !== 'breakout';
    });
    var tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, marks);
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