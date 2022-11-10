import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { liftTarget } from 'prosemirror-transform';
import { cellSelectionNodesBetween } from '../../../utils/cell-selection';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE } from '../../analytics';
export var FORMATTING_NODE_TYPES = ['heading', 'codeBlock', 'blockquote'];
export var FORMATTING_MARK_TYPES = ['em', 'code', 'strike', 'strong', 'underline', 'textColor', 'subsup'];
var formatTypes = {
  em: ACTION_SUBJECT_ID.FORMAT_ITALIC,
  code: ACTION_SUBJECT_ID.FORMAT_CODE,
  strike: ACTION_SUBJECT_ID.FORMAT_STRIKE,
  strong: ACTION_SUBJECT_ID.FORMAT_STRONG,
  underline: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
  textColor: ACTION_SUBJECT_ID.FORMAT_COLOR,
  subsup: 'subsup'
};
export function clearFormattingWithAnalytics(inputMethod) {
  return clearFormatting(inputMethod);
}

function clearNodeFormattingOnSelection(state, tr, formattedNodeType, nodeName, formattingCleared) {
  return function (node, pos) {
    if (node.type === formattedNodeType) {
      if (formattedNodeType.isTextblock) {
        tr.setNodeMarkup(pos, state.schema.nodes.paragraph);
        formattingCleared.push(nodeName);
        return false;
      } else {
        // In case of panel or blockquote
        var fromPos = tr.doc.resolve(pos + 1);
        var toPos = tr.doc.resolve(pos + node.nodeSize - 1);
        var nodeRange = fromPos.blockRange(toPos);

        if (nodeRange) {
          var targetLiftDepth = liftTarget(nodeRange);

          if (targetLiftDepth || targetLiftDepth === 0) {
            formattingCleared.push(nodeName);
            tr.lift(nodeRange, targetLiftDepth);
          }
        }
      }
    }

    return true;
  };
}

export function clearFormatting(inputMethod) {
  return function (state, dispatch) {
    var tr = state.tr;
    var formattingCleared = [];
    FORMATTING_MARK_TYPES.forEach(function (mark) {
      var _tr$selection = tr.selection,
          from = _tr$selection.from,
          to = _tr$selection.to;
      var markType = state.schema.marks[mark];

      if (!markType) {
        return;
      }

      if (tr.selection instanceof CellSelection) {
        cellSelectionNodesBetween(tr.selection, tr.doc, function (node, pos) {
          var isTableCell = node.type === state.schema.nodes.tableCell || node.type === state.schema.nodes.tableHeader;

          if (!isTableCell) {
            return true;
          }

          if (tr.doc.rangeHasMark(pos, pos + node.nodeSize, markType)) {
            formattingCleared.push(formatTypes[mark]);
            tr.removeMark(pos, pos + node.nodeSize, markType);
          }

          return false;
        });
      } else if (tr.doc.rangeHasMark(from, to, markType)) {
        formattingCleared.push(formatTypes[mark]);
        tr.removeMark(from, to, markType);
      }
    });
    FORMATTING_NODE_TYPES.forEach(function (nodeName) {
      var formattedNodeType = state.schema.nodes[nodeName];
      var _tr$selection2 = tr.selection,
          $from = _tr$selection2.$from,
          $to = _tr$selection2.$to;

      if (tr.selection instanceof CellSelection) {
        cellSelectionNodesBetween(tr.selection, tr.doc, clearNodeFormattingOnSelection(state, tr, formattedNodeType, nodeName, formattingCleared));
      } else {
        tr.doc.nodesBetween($from.pos, $to.pos, clearNodeFormattingOnSelection(state, tr, formattedNodeType, nodeName, formattingCleared));
      }
    });
    tr.setStoredMarks([]);

    if (formattingCleared.length && inputMethod) {
      addAnalytics(state, tr, {
        action: ACTION.FORMATTED,
        eventType: EVENT_TYPE.TRACK,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CLEAR,
        attributes: {
          inputMethod: inputMethod,
          formattingCleared: formattingCleared
        }
      });
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}