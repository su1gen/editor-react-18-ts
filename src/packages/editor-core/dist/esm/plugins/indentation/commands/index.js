import { toggleBlockMark } from '../../../commands';
import { createAnalyticsDispatch } from './utils';
import { INDENT_DIRECTION, INPUT_METHOD } from '../../analytics';
import getAttrsWithChangesRecorder from '../../../utils/getAttrsWithChangesRecorder';
export var MAX_INDENTATION_LEVEL = 6;
export var isIndentationAllowed = function isIndentationAllowed(schema, node) {
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

function createIndentationCommand(getNewIndentationAttrs) {
  return function (state, dispatch) {
    var indentation = state.schema.marks.indentation;
    return toggleBlockMark(indentation, getNewIndentationAttrs, isIndentationAllowed)(state, dispatch);
  };
}

function createIndentationCommandWithAnalytics(_ref) {
  var getNewIndentationAttrs = _ref.getNewIndentationAttrs,
      direction = _ref.direction,
      inputMethod = _ref.inputMethod;

  // Create a new getAttrs function to record the changes
  var _getAttrsWithChangesR = getAttrsWithChangesRecorder(getNewIndentationAttrs, {
    direction: direction
  }),
      getAttrs = _getAttrsWithChangesR.getAttrs,
      getAndResetAttrsChanges = _getAttrsWithChangesR.getAndResetAttrsChanges; // Use new getAttrs wrapper


  var indentationCommand = createIndentationCommand(getAttrs); // Return a new command where we change dispatch for our analytics dispatch

  return function (state, dispatch) {
    return indentationCommand(state, createAnalyticsDispatch({
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

export var getIndentCommand = function getIndentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getIndentAttrs,
    direction: INDENT_DIRECTION.INDENT,
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

export var getOutdentCommand = function getOutdentCommand() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return createIndentationCommandWithAnalytics({
    getNewIndentationAttrs: getOutdentAttrs,
    direction: INDENT_DIRECTION.OUTDENT,
    inputMethod: inputMethod
  });
};
export var removeIndentation = function removeIndentation(state, dispatch) {
  return toggleBlockMark(state.schema.marks.indentation, function () {
    return false;
  })(state, dispatch);
};