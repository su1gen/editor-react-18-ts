"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorKeymap = require("prosemirror-keymap");

var keymaps = _interopRequireWildcard(require("../../keymaps"));

var _analytics = require("../../plugins/analytics");

var _pluginKey = require("../../plugins/media/pm-plugins/plugin-key");

var _consts = require("../analytics/consts");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function createPlugin(eventDispatch, onSave) {
  if (!onSave) {
    return;
  }

  return (0, _prosemirrorKeymap.keymap)((0, _defineProperty2.default)({}, "".concat(keymaps.submit.common), function _(state, _dispatch, editorView) {
    var mediaState = _pluginKey.stateKey.getState(state);

    if (mediaState && mediaState.waitForMediaUpload && !mediaState.allUploadsFinished) {
      return true;
    }

    eventDispatch(_consts.analyticsEventKey, analyticsPayload(state));
    onSave(editorView);
    return true;
  }));
}

var analyticsPayload = function analyticsPayload(state) {
  return {
    payload: {
      action: _analytics.ACTION.STOPPED,
      actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.SAVE,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.SHORTCUT,
        documentSize: state.doc.nodeSize // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks

      },
      eventType: _analytics.EVENT_TYPE.UI
    }
  };
};

var submitEditorPlugin = function submitEditorPlugin(onSave) {
  return {
    name: 'submitEditor',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'submitEditor',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, onSave);
        }
      }];
    }
  };
};

var _default = submitEditorPlugin;
exports.default = _default;