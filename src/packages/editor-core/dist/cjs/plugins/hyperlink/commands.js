"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editInsertedLink = editInsertedLink;
exports.hideLinkToolbar = hideLinkToolbar;
exports.insertLink = insertLink;
exports.insertLinkWithAnalyticsMobileNative = exports.insertLinkWithAnalytics = void 0;
exports.isLinkAtPos = isLinkAtPos;
exports.isTextAtPos = isTextAtPos;
exports.removeLink = removeLink;
exports.setLinkHref = setLinkHref;
exports.showLinkToolbar = showLinkToolbar;
exports.updateLink = updateLink;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("./utils");

var _main = require("./pm-plugins/main");

var _prosemirrorState = require("prosemirror-state");

var _commands = require("../../utils/commands");

var _analytics = require("../analytics");

var _doc = require("../card/pm-plugins/doc");

var _analytics2 = require("./analytics");

var _linkingUtils = require("../../utils/linking-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function isTextAtPos(pos) {
  return function (state) {
    var node = state.doc.nodeAt(pos);
    return !!node && node.isText;
  };
}

function isLinkAtPos(pos) {
  return function (state) {
    var node = state.doc.nodeAt(pos);
    return !!node && state.schema.marks.link.isInSet(node.marks);
  };
}

function setLinkHref(href, pos, to, isTabPressed) {
  return (0, _commands.filter)(isTextAtPos(pos), function (state, dispatch) {
    var $pos = state.doc.resolve(pos);
    var node = state.doc.nodeAt(pos);
    var linkMark = state.schema.marks.link;
    var mark = linkMark.isInSet(node.marks);
    var url = (0, _utils.normalizeUrl)(href);

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
      (0, _analytics.addAnalytics)(state, tr, (0, _linkingUtils.unlinkPayload)(_analytics.ACTION_SUBJECT_ID.HYPERLINK));
    }

    if (!isTabPressed) {
      tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.HIDE_TOOLBAR
      });
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  });
}

function updateLink(href, text, pos, to) {
  return function (state, dispatch) {
    var $pos = state.doc.resolve(pos);
    var node = state.doc.nodeAt(pos);

    if (!node) {
      return false;
    }

    var url = (0, _utils.normalizeUrl)(href);
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
      tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.HIDE_TOOLBAR
      });
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function insertLink(from, to, incomingHref, incomingTitle, displayText, source) {
  return function (state, dispatch) {
    var link = state.schema.marks.link;
    var tr = state.tr;

    if (incomingHref.trim()) {
      var normalizedUrl = (0, _utils.normalizeUrl)(incomingHref); // NB: in this context, `currentText` represents text which has been
      // highlighted in the Editor, upon which a link is is being added.

      var currentText = _main.stateKey.getState(state).activeText;

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
      tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(markEnd)));

      if (!displayText || displayText === incomingHref) {
        (0, _doc.queueCardsFromChangedTr)(state, tr, source, false);
      }

      tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.HIDE_TOOLBAR
      });

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    tr.setMeta(_main.stateKey, {
      type: _main.LinkAction.HIDE_TOOLBAR
    });

    if (dispatch) {
      dispatch(tr);
    }

    return false;
  };
}

var insertLinkWithAnalytics = function insertLinkWithAnalytics(inputMethod, from, to, href, title, displayText) {
  var cardsAvailable = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  // If smart cards are available, we send analytics for hyperlinks when a smart link is rejected.
  if (cardsAvailable && !title && !displayText) {
    return insertLink(from, to, href, title, displayText, inputMethod);
  }

  return (0, _analytics.withAnalytics)((0, _analytics2.getLinkCreationAnalyticsEvent)(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};

exports.insertLinkWithAnalytics = insertLinkWithAnalytics;

var insertLinkWithAnalyticsMobileNative = function insertLinkWithAnalyticsMobileNative(inputMethod, from, to, href, title, displayText) {
  return (0, _analytics.withAnalytics)((0, _analytics2.getLinkCreationAnalyticsEvent)(inputMethod, href))(insertLink(from, to, href, title, displayText, inputMethod));
};

exports.insertLinkWithAnalyticsMobileNative = insertLinkWithAnalyticsMobileNative;

function removeLink(pos) {
  return setLinkHref('', pos);
}

function editInsertedLink() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch((0, _analytics.addAnalytics)(state, state.tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.EDIT_INSERTED_TOOLBAR,
        inputMethod: _analytics.INPUT_METHOD.FLOATING_TB
      }), (0, _linkingUtils.buildEditLinkPayload)(_analytics.ACTION_SUBJECT_ID.HYPERLINK)));
    }

    return true;
  };
}

function showLinkToolbar() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.TOOLBAR;
  return function (state, dispatch) {
    if (dispatch) {
      var tr = state.tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.SHOW_INSERT_TOOLBAR,
        inputMethod: inputMethod
      });
      tr = (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.INVOKED,
        actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
        attributes: {
          inputMethod: inputMethod
        },
        eventType: _analytics.EVENT_TYPE.UI
      });
      dispatch(tr);
    }

    return true;
  };
}

function hideLinkToolbar() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_main.stateKey, {
        type: _main.LinkAction.HIDE_TOOLBAR
      }));
    }

    return true;
  };
}