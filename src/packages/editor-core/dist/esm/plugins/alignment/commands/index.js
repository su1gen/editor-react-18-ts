import { toggleBlockMark, changeImageAlignment } from '../../../commands';
import { cascadeCommands } from '../../../utils/action';
export var isAlignable = function isAlignable(align) {
  return function (state, dispatch) {
    var _state$schema = state.schema,
        _state$schema$nodes = _state$schema.nodes,
        paragraph = _state$schema$nodes.paragraph,
        heading = _state$schema$nodes.heading,
        alignment = _state$schema.marks.alignment;
    return toggleBlockMark(alignment, function () {
      return !align ? undefined : align === 'start' ? false : {
        align: align
      };
    }, [paragraph, heading])(state, dispatch);
  };
};
export var changeAlignment = function changeAlignment(align) {
  return function (state, dispatch) {
    var _state$schema2 = state.schema,
        _state$schema2$nodes = _state$schema2.nodes,
        paragraph = _state$schema2$nodes.paragraph,
        heading = _state$schema2$nodes.heading,
        alignment = _state$schema2.marks.alignment;
    return cascadeCommands([changeImageAlignment(align), toggleBlockMark(alignment, function () {
      return !align ? undefined : align === 'start' ? false : {
        align: align
      };
    }, [paragraph, heading])])(state, dispatch);
  };
};