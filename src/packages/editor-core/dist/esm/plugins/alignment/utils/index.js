import { findParentNodeOfType } from 'prosemirror-utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
export var getActiveAlignment = function getActiveAlignment(state) {
  if (state.selection instanceof CellSelection) {
    var marks = [];
    state.selection.forEachCell(function (cell) {
      var mark = cell.firstChild.marks.filter(function (mark) {
        return mark.type === state.schema.marks.alignment;
      })[0];
      marks.push(mark ? mark.attrs.align : 'start');
    });
    return marks.every(function (mark) {
      return mark === marks[0];
    }) ? marks[0] : 'start';
  }

  var node = findParentNodeOfType([state.schema.nodes.paragraph, state.schema.nodes.heading])(state.selection);
  var getMark = node && node.node.marks.filter(function (mark) {
    return mark.type === state.schema.marks.alignment;
  })[0];
  return getMark && getMark.attrs.align || 'start';
};