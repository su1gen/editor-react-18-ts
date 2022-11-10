import { Fragment } from 'prosemirror-model';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { isEmptyParagraph } from '../../../utils';
export function insertSliceIntoEmptyNode(_ref) {
  var tr = _ref.tr,
      slice = _ref.slice;
  tr.replaceSelection(slice);
}
export function insertSliceAtNodeEdge(_ref2) {
  var tr = _ref2.tr,
      slice = _ref2.slice;
  var selection = tr.selection;
  var _ref3 = selection,
      $cursor = _ref3.$cursor;

  if (!$cursor) {
    return;
  }

  var position = !$cursor.nodeBefore ? $cursor.before() : $cursor.after();
  tr.replaceRange(position, position, slice);
  var startSlicePosition = tr.doc.resolve(Math.min(position + slice.content.size - slice.openEnd, tr.doc.content.size));
  var direction = -1;
  tr.setSelection(TextSelection.near(startSlicePosition, direction));
}
export function insertSliceIntoRangeSelectionInsideList(_ref4) {
  var tr = _ref4.tr,
      slice = _ref4.slice;
  var _tr$selection = tr.selection,
      $to = _tr$selection.$to,
      $from = _tr$selection.$from,
      to = _tr$selection.to,
      from = _tr$selection.from; // when the selection is inside of the same list item
  // we can use a normal replace

  if ($from.sameParent($to) || $from.depth === $to.depth) {
    return tr.replaceSelection(slice);
  } // if pasting a list inside another list, ensure no empty list items get added


  var newRange = $from.blockRange($to);

  if (!newRange) {
    return;
  }

  var startPos = from;
  var endPos = $to.nodeAfter ? to : to + 2;
  var newSlice = tr.doc.slice(endPos, newRange.end);
  tr.deleteRange(startPos, newRange.end);
  var mapped = tr.mapping.map(startPos);
  tr.replaceRange(mapped, mapped, slice);

  if (newSlice.size <= 0) {
    return;
  }

  var newSelection = TextSelection.near(tr.doc.resolve(tr.mapping.map(mapped)), -1);
  newSlice.openEnd = newSlice.openStart;
  tr.replaceRange(newSelection.from, newSelection.from, newSlice);
  tr.setSelection(TextSelection.near(tr.doc.resolve(newSelection.from), -1));
}
export function insertSliceInsideOfPanelNodeSelected(panelNode) {
  return function (_ref5) {
    var tr = _ref5.tr,
        slice = _ref5.slice;
    var selection = tr.selection,
        _tr$selection2 = tr.selection,
        $to = _tr$selection2.$to,
        $from = _tr$selection2.$from;
    var panelPosition = selection.from; // if content of slice isn't valid for a panel node, insert the invalid node and following content after

    if (panelNode && !panelNode.type.validContent(Fragment.from(slice.content))) {
      var _parentNode$firstChil;

      var insertPosition = $to.pos + 1;
      tr.replaceRange(insertPosition, insertPosition, slice); // need to delete the empty paragraph at the top of the panel

      var parentNode = tr.doc.resolve($from.before()).node();

      if (parentNode && parentNode.childCount > 1 && ((_parentNode$firstChil = parentNode.firstChild) === null || _parentNode$firstChil === void 0 ? void 0 : _parentNode$firstChil.type.name) === 'paragraph' && isEmptyParagraph(parentNode.firstChild)) {
        var startPosDelete = tr.doc.resolve($from.before()).posAtIndex(0);
        var endPosDelete = tr.doc.resolve($from.before()).posAtIndex(1);
        var SIZE_OF_EMPTY_PARAGRAPH = 2; // {startPos}<p>{startPos + 1}</p>{endPos}

        if (endPosDelete - startPosDelete === SIZE_OF_EMPTY_PARAGRAPH) {
          tr.delete(startPosDelete, endPosDelete);
        }
      }

      tr.setSelection(TextSelection.near(tr.doc.resolve(insertPosition + slice.content.size - slice.openStart - slice.openEnd + 1)));
      return;
    }

    var temporaryDoc = new Transform(tr.doc.type.createAndFill());
    temporaryDoc.replaceRange(0, temporaryDoc.doc.content.size, slice);
    var sliceWithoutInvalidListSurrounding = temporaryDoc.doc.slice(0);
    var newPanel = panelNode.copy(sliceWithoutInvalidListSurrounding.content);
    var panelNodeSelected = selection instanceof NodeSelection ? selection.node : null;
    var replaceFrom = panelNodeSelected ? panelPosition : tr.doc.resolve(panelPosition).start();
    var replaceTo = panelNodeSelected ? panelPosition + panelNodeSelected.nodeSize : replaceFrom;
    tr.replaceRangeWith(replaceFrom, replaceTo, newPanel);
    tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + newPanel.content.size), -1));
  };
}