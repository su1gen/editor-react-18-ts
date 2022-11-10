"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertEmoji = insertEmoji;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _analytics = require("../../analytics");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function insertEmoji(emojiId, inputMethod) {
  return function (state, dispatch) {
    var emoji = state.schema.nodes.emoji;

    if (emoji && emojiId) {
      var node = emoji.createChecked(_objectSpread(_objectSpread({}, emojiId), {}, {
        text: emojiId.fallback || emojiId.shortName
      }));
      var textNode = state.schema.text(' ');

      if (dispatch) {
        var fragment = _prosemirrorModel.Fragment.fromArray([node, textNode]);

        var tr = (0, _prosemirrorUtils.safeInsert)(fragment)(state.tr);

        if (inputMethod) {
          (0, _analytics.addAnalytics)(state, tr, {
            action: _analytics.ACTION.INSERTED,
            actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: _analytics.ACTION_SUBJECT_ID.EMOJI,
            attributes: {
              inputMethod: inputMethod
            },
            eventType: _analytics.EVENT_TYPE.TRACK
          });
        }

        dispatch(tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(state.selection.$from.pos + fragment.size))));
      }

      return true;
    }

    return false;
  };
}