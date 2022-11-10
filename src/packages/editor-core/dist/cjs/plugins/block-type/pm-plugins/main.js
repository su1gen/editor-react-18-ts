"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.createPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("@atlaskit/editor-common/utils");

var _types = require("../types");

var _utils2 = require("../../../utils");

var _commands = require("../commands");

var _analytics = require("../../analytics");

var _consts = require("../../../keymaps/consts");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var blockTypeForNode = function blockTypeForNode(node, schema) {
  if (node.type === schema.nodes.heading) {
    var maybeNode = _types.HEADINGS_BY_LEVEL[node.attrs['level']];

    if (maybeNode) {
      return maybeNode;
    }
  } else if (node.type === schema.nodes.paragraph) {
    return _types.NORMAL_TEXT;
  }

  return _types.OTHER;
};

var isBlockTypeSchemaSupported = function isBlockTypeSchemaSupported(blockType, state) {
  switch (blockType) {
    case _types.NORMAL_TEXT:
      return !!state.schema.nodes.paragraph;

    case _types.HEADING_1:
    case _types.HEADING_2:
    case _types.HEADING_3:
    case _types.HEADING_4:
    case _types.HEADING_5:
    case _types.HEADING_6:
      return !!state.schema.nodes.heading;

    case _types.BLOCK_QUOTE:
      return !!state.schema.nodes.blockquote;

    case _types.CODE_BLOCK:
      return !!state.schema.nodes.codeBlock;

    case _types.PANEL:
      return !!state.schema.nodes.panel;
  }

  return;
};

var detectBlockType = function detectBlockType(availableBlockTypes, state) {
  // Before a document is loaded, there is no selection.
  if (!state.selection) {
    return _types.NORMAL_TEXT;
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
      } else if (blockType !== _types.OTHER && blockType !== nodeBlockType[0]) {
        blockType = _types.OTHER;
      }
    }
  });
  return blockType || _types.OTHER;
};

var autoformatHeading = function autoformatHeading(headingLevel, view) {
  if (headingLevel === 0) {
    (0, _commands.setNormalTextWithAnalytics)(_analytics.INPUT_METHOD.FORMATTING)(view.state, view.dispatch);
  } else {
    (0, _commands.setHeadingWithAnalytics)(headingLevel, _analytics.INPUT_METHOD.FORMATTING)(view.state, view.dispatch);
  }

  return true;
};

var pluginKey = new _prosemirrorState.PluginKey('blockTypePlugin');
exports.pluginKey = pluginKey;

var createPlugin = function createPlugin(dispatch, lastNodeMustBeParagraph) {
  var altKeyLocation = 0;
  return new _safePlugin.SafePlugin({
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
        var availableBlockTypes = _types.TEXT_BLOCK_TYPES.filter(function (blockType) {
          return isBlockTypeSchemaSupported(blockType, state);
        });

        var availableWrapperBlockTypes = _types.WRAPPER_BLOCK_TYPES.filter(function (blockType) {
          return isBlockTypeSchemaSupported(blockType, state);
        });

        return {
          currentBlockType: detectBlockType(availableBlockTypes, state),
          blockTypesDisabled: (0, _utils2.areBlockTypesDisabled)(state),
          availableBlockTypes: availableBlockTypes,
          availableWrapperBlockTypes: availableWrapperBlockTypes
        };
      },
      apply: function apply(_tr, oldPluginState, _oldState, newState) {
        var newPluginState = _objectSpread(_objectSpread({}, oldPluginState), {}, {
          currentBlockType: detectBlockType(oldPluginState.availableBlockTypes, newState),
          blockTypesDisabled: (0, _utils2.areBlockTypesDisabled)(newState)
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
        var headingLevel = _consts.HEADING_KEYS.indexOf(event.keyCode);

        if (headingLevel > -1 && event.altKey) {
          if (_utils.browser.mac && event.metaKey) {
            return autoformatHeading(headingLevel, view);
          } else if (!_utils.browser.mac && event.ctrlKey && altKeyLocation !== event.DOM_KEY_LOCATION_RIGHT) {
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

exports.createPlugin = createPlugin;