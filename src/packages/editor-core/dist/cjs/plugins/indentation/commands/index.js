"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeIndentation = exports.isIndentationAllowed = exports.getOutdentCommand = exports.getIndentCommand = exports.MAX_INDENTATION_LEVEL = void 0;

var _commands = require("../../../commands");

var _utils = require("./utils");

var _analytics = require("../../analytics");

var _getAttrsWithChangesRecorder = _interopRequireDefault(require("../../../utils/getAttrsWithChangesRecorder"));

var MAX_INDENTATION_LEVEL = 6;
exports.MAX_INDENTATION_LEVEL = MAX_INDENTATION_LEVEL;

var isIndentationAllowed = function isIndentationAllowed(schema, node) {
  var _schema$nodes = schema.nodes,
      paragraph = _schema$nodes.paragraph,
      heading = _schema$nodes.heading,
      alignment = schema.marks.alignment;

  if ([paragraph, heading].indexOf(node.type) > -1) {
    if (alignment) {
      var hasAlignment = node.marks.filter(function (mark) {
        return mark.type === alignment;
      })[0];
      return !hasAlignment;
    }

    return true;
  }

  return false;
};
/**
 * Create new indentation command (Either indent or outdent depend of getArgsFn)
 * @param getNewIndentationAttrs Function to handle new indentation level
 */


exports.isIndentationAllowed = isIndentationAllowed;

function createIndentationCommand(getNewIndentationAttrs) {
  return function (state, dispatch) {
    var indentation = state.schema.marks.indentation;
    return (0, _commands.toggleBlockMark)(indentation, getNewIndentationAttrs, isIndentationAllowed)(state, dispatch);
  };
}

function createIndentationCommandWithAnalytics(_ref) {
  var getNewIndentationAttrs = _ref.getNewIndentationAttrs,
      direction = _ref.direction,
      inputMethod = _ref.inputMethod;

  // Create a new getAttrs function to record the changes
  var _getAttrsWithChangesR = (0, _getAttrsWithChangesRecorder.default)(getNewIndentationAttrs, {
    direction: direction
  }),
      getAttrs = _getAttrsWithChangesR.getAttrs,
      getAndResetAttrsChanges = _getAttrsWithChangesR.getAndResetAttrsChanges; // Use new getAttrs wrapper


  var indentationCommand = createIndentationCommand(getAttrs); // Return a new command where we change dispatch for our analytics dispatch

  return function (state, dispatch) {
    return indentationCommand(state, (0, _utils.createAnalyticsDispatch)({
      getAttrsChanges: getAndResetAttrsChanges,
      inputMethod: inputMethod,
      state: state,
      dispatch: dispatch
    }));
  };
}
/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesn't exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */


var getIndentAttrs = function getIndentAttrs(oldAttr) {
  if (!oldAttr) {
    return {
      level: 1
    }; // No mark exist, create a new one with level 1
  }

  var level = oldAttr.level;

  if (level >= MAX_INDENTATION_LEVEL) {
    return undefined; // Max indentation level reached, do nothing.
  }

  return {
    level: level + 1
  }; // Otherwise, increase the level by one
};

var getIndentCommand = function getIndentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getIndentAttrs,
    direction: _analytics.INDENT_DIRECTION.INDENT,
    inputMethod: inputMethod
  });
};
/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesn't exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */


exports.getIndentCommand = getIndentCommand;

var getOutdentAttrs = function getOutdentAttrs(oldAttr) {
  if (!oldAttr) {
    return undefined; // Do nothing;
  }

  var level = oldAttr.level;

  if (level <= 1) {
    return false; // Remove the mark
  }

  return {
    level: level - 1
  }; // Decrease the level on other cases
};

var getOutdentCommand = function getOutdentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getOutdentAttrs,
    direction: _analytics.INDENT_DIRECTION.OUTDENT,
    inputMethod: inputMethod
  });
};

exports.getOutdentCommand = getOutdentCommand;

var removeIndentation = function removeIndentation(state, dispatch) {
  return (0, _commands.toggleBlockMark)(state.schema.marks.indentation, function () {
    return false;
  })(state, dispatch);
};

exports.removeIndentation = removeIndentation;