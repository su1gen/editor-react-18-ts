import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { ReplaceStep } from 'prosemirror-transform';
export var isTextInput = function isTextInput(tr) {
  var _tr$steps = _slicedToArray(tr.steps, 1),
      step = _tr$steps[0];

  if (!step || !(step instanceof ReplaceStep)) {
    return false;
  }

  var _ref = step,
      content = _ref.slice.content,
      from = _ref.from,
      to = _ref.to;
  var char = content.firstChild;
  return from === to && content.childCount === 1 && !!char && !!char.text && char.text.length === 1;
};