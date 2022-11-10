import { PluginKey } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { shallowEqual } from '../../../utils';
import { getListItemAttributes, isInsideListItem } from '../../list/utils/selection';
import { getCurrentIndentLevel as getTaskListIndentLevel, getTaskItemIndex, isInsideTask } from '../../tasks-and-decisions/pm-plugins/helpers';
import { isIndentationAllowed, MAX_INDENTATION_LEVEL } from '../../indentation/commands';
export var pluginKey = new PluginKey('indentationButtonsPlugin');

function getIndentationButtonsState(editorState, allowHeadingAndParagraphIndentation) {
  var state = {
    indentDisabled: true,
    outdentDisabled: true,
    node: null
  };
  var selection = editorState.selection;
  var node = selection.$from.node(); // Handle bullet and numbered lists seperately as they do
  // not use the indentation mark.
  // Check for lists before paragraphs and headings in case
  // the selection is in a list nested in a layout column.

  if (isInsideListItem(editorState)) {
    var _getListItemAttribute = getListItemAttributes(selection.$head),
        indentLevel = _getListItemAttribute.indentLevel,
        itemIndex = _getListItemAttribute.itemIndex;

    return {
      // List indent levels are zero indexed so we need to subtract 1
      indentDisabled: itemIndex === 0 || indentLevel >= MAX_INDENTATION_LEVEL - 1,
      outdentDisabled: false,
      node: 'list'
    };
  } // Handle tasks seperately as they do not use the indentation mark
  // and have different behaviour for outdent compared to lists


  if (isInsideTask(editorState)) {
    var _indentLevel = getTaskListIndentLevel(selection) || 0;

    var _itemIndex = getTaskItemIndex(editorState);

    return {
      indentDisabled: _itemIndex === 0 || _indentLevel >= MAX_INDENTATION_LEVEL,
      outdentDisabled: _indentLevel <= 1,
      node: 'taskList'
    };
  }

  var isTopLevelParagraphOrHeading = selection.$from.depth === 1;
  var isInLayoutNode = hasParentNodeOfType(editorState.schema.nodes.layoutColumn)(selection) && // depth of non-nested paragraphs and headings in layouts will always be 3
  selection.$from.depth === 3;

  if (allowHeadingAndParagraphIndentation && isIndentationAllowed(editorState.schema, node) && (isTopLevelParagraphOrHeading || isInLayoutNode)) {
    var indentationMark = node.marks.find(function (mark) {
      return mark.type === editorState.schema.marks.indentation;
    });

    if (!indentationMark) {
      return {
        outdentDisabled: true,
        indentDisabled: false,
        node: 'paragraph_heading'
      };
    }

    return {
      indentDisabled: indentationMark.attrs.level >= MAX_INDENTATION_LEVEL,
      outdentDisabled: false,
      node: 'paragraph_heading'
    };
  }

  return state;
}

export var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      showIndentationButtons = _ref.showIndentationButtons,
      allowHeadingAndParagraphIndentation = _ref.allowHeadingAndParagraphIndentation;
  return new SafePlugin({
    state: {
      init: function init(_config, state) {
        var initialState = {
          indentDisabled: true,
          outdentDisabled: true,
          node: null
        };
        return showIndentationButtons ? getIndentationButtonsState(state, allowHeadingAndParagraphIndentation) : initialState;
      },
      apply: function apply(_tr, pluginState, _oldState, newState) {
        if (showIndentationButtons) {
          var state = getIndentationButtonsState(newState, allowHeadingAndParagraphIndentation);

          if (!shallowEqual(pluginState, state)) {
            dispatch(pluginKey, state);
            return state;
          }
        }

        return pluginState;
      }
    },
    key: pluginKey
  });
};