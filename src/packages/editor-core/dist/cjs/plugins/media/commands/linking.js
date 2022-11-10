"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlink = exports.showLinkingToolbarWithMediaTypeCheck = exports.showLinkingToolbar = exports.setUrlToMedia = exports.hideLinkingToolbar = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _linking = require("../pm-plugins/linking");

var _utils = require("../../hyperlink/utils");

var _commands = require("../../../commands");

var _actions = require("../pm-plugins/linking/actions");

var _analytics = require("../../analytics");

var _currentMediaNode = require("../utils/current-media-node");

var _checkMediaType = require("../utils/check-media-type");

var _main = require("../pm-plugins/main");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var showLinkingToolbar = (0, _linking.createMediaLinkingCommand)(function (state) {
  var mediaLinkingState = (0, _linking.getMediaLinkingState)(state);

  if (mediaLinkingState && mediaLinkingState.mediaPos !== null) {
    var mediaSingle = state.doc.nodeAt(mediaLinkingState.mediaPos);

    if (mediaSingle) {
      return {
        type: _actions.MediaLinkingActionsTypes.showToolbar
      };
    }
  }

  return false;
});
exports.showLinkingToolbar = showLinkingToolbar;

var showLinkingToolbarWithMediaTypeCheck = function showLinkingToolbarWithMediaTypeCheck(editorState, dispatch, editorView) {
  if (dispatch && editorView) {
    var mediaNode = (0, _currentMediaNode.currentMediaNode)(editorState);

    if (!mediaNode) {
      return false;
    }

    var _getMediaPluginState = (0, _main.getMediaPluginState)(editorState),
        mediaClientConfig = _getMediaPluginState.mediaClientConfig;

    if (!mediaClientConfig) {
      return false;
    }

    (0, _checkMediaType.checkMediaType)(mediaNode, mediaClientConfig).then(function (mediaType) {
      if ((mediaType === 'external' || mediaType === 'image') && // We make sure the selection and the node hasn't changed.
      (0, _currentMediaNode.currentMediaNode)(editorView.state) === mediaNode) {
        dispatch(editorView.state.tr.setMeta(_linking.mediaLinkingPluginKey, {
          type: _actions.MediaLinkingActionsTypes.showToolbar
        }));
      }
    });
  }

  return true;
};

exports.showLinkingToolbarWithMediaTypeCheck = showLinkingToolbarWithMediaTypeCheck;
var hideLinkingToolbarCommand = (0, _linking.createMediaLinkingCommand)({
  type: _actions.MediaLinkingActionsTypes.hideToolbar
});

var hideLinkingToolbar = function hideLinkingToolbar(state, dispatch, view) {
  hideLinkingToolbarCommand(state, dispatch, view); // restore focus on the editor so keyboard shortcuts aren't lost to the browser

  if (view) {
    view.focus();
  }
};

exports.hideLinkingToolbar = hideLinkingToolbar;

function getCurrentUrl(state) {
  var linkType = state.schema.marks.link;
  var mediaLinkingState = (0, _linking.getMediaLinkingState)(state);

  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return;
  }

  var $pos = state.doc.resolve(mediaLinkingState.mediaPos);
  var node = state.doc.nodeAt($pos.pos);

  if (!node) {
    return;
  }

  var hasLink = linkType.isInSet(node.marks);

  if (!hasLink) {
    return;
  }

  var link = node.marks.find(function (mark) {
    return mark.type === linkType;
  }); // Already check exist

  var url = link.attrs.href;
  return url;
}

function toggleLinkMark(tr, state, _ref) {
  var _ref$forceRemove = _ref.forceRemove,
      forceRemove = _ref$forceRemove === void 0 ? false : _ref$forceRemove,
      url = _ref.url;
  var mediaLinkingState = (0, _linking.getMediaLinkingState)(state);

  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return tr;
  }

  var $pos = state.doc.resolve(mediaLinkingState.mediaPos);
  var node = state.doc.nodeAt($pos.pos);

  if (!node) {
    return tr;
  }

  var linkMark = state.schema.marks.link;
  var media = state.schema.nodes.media;
  var toggleBlockLinkMark = (0, _commands.createToggleBlockMarkOnRange)(linkMark, function (prevAttrs, node) {
    // Only add mark to media
    if (!node || node.type !== media) {
      return; //No op
    }

    if (forceRemove) {
      return false;
    }

    var href = (0, _utils.normalizeUrl)(url);

    if (prevAttrs && prevAttrs.href === href) {
      return; //No op
    }

    if (href.trim() === '') {
      return false; // remove
    }

    return _objectSpread(_objectSpread({}, prevAttrs), {}, {
      href: href
    });
  }, [media]);
  toggleBlockLinkMark($pos.pos, $pos.pos + node.nodeSize, tr, state);
  return tr;
}

var fireAnalyticForMediaLink = function fireAnalyticForMediaLink(tr, state, action) {
  var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  return (0, _analytics.addAnalytics)(state, tr, {
    action: action,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.LINK,
    attributes: attributes
  });
};

var unlink = (0, _linking.createMediaLinkingCommand)({
  type: _actions.MediaLinkingActionsTypes.unlink
}, function (tr, state) {
  var transaction = toggleLinkMark(tr, state, {
    forceRemove: true
  });
  return fireAnalyticForMediaLink(transaction, state, _analytics.ACTION.DELETED);
});
exports.unlink = unlink;

var getAction = function getAction(newUrl, state) {
  var currentUrl = getCurrentUrl(state);

  if (!currentUrl) {
    return _analytics.ACTION.ADDED;
  } else if (newUrl !== currentUrl) {
    return _analytics.ACTION.EDITED;
  }

  return undefined;
};

var setUrlToMedia = function setUrlToMedia(url, inputMethod) {
  return (0, _linking.createMediaLinkingCommand)({
    type: _actions.MediaLinkingActionsTypes.setUrl,
    payload: (0, _utils.normalizeUrl)(url)
  }, function (tr, state) {
    var action = getAction(url, state);

    if (!action) {
      return tr;
    }

    try {
      var toggleLinkMarkResult = toggleLinkMark(tr, state, {
        url: url
      });
      fireAnalyticForMediaLink(tr, state, action, action === _analytics.ACTION.ADDED ? {
        inputMethod: inputMethod
      } : undefined);
      return toggleLinkMarkResult;
    } catch (e) {
      fireAnalyticForMediaLink(tr, state, _analytics.ACTION.ERRORED, {
        action: action
      });
      throw e;
    }
  });
};

exports.setUrlToMedia = setUrlToMedia;