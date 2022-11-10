"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});

var _prosemirrorCommands = require("prosemirror-commands");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _utils = require("../../../utils");

var commands = _interopRequireWildcard(require("../commands/text-formatting"));

var _utils2 = require("../utils");

var _pluginKey = require("./plugin-key");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-next-line no-duplicate-imports
var getTextFormattingState = function getTextFormattingState(editorState) {
  var _editorState$schema$m = editorState.schema.marks,
      em = _editorState$schema$m.em,
      code = _editorState$schema$m.code,
      strike = _editorState$schema$m.strike,
      strong = _editorState$schema$m.strong,
      subsup = _editorState$schema$m.subsup,
      underline = _editorState$schema$m.underline;
  var state = {};

  if (code) {
    state.codeActive = (0, _utils2.anyMarkActive)(editorState, code.create());
    state.codeDisabled = !(0, _prosemirrorCommands.toggleMark)(code)(editorState);
  }

  if (em) {
    state.emActive = (0, _utils2.anyMarkActive)(editorState, em);
    state.emDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(em)(editorState);
  }

  if (strike) {
    state.strikeActive = (0, _utils2.anyMarkActive)(editorState, strike);
    state.strikeDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(strike)(editorState);
  }

  if (strong) {
    state.strongActive = (0, _utils2.anyMarkActive)(editorState, strong);
    state.strongDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(strong)(editorState);
  }

  if (subsup) {
    var subMark = subsup.create({
      type: 'sub'
    });
    var supMark = subsup.create({
      type: 'sup'
    });
    state.subscriptActive = (0, _utils2.anyMarkActive)(editorState, subMark);
    state.subscriptDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(subsup, {
      type: 'sub'
    })(editorState);
    state.superscriptActive = (0, _utils2.anyMarkActive)(editorState, supMark);
    state.superscriptDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(subsup, {
      type: 'sup'
    })(editorState);
  }

  if (underline) {
    state.underlineActive = (0, _utils2.anyMarkActive)(editorState, underline);
    state.underlineDisabled = state.codeActive ? true : !(0, _prosemirrorCommands.toggleMark)(underline)(editorState);
  }

  return state;
};

var plugin = function plugin(dispatch) {
  return new _safePlugin.SafePlugin({
    state: {
      init: function init(_config, state) {
        return getTextFormattingState(state);
      },
      apply: function apply(_tr, pluginState, _oldState, newState) {
        var state = getTextFormattingState(newState);

        if (!(0, _utils.shallowEqual)(pluginState, state)) {
          dispatch(_pluginKey.pluginKey, state);
          return state;
        }

        return pluginState;
      }
    },
    key: _pluginKey.pluginKey,
    props: {
      handleKeyDown: function handleKeyDown(view, event) {
        var state = view.state,
            dispatch = view.dispatch;

        if (event.key === keymaps.moveRight.common && !event.metaKey) {
          return commands.moveRight()(state, dispatch);
        } else if (event.key === keymaps.moveLeft.common && !event.metaKey) {
          return commands.moveLeft()(state, dispatch);
        }

        return false;
      },
      handleTextInput: function handleTextInput(view, from, to, text) {
        var state = view.state,
            dispatch = view.dispatch;
        var schema = state.schema,
            parentNodeType = state.selection.$from.parent.type;

        if (parentNodeType.allowsMarkType(schema.marks.code)) {
          return (0, commands.createInlineCodeFromTextInputWithAnalytics)(from, to, text)(state, dispatch);
        }

        return false;
      }
    }
  });
};

exports.plugin = plugin;