import { normalizeUrl } from './utils';
import { stateKey, LinkAction } from './pm-plugins/main';
import { Selection } from 'prosemirror-state';
import { filter } from '../../utils/commands';
import { addAnalytics, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID, withAnalytics } from '../analytics';
import { queueCardsFromChangedTr } from '../card/pm-plugins/doc';
import { getLinkCreationAnalyticsEvent } from './analytics';
import { buildEditLinkPayload, unlinkPayload } from '../../utils/linking-utils';
export function isTextAtPos(pos) {
  return state => {
    const node = state.doc.nodeAt(pos);
    return !!node && node.isText;
  };
}
export function isLinkAtPos(pos) {
  return state => {
    const node = state.doc.nodeAt(pos);
    return !!node && state.schema.marks.link.isInSet(node.marks);
  };
}
export function setLinkHref(href, pos, to, isTabPressed) {
  return filter(isTextAtPos(pos), (state, dispatch) => {
    const $pos = state.doc.resolve(pos);
    const node = state.doc.nodeAt(pos);
    const linkMark = state.schema.marks.link;
    const mark = linkMark.isInSet(node.marks);
    const url = normalizeUrl(href);

    if (mark && mark.attrs.href === url) {
      return false;
    }

    const rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;
    const tr = state.tr.removeMark(pos, rightBound, linkMark);

    if (href.trim()) {
      tr.addMark(pos, rightBound, linkMark.create({ ...(mark && mark.attrs || {}),
        href: url
      }));
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
  return (state, dispatch) => {
    const $pos = state.doc.resolve(pos);
    const node = state.doc.nodeAt(pos);

    if (!node) {
      return false;
    }

    const url = normalizeUrl(href);
    const mark = state.schema.marks.link.isInSet(node.marks);
    const linkMark = state.schema.marks.link;
    const rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;
    const tr = state.tr;

    if (!url && text) {
      tr.removeMark(pos, rightBound, linkMark);
      tr.insertText(text, pos, rightBound);
    } else if (!url) {
      return false;
    } else {
      tr.insertText(text, pos, rightBound); // Casting to LinkAttributes to prevent wrong attributes been passed (Example ED-7951)

      const linkAttrs = { ...(mark && mark.attrs || {}),
        href: url
      };
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
  return (state, dispatch) => {
    const link = state.schema.marks.link;
    const {
      tr
    } = state;

    if (incomingHref.trim()) {
      const normalizedUrl = normalizeUrl(incomingHref); // NB: in this context, `currentText` represents text which has been
      // highlighted in the Editor, upon which a link is is being added.

      const currentText = stateKey.getState(state).activeText;
      let markEnd = to;
      const text = displayText || incomingTitle || incomingHref;

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
export const insertLinkWithAnalytics = (inputMethod, from, to, href, title, displayText, cardsAvailable = false) => {
  // If smart cards are available, we send analytics for hyperlinks when a smart link is rejected.
  if (cardsAvailable && !title && !displayText) {
    return insertLink(from, to, href, title, displayText, inputMethod);
  }

  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};
export const insertLinkWithAnalyticsMobileNative = (inputMethod, from, to, href, title, displayText) => {
  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};
export function removeLink(pos) {
  return setLinkHref('', pos);
}
export function editInsertedLink() {
  return (state, dispatch) => {
    if (dispatch) {
      dispatch(addAnalytics(state, state.tr.setMeta(stateKey, {
        type: LinkAction.EDIT_INSERTED_TOOLBAR,
        inputMethod: INPUT_METHOD.FLOATING_TB
      }), buildEditLinkPayload(ACTION_SUBJECT_ID.HYPERLINK)));
    }

    return true;
  };
}
export function showLinkToolbar(inputMethod = INPUT_METHOD.TOOLBAR) {
  return function (state, dispatch) {
    if (dispatch) {
      let tr = state.tr.setMeta(stateKey, {
        type: LinkAction.SHOW_INSERT_TOOLBAR,
        inputMethod
      });
      tr = addAnalytics(state, tr, {
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
        attributes: {
          inputMethod
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