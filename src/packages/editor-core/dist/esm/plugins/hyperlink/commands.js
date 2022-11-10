import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { normalizeUrl } from './utils';
import { stateKey, LinkAction } from './pm-plugins/main';
import { Selection } from 'prosemirror-state';
import { filter } from '../../utils/commands';
import { addAnalytics, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID, withAnalytics } from '../analytics';
import { queueCardsFromChangedTr } from '../card/pm-plugins/doc';
import { getLinkCreationAnalyticsEvent } from './analytics';
import { buildEditLinkPayload, unlinkPayload } from '../../utils/linking-utils';
export function isTextAtPos(pos) {
  return function (state) {
    var node = state.doc.nodeAt(pos);
    return !!node && node.isText;
  };
}
export function isLinkAtPos(pos) {
  return function (state) {
    var node = state.doc.nodeAt(pos);
    return !!node && state.schema.marks.link.isInSet(node.marks);
  };
}
export function setLinkHref(href, pos, to, isTabPressed) {
  return filter(isTextAtPos(pos), function (state, dispatch) {
    var $pos = state.doc.resolve(pos);
    var node = state.doc.nodeAt(pos);
    var linkMark = state.schema.marks.link;
    var mark = linkMark.isInSet(node.marks);
    var url = normalizeUrl(href);

    if (mark && mark.attrs.href === url) {
      return false;
    }

    var rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;
    var tr = state.tr.removeMark(pos, rightBound, linkMark);

    if (href.trim()) {
      tr.addMark(pos, rightBound, linkMark.create(_objectSpread(_objectSpread({}, mark && mark.attrs || {}), {}, {
        href: url
      })));
    } else {
      addAnalytics(state, tr, unlinkPayload(ACTION_SUBJECT_ID.HYPERLINK));
    }

    if (!isTabPressed) {
      tr.setMeta(stateKey, {
        type: LinkAction.HIDE_TOOLBAR
      });
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  });
}
export function updateLink(href, text, pos, to) {
  return function (state, dispatch) {
    var $pos = state.doc.resolve(pos);
    var node = state.doc.nodeAt(pos);

    if (!node) {
      return false;
    }

    var url = normalizeUrl(href);
    var mark = state.schema.marks.link.isInSet(node.marks);
    var linkMark = state.schema.marks.link;
    var rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;
    var tr = state.tr;

    if (!url && text) {
      tr.removeMark(pos, rightBound, linkMark);
      tr.insertText(text, pos, rightBound);
    } else if (!url) {
      return false;
    } else {
      tr.insertText(text, pos, rightBound); // Casting to LinkAttributes to prevent wrong attributes been passed (Example ED-7951)

      var linkAttrs = _objectSpread(_objectSpread({}, mark && mark.attrs || {}), {}, {
        href: url
      });

      tr.addMark(pos, pos + text.length, linkMark.create(linkAttrs));
      tr.setMeta(stateKey, {
        type: LinkAction.HIDE_TOOLBAR
      });
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export function insertLink(from, to, incomingHref, incomingTitle, displayText, source) {
  return function (state, dispatch) {
    var link = state.schema.marks.link;
    var tr = state.tr;

    if (incomingHref.trim()) {
      var normalizedUrl = normalizeUrl(incomingHref); // NB: in this context, `currentText` represents text which has been
      // highlighted in the Editor, upon which a link is is being added.

      var currentText = stateKey.getState(state).activeText;
      var markEnd = to;
      var text = displayText || incomingTitle || incomingHref;

      if (!displayText || displayText !== currentText) {
        tr.insertText(text, from, to);

        if (!isTextAtPos(from)(state)) {
          markEnd = from + text.length + 1;
        } else {
          markEnd = from + text.length;
        }
      }

      tr.addMark(from, markEnd, link.create({
        href: normalizedUrl
      }));
      tr.setSelection(Selection.near(tr.doc.resolve(markEnd)));

      if (!displayText || displayText === incomingHref) {
        queueCardsFromChangedTr(state, tr, source, false);
      }

      tr.setMeta(stateKey, {
        type: LinkAction.HIDE_TOOLBAR
      });

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    tr.setMeta(stateKey, {
      type: LinkAction.HIDE_TOOLBAR
    });

    if (dispatch) {
      dispatch(tr);
    }

    return false;
  };
}
export var insertLinkWithAnalytics = function insertLinkWithAnalytics(inputMethod, from, to, href, title, displayText) {
  var cardsAvailable = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  // If smart cards are available, we send analytics for hyperlinks when a smart link is rejected.
  if (cardsAvailable && !title && !displayText) {
    return insertLink(from, to, href, title, displayText, inputMethod);
  }

  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};
export var insertLinkWithAnalyticsMobileNative = function insertLinkWithAnalyticsMobileNative(inputMethod, from, to, href, title, displayText) {
  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};
export function removeLink(pos) {
  return setLinkHref('', pos);
}
export function editInsertedLink() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(addAnalytics(state, state.tr.setMeta(stateKey, {
        type: LinkAction.EDIT_INSERTED_TOOLBAR,
        inputMethod: INPUT_METHOD.FLOATING_TB
      }), buildEditLinkPayload(ACTION_SUBJECT_ID.HYPERLINK)));
    }

    return true;
  };
}
export function showLinkToolbar() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.TOOLBAR;
  return function (state, dispatch) {
    if (dispatch) {
      var tr = state.tr.setMeta(stateKey, {
        type: LinkAction.SHOW_INSERT_TOOLBAR,
        inputMethod: inputMethod
      });
      tr = addAnalytics(state, tr, {
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
        attributes: {
          inputMethod: inputMethod
        },
        eventType: EVENT_TYPE.UI
      });
      dispatch(tr);
    }

    return true;
  };
}
export function hideLinkToolbar() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(stateKey, {
        type: LinkAction.HIDE_TOOLBAR
      }));
    }

    return true;
  };
}