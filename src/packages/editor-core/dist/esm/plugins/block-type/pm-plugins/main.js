import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { browser } from '@atlaskit/editor-common/utils';
import { NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6, BLOCK_QUOTE, CODE_BLOCK, PANEL, OTHER, TEXT_BLOCK_TYPES, WRAPPER_BLOCK_TYPES, HEADINGS_BY_LEVEL } from '../types';
import { areBlockTypesDisabled } from '../../../utils';
import { setHeadingWithAnalytics, setNormalTextWithAnalytics } from '../commands';
import { INPUT_METHOD } from '../../analytics';
import { HEADING_KEYS } from '../../../keymaps/consts';

var blockTypeForNode = function blockTypeForNode(node, schema) {
  if (node.type === schema.nodes.heading) {
    var maybeNode = HEADINGS_BY_LEVEL[node.attrs['level']];

    if (maybeNode) {
      return maybeNode;
    }
  } else if (node.type === schema.nodes.paragraph) {
    return NORMAL_TEXT;
  }

  return OTHER;
};

var isBlockTypeSchemaSupported = function isBlockTypeSchemaSupported(blockType, state) {
  switch (blockType) {
    case NORMAL_TEXT:
      return !!state.schema.nodes.paragraph;

    case HEADING_1:
    case HEADING_2:
    case HEADING_3:
    case HEADING_4:
    case HEADING_5:
    case HEADING_6:
      return !!state.schema.nodes.heading;

    case BLOCK_QUOTE:
      return !!state.schema.nodes.blockquote;

    case CODE_BLOCK:
      return !!state.schema.nodes.codeBlock;

    case PANEL:
      return !!state.schema.nodes.panel;
  }

  return;
};

var detectBlockType = function detectBlockType(availableBlockTypes, state) {
  // Before a document is loaded, there is no selection.
  if (!state.selection) {
    return NORMAL_TEXT;
  }

  var blockType;
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  state.doc.nodesBetween($from.pos, $to.pos, function (node) {
    var nodeBlockType = availableBlockTypes.filter(function (blockType) {
      return blockType === blockTypeForNode(node, state.schema);
    });

    if (nodeBlockType.length > 0) {
      if (!blockType) {
        blockType = nodeBlockType[0];
      } else if (blockType !== OTHER && blockType !== nodeBlockType[0]) {
        blockType = OTHER;
      }
    }
  });
  return blockType || OTHER;
};

var autoformatHeading = function autoformatHeading(headingLevel, view) {
  if (headingLevel === 0) {
    setNormalTextWithAnalytics(INPUT_METHOD.FORMATTING)(view.state, view.dispatch);
  } else {
    setHeadingWithAnalytics(headingLevel, INPUT_METHOD.FORMATTING)(view.state, view.dispatch);
  }

  return true;
};

export var pluginKey = new PluginKey('blockTypePlugin');
export var createPlugin = function createPlugin(dispatch, lastNodeMustBeParagraph) {
  var altKeyLocation = 0;
  return new SafePlugin({
    appendTransaction: function appendTransaction(_transactions, _oldState, newState) {
      if (lastNodeMustBeParagraph) {
        var pos = newState.doc.resolve(newState.doc.content.size - 1);
        var lastNode = pos.node(1);
        var paragraph = newState.schema.nodes.paragraph;

        if (lastNode && lastNode.isBlock && lastNode.type !== paragraph) {
          return newState.tr.insert(newState.doc.content.size, newState.schema.nodes.paragraph.create()).setMeta('addToHistory', false);
        }
      }
    },
    state: {
      init: function init(_config, state) {
        var availableBlockTypes = TEXT_BLOCK_TYPES.filter(function (blockType) {
          return isBlockTypeSchemaSupported(blockType, state);
        });
        var availableWrapperBlockTypes = WRAPPER_BLOCK_TYPES.filter(function (blockType) {
          return isBlockTypeSchemaSupported(blockType, state);
        });
        return {
          currentBlockType: detectBlockType(availableBlockTypes, state),
          blockTypesDisabled: areBlockTypesDisabled(state),
          availableBlockTypes: availableBlockTypes,
          availableWrapperBlockTypes: availableWrapperBlockTypes
        };
      },
      apply: function apply(_tr, oldPluginState, _oldState, newState) {
        var newPluginState = _objectSpread(_objectSpread({}, oldPluginState), {}, {
          currentBlockType: detectBlockType(oldPluginState.availableBlockTypes, newState),
          blockTypesDisabled: areBlockTypesDisabled(newState)
        });

        if (newPluginState.currentBlockType !== oldPluginState.currentBlockType || newPluginState.blockTypesDisabled !== oldPluginState.blockTypesDisabled) {
          dispatch(pluginKey, newPluginState);
        }

        return newPluginState;
      }
    },
    key: pluginKey,
    props: {
      /**
       * As we only want the left alt key to work for headings shortcuts on Windows
       * we can't use prosemirror-keymap and need to handle these shortcuts specially
       * Shortcut on Mac: Cmd-Opt-{heading level}
       * Shortcut on Windows: Ctrl-LeftAlt-{heading level}
       */
      handleKeyDown: function handleKeyDown(view, event) {
        var headingLevel = HEADING_KEYS.indexOf(event.keyCode);

        if (headingLevel > -1 && event.altKey) {
          if (browser.mac && event.metaKey) {
            return autoformatHeading(headingLevel, view);
          } else if (!browser.mac && event.ctrlKey && altKeyLocation !== event.DOM_KEY_LOCATION_RIGHT) {
            return autoformatHeading(headingLevel, view);
          }
        } else if (event.key === 'Alt') {
          // event.location is for the current key only; when a user hits Ctrl-Alt-1 the
          // location refers to the location of the '1' key
          // We store the location of the Alt key when it is hit to check against later
          altKeyLocation = event.location;
        } else if (!event.altKey) {
          altKeyLocation = 0;
        }

        return false;
      }
    }
  });
};