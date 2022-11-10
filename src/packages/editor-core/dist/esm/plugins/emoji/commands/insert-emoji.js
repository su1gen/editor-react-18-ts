import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { safeInsert } from 'prosemirror-utils';
import { Fragment } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { addAnalytics, EVENT_TYPE, ACTION_SUBJECT_ID, ACTION_SUBJECT, ACTION } from '../../analytics';
export function insertEmoji(emojiId, inputMethod) {
  return function (state, dispatch) {
    var emoji = state.schema.nodes.emoji;

    if (emoji && emojiId) {
      var node = emoji.createChecked(_objectSpread(_objectSpread({}, emojiId), {}, {
        text: emojiId.fallback || emojiId.shortName
      }));
      var textNode = state.schema.text(' ');

      if (dispatch) {
        var fragment = Fragment.fromArray([node, textNode]);
        var tr = safeInsert(fragment)(state.tr);

        if (inputMethod) {
          addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
            attributes: {
              inputMethod: inputMethod
            },
            eventType: EVENT_TYPE.TRACK
          });
        }

        dispatch(tr.setSelection(Selection.near(tr.doc.resolve(state.selection.$from.pos + fragment.size))));
      }

      return true;
    }

    return false;
  };
}