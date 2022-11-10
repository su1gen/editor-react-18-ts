import { isMarkAllowedInRange, isMarkExcluded } from '../../../utils/mark';

var hasLinkMark = function hasLinkMark($pos) {
  var linkMarkType = $pos.doc.type.schema.marks.link,
      pos = $pos.pos;

  if (!linkMarkType) {
    return false;
  }

  return $pos.doc.rangeHasMark(pos, Math.min(pos + 1, $pos.doc.content.size), linkMarkType);
};

export var getDisabledState = function getDisabledState(state) {
  var textColor = state.schema.marks.textColor;

  if (textColor) {
    var _ref = state.selection,
        empty = _ref.empty,
        ranges = _ref.ranges,
        $cursor = _ref.$cursor;

    if (empty && !$cursor || $cursor && hasLinkMark($cursor) || isMarkAllowedInRange(state.doc, ranges, textColor) === false) {
      return true;
    }

    if (isMarkExcluded(textColor, state.storedMarks || $cursor && $cursor.marks())) {
      return true;
    }

    return false;
  }

  return true;
};