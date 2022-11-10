"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnalyticsDispatch = createAnalyticsDispatch;
exports.getNewIndentLevel = getNewIndentLevel;
exports.getPrevIndentLevel = getPrevIndentLevel;

var _analytics = require("../../analytics");

var indentTypes = {
  paragraph: _analytics.INDENT_TYPE.PARAGRAPH,
  heading: _analytics.INDENT_TYPE.HEADING
};
/**
 * Get the current indentation level given prev and new attributes
 * @param prevAttrs - Previous attributes from indentation
 * @param newAttrs - New attributes from indentation
 */

function getNewIndentLevel(prevAttrs, newAttrs) {
  if (newAttrs === undefined) {
    return getPrevIndentLevel(prevAttrs);
  } else if (newAttrs === false) {
    return 0;
  }

  return newAttrs.level;
}
/**
 * Get the previous indentation level  prev attributes
 * @param prevAttrs - Previous attributes from indentation
 */


function getPrevIndentLevel(prevAttrs) {
  if (prevAttrs === undefined) {
    return 0;
  }

  return prevAttrs.level;
}
/**
 * Create a new dispatch function who add analytics events given a list of attributes changes
 *
 * @export
 * @param {*} getAttrsChanges
 * @param {*} state
 * @param dispatch
 * @returns
 */


function createAnalyticsDispatch(_ref) {
  var getAttrsChanges = _ref.getAttrsChanges,
      inputMethod = _ref.inputMethod,
      state = _ref.state,
      dispatch = _ref.dispatch;
  return function (tr) {
    var currentTr = tr;
    var changes = getAttrsChanges(); // Get all attributes changes
    // Add analytics event for each change stored.

    changes.forEach(function (_ref2) {
      var node = _ref2.node,
          prevAttrs = _ref2.prevAttrs,
          newAttrs = _ref2.newAttrs,
          direction = _ref2.options.direction;
      var indentType = indentTypes[node.type.name];

      if (!indentType) {
        return; // If no valid indent type continue
      }

      currentTr = (0, _analytics.addAnalytics)(state, currentTr, {
        action: _analytics.ACTION.FORMATTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_INDENT,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: inputMethod,
          previousIndentationLevel: getPrevIndentLevel(prevAttrs),
          newIndentLevel: getNewIndentLevel(prevAttrs, newAttrs),
          direction: direction,
          indentType: indentType
        }
      });
    }); // Dispatch analytics if exist

    if (dispatch) {
      dispatch(tr);
    }
  };
}