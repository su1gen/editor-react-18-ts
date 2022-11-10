"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleColor = void 0;

var _commands = require("../../../utils/commands");

var _main = require("../pm-plugins/main");

var _disabled = require("../utils/disabled");

var toggleColor = function toggleColor(color) {
  return function (state, dispatch) {
    var textColor = state.schema.marks.textColor;
    var tr = state.tr;
    var disabledState = (0, _disabled.getDisabledState)(state);

    if (disabledState) {
      if (dispatch) {
        dispatch(tr.setMeta(_main.pluginKey, {
          action: _main.ACTIONS.DISABLE
        }));
      }

      return false;
    }

    if (dispatch) {
      state.tr.setMeta(_main.pluginKey, {
        action: _main.ACTIONS.SET_COLOR,
        color: color
      });
      state.tr.scrollIntoView();
      (0, _commands.toggleMark)(textColor, {
        color: color
      })(state, dispatch);
    }

    return true;
  };
};

exports.toggleColor = toggleColor;