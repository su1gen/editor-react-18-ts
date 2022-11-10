"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAlignable = exports.changeAlignment = void 0;

var _commands = require("../../../commands");

var _action = require("../../../utils/action");

var isAlignable = function isAlignable(align) {
  return function (state, dispatch) {
    var _state$schema = state.schema,
        _state$schema$nodes = _state$schema.nodes,
        paragraph = _state$schema$nodes.paragraph,
        heading = _state$schema$nodes.heading,
        alignment = _state$schema.marks.alignment;
    return (0, _commands.toggleBlockMark)(alignment, function () {
      return !align ? undefined : align === 'start' ? false : {
        align: align
      };
    }, [paragraph, heading])(state, dispatch);
  };
};

exports.isAlignable = isAlignable;

var changeAlignment = function changeAlignment(align) {
  return function (state, dispatch) {
    var _state$schema2 = state.schema,
        _state$schema2$nodes = _state$schema2.nodes,
        paragraph = _state$schema2$nodes.paragraph,
        heading = _state$schema2$nodes.heading,
        alignment = _state$schema2.marks.alignment;
    return (0, _action.cascadeCommands)([(0, _commands.changeImageAlignment)(align), (0, _commands.toggleBlockMark)(alignment, function () {
      return !align ? undefined : align === 'start' ? false : {
        align: align
      };
    }, [paragraph, heading])])(state, dispatch);
  };
};

exports.changeAlignment = changeAlignment;