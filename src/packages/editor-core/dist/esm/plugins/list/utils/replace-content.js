import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';
export var moveTargetIntoList = function moveTargetIntoList(_ref) {
  var _$target$nodeAfter;

  var insertPosition = _ref.insertPosition,
      $target = _ref.$target;
  // take the text content of the paragraph and insert after the paragraph up until before the the cut
  var from = insertPosition;
  var to = $target.pos + (((_$target$nodeAfter = $target.nodeAfter) === null || _$target$nodeAfter === void 0 ? void 0 : _$target$nodeAfter.nodeSize) || 0); //$cut.pos + $cut.nodeAfter.nodeSize;

  var gapFrom = $target.posAtIndex(0, $target.depth + 1); // start pos of the child

  var gapTo = $target.doc.resolve(gapFrom).end(); // end pos of the paragraph

  if (gapTo - gapFrom === 0) {
    return new ReplaceStep(from, to, $target.doc.slice(insertPosition, $target.pos));
  }

  var step = new ReplaceAroundStep(from, to, gapFrom, gapTo, $target.doc.slice(insertPosition, $target.pos), 0, true);
  return step;
};