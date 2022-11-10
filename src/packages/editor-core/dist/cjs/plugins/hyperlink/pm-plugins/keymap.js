"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKeymapPlugin = createKeymapPlugin;
exports.default = void 0;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _adfSchema = require("@atlaskit/adf-schema");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _main = require("../pm-plugins/main");

var _commands = require("../commands");

var _analytics = require("../../analytics");

var _analytics2 = require("../analytics");

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function createKeymapPlugin() {
  var skipAnalytics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.addLink.common, (0, _commands.showLinkToolbar)(_analytics.INPUT_METHOD.SHORTCUT), list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.escape.common, function (state, dispatch, view) {
    var hyperlinkPlugin = _main.stateKey.getState(state);

    if (hyperlinkPlugin.activeLinkMark) {
      (0, _commands.hideLinkToolbar)()(state, dispatch);

      if (view) {
        view.focus();
      }

      return false;
    }

    return false;
  }, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var mayConvertLastWordToHyperlink = function mayConvertLastWordToHyperlink(skipAnalytics) {
  return function (state, dispatch) {
    var nodeBefore = state.selection.$from.nodeBefore;

    if (!nodeBefore || !nodeBefore.isText || !nodeBefore.text) {
      return false;
    }

    var words = nodeBefore.text.split(' ');
    var lastWord = words[words.length - 1];
    var match = (0, _adfSchema.getLinkMatch)(lastWord);

    if (match) {
      var hyperlinkedText = match.raw;
      var start = state.selection.$from.pos - hyperlinkedText.length;
      var end = state.selection.$from.pos;

      if (state.doc.rangeHasMark(start, end, state.schema.marks.link)) {
        return false;
      }

      var url = match.url;
      var markType = state.schema.mark('link', {
        href: url
      });
      var filepaths = (0, _utils.findFilepaths)(nodeBefore.text, start - (nodeBefore.text.length - hyperlinkedText.length) // The position referenced by 'start' is relative to the start of the document, findFilepaths deals with index in a node only.
      );

      if ((0, _utils.isLinkInMatches)(start, filepaths)) {
        return false;
      }

      var tr = state.tr.addMark(start, end, markType);

      if (dispatch) {
        if (skipAnalytics) {
          dispatch(tr);
        } else {
          dispatch((0, _analytics.addAnalytics)(state, tr, (0, _analytics2.getLinkCreationAnalyticsEvent)(_analytics.INPUT_METHOD.AUTO_DETECT, url)));
        }
      }
    }

    return false;
  };
};

var _default = createKeymapPlugin;
exports.default = _default;