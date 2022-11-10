"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.createPlugin = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _utils = require("../../../utils");

var _selection = require("../../list/utils/selection");

var _helpers = require("../../tasks-and-decisions/pm-plugins/helpers");

var _commands = require("../../indentation/commands");

var pluginKey = new _prosemirrorState.PluginKey('indentationButtonsPlugin');
exports.pluginKey = pluginKey;

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

  if ((0, _selection.isInsideListItem)(editorState)) {
    var _getListItemAttribute = (0, _selection.getListItemAttributes)(selection.$head),
        indentLevel = _getListItemAttribute.indentLevel,
        itemIndex = _getListItemAttribute.itemIndex;

    return {
      // List indent levels are zero indexed so we need to subtract 1
      indentDisabled: itemIndex === 0 || indentLevel >= _commands.MAX_INDENTATION_LEVEL - 1,
      outdentDisabled: false,
      node: 'list'
    };
  } // Handle tasks seperately as they do not use the indentation mark
  // and have different behaviour for outdent compared to lists


  if ((0, _helpers.isInsideTask)(editorState)) {
    var _indentLevel = (0, _helpers.getCurrentIndentLevel)(selection) || 0;

    var _itemIndex = (0, _helpers.getTaskItemIndex)(editorState);

    return {
      indentDisabled: _itemIndex === 0 || _indentLevel >= _commands.MAX_INDENTATION_LEVEL,
      outdentDisabled: _indentLevel <= 1,
      node: 'taskList'
    };
  }

  var isTopLevelParagraphOrHeading = selection.$from.depth === 1;
  var isInLayoutNode = (0, _prosemirrorUtils.hasParentNodeOfType)(editorState.schema.nodes.layoutColumn)(selection) && // depth of non-nested paragraphs and headings in layouts will always be 3
  selection.$from.depth === 3;

  if (allowHeadingAndParagraphIndentation && (0, _commands.isIndentationAllowed)(editorState.schema, node) && (isTopLevelParagraphOrHeading || isInLayoutNode)) {
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
      indentDisabled: indentationMark.attrs.level >= _commands.MAX_INDENTATION_LEVEL,
      outdentDisabled: false,
      node: 'paragraph_heading'
    };
  }

  return state;
}

var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      showIndentationButtons = _ref.showIndentationButtons,
      allowHeadingAndParagraphIndentation = _ref.allowHeadingAndParagraphIndentation;
  return new _safePlugin.SafePlugin({
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

          if (!(0, _utils.shallowEqual)(pluginState, state)) {
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

exports.createPlugin = createPlugin;