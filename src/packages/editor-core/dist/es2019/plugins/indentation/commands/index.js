import { toggleBlockMark } from '../../../commands';
import { createAnalyticsDispatch } from './utils';
import { INDENT_DIRECTION, INPUT_METHOD } from '../../analytics';
import getAttrsWithChangesRecorder from '../../../utils/getAttrsWithChangesRecorder';
export const MAX_INDENTATION_LEVEL = 6;
export const isIndentationAllowed = (schema, node) => {
  const {
    nodes: {
      paragraph,
      heading
    },
    marks: {
      alignment
    }
  } = schema;

  if ([paragraph, heading].indexOf(node.type) > -1) {
    if (alignment) {
      const hasAlignment = node.marks.filter(mark => mark.type === alignment)[0];
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
  return (state, dispatch) => {
    const {
      indentation
    } = state.schema.marks;
    return toggleBlockMark(indentation, getNewIndentationAttrs, isIndentationAllowed)(state, dispatch);
  };
}

function createIndentationCommandWithAnalytics({
  getNewIndentationAttrs,
  direction,
  inputMethod
}) {
  // Create a new getAttrs function to record the changes
  const {
    getAttrs,
    getAndResetAttrsChanges
  } = getAttrsWithChangesRecorder(getNewIndentationAttrs, {
    direction
  }); // Use new getAttrs wrapper

  const indentationCommand = createIndentationCommand(getAttrs); // Return a new command where we change dispatch for our analytics dispatch

  return (state, dispatch) => {
    return indentationCommand(state, createAnalyticsDispatch({
      getAttrsChanges: getAndResetAttrsChanges,
      inputMethod,
      state,
      dispatch
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


const getIndentAttrs = oldAttr => {
  if (!oldAttr) {
    return {
      level: 1
    }; // No mark exist, create a new one with level 1
  }

  const {
    level
  } = oldAttr;

  if (level >= MAX_INDENTATION_LEVEL) {
    return undefined; // Max indentation level reached, do nothing.
  }

  return {
    level: level + 1
  }; // Otherwise, increase the level by one
};

export const getIndentCommand = (inputMethod = INPUT_METHOD.KEYBOARD) => createIndentationCommandWithAnalytics({
  getNewIndentationAttrs: getIndentAttrs,
  direction: INDENT_DIRECTION.INDENT,
  inputMethod
});
/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesn't exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */

const getOutdentAttrs = oldAttr => {
  if (!oldAttr) {
    return undefined; // Do nothing;
  }

  const {
    level
  } = oldAttr;

  if (level <= 1) {
    return false; // Remove the mark
  }

  return {
    level: level - 1
  }; // Decrease the level on other cases
};

export const getOutdentCommand = (inputMethod = INPUT_METHOD.KEYBOARD) => createIndentationCommandWithAnalytics({
  getNewIndentationAttrs: getOutdentAttrs,
  direction: INDENT_DIRECTION.OUTDENT,
  inputMethod
});
export const removeIndentation = (state, dispatch) => toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);