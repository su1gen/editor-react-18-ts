import { TextSelection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { ACTIONS, pluginKey } from '../pm-plugins/main';
export var removeColor = function removeColor() {
  return function (state, dispatch) {
    var schema = state.schema,
        selection = state.selection;
    var textColor = schema.marks.textColor;
    var tr = state.tr;

    if (selection instanceof TextSelection) {
      var from = selection.from,
          to = selection.to,
          $cursor = selection.$cursor;

      if ($cursor) {
        tr = state.tr.removeStoredMark(textColor);
      } else {
        tr = state.tr.removeMark(from, to, textColor);
      }
    }

    if (selection instanceof CellSelection) {
      /**
       * This is a slight abstraction from `src/utils/commands.ts`
       * The main difference is we can't toggle the default from another (since they are different marks),
       * we want to remove all text color marks on the selection, so we slightly modify the cell selection
       * part here.
       */
      selection.forEachCell(function (cell, cellPos) {
        var from = cellPos;
        var to = cellPos + cell.nodeSize;
        tr.doc.nodesBetween(tr.mapping.map(from), tr.mapping.map(to), function (node, pos) {
          if (!node.isText) {
            return true;
          } // This is an issue when the user selects some text.
          // We need to check if the current node position is less than the range selection from.
          // If it’s true, that means we should apply the mark using the range selection,
          // not the current node position.


          var nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
          var nodeBetweenTo = Math.min(pos + node.nodeSize, tr.mapping.map(to));
          tr.removeMark(nodeBetweenFrom, nodeBetweenTo, textColor);
          return true;
        });
      });
    }

    if (dispatch) {
      dispatch(tr.setMeta(pluginKey, {
        action: ACTIONS.RESET_COLOR
      }));
    }

    return true;
  };
};