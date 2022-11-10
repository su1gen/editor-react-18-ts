"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeColor = void 0;

var _analytics = require("../../analytics");

var _main = require("../pm-plugins/main");

var _color = require("../utils/color");

var _removeColor = require("./remove-color");

var _toggleColor = require("./toggle-color");

/**
 * Helper to create a higher order analytics command
 * @param newColor  - Color to be change in hex code
 * @param previousColor - Active color in hex code
 * @param palette - Current palette of colors
 * @return Higher order command with analytics logic inside.
 */
function createWithColorAnalytics(newColor, previousColor, palette) {
  var newColorFromPalette = palette.find(function (_ref) {
    var value = _ref.value;
    return value === newColor;
  });
  var previousColorFromPalette = palette.find(function (_ref2) {
    var value = _ref2.value;
    return value === previousColor;
  });
  var newColorLabel = newColorFromPalette ? newColorFromPalette.label : newColor;
  var previousColorLabel = previousColorFromPalette ? previousColorFromPalette.label : previousColor || '';
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_COLOR,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      newColor: newColorLabel.toLowerCase(),
      previousColor: previousColorLabel.toLowerCase()
    }
  });
}

var changeColor = function changeColor(color) {
  return function (state, dispatch) {
    var textColor = state.schema.marks.textColor;

    if (textColor) {
      var pluginState = _main.pluginKey.getState(state);

      var activeColor = (0, _color.getActiveColor)(state);
      var withColorAnalytics = createWithColorAnalytics(color, activeColor, // palette is a subset of paletteExpanded
      pluginState.paletteExpanded || pluginState.palette);

      if (pluginState.disabled) {
        return false;
      }

      if (color === pluginState.defaultColor) {
        withColorAnalytics((0, _removeColor.removeColor)())(state, dispatch);
        return true;
      }

      withColorAnalytics((0, _toggleColor.toggleColor)(color))(state, dispatch);
      return true;
    }

    return false;
  };
};

exports.changeColor = changeColor;