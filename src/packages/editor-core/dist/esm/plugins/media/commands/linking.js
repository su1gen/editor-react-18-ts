import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { createMediaLinkingCommand, getMediaLinkingState, mediaLinkingPluginKey } from '../pm-plugins/linking';
import { normalizeUrl } from '../../hyperlink/utils';
import { createToggleBlockMarkOnRange } from '../../../commands';
import { MediaLinkingActionsTypes } from '../pm-plugins/linking/actions';
import { addAnalytics, EVENT_TYPE, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../../analytics';
import { currentMediaNode } from '../utils/current-media-node';
import { checkMediaType } from '../utils/check-media-type';
import { getMediaPluginState } from '../pm-plugins/main';
export var showLinkingToolbar = createMediaLinkingCommand(function (state) {
  var mediaLinkingState = getMediaLinkingState(state);

  if (mediaLinkingState && mediaLinkingState.mediaPos !== null) {
    var mediaSingle = state.doc.nodeAt(mediaLinkingState.mediaPos);

    if (mediaSingle) {
      return {
        type: MediaLinkingActionsTypes.showToolbar
      };
    }
  }

  return false;
});
export var showLinkingToolbarWithMediaTypeCheck = function showLinkingToolbarWithMediaTypeCheck(editorState, dispatch, editorView) {
  if (dispatch && editorView) {
    var mediaNode = currentMediaNode(editorState);

    if (!mediaNode) {
      return false;
    }

    var _getMediaPluginState = getMediaPluginState(editorState),
        mediaClientConfig = _getMediaPluginState.mediaClientConfig;

    if (!mediaClientConfig) {
      return false;
    }

    checkMediaType(mediaNode, mediaClientConfig).then(function (mediaType) {
      if ((mediaType === 'external' || mediaType === 'image') && // We make sure the selection and the node hasn't changed.
      currentMediaNode(editorView.state) === mediaNode) {
        dispatch(editorView.state.tr.setMeta(mediaLinkingPluginKey, {
          type: MediaLinkingActionsTypes.showToolbar
        }));
      }
    });
  }

  return true;
};
var hideLinkingToolbarCommand = createMediaLinkingCommand({
  type: MediaLinkingActionsTypes.hideToolbar
});
export var hideLinkingToolbar = function hideLinkingToolbar(state, dispatch, view) {
  hideLinkingToolbarCommand(state, dispatch, view); // restore focus on the editor so keyboard shortcuts aren't lost to the browser

  if (view) {
    view.focus();
  }
};

function getCurrentUrl(state) {
  var linkType = state.schema.marks.link;
  var mediaLinkingState = getMediaLinkingState(state);

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
  var mediaLinkingState = getMediaLinkingState(state);

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
  var toggleBlockLinkMark = createToggleBlockMarkOnRange(linkMark, function (prevAttrs, node) {
    // Only add mark to media
    if (!node || node.type !== media) {
      return; //No op
    }

    if (forceRemove) {
      return false;
    }

    var href = normalizeUrl(url);

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
  return addAnalytics(state, tr, {
    action: action,
    eventType: EVENT_TYPE.TRACK,
    actionSubject: ACTION_SUBJECT.MEDIA,
    actionSubjectId: ACTION_SUBJECT_ID.LINK,
    attributes: attributes
  });
};

export var unlink = createMediaLinkingCommand({
  type: MediaLinkingActionsTypes.unlink
}, function (tr, state) {
  var transaction = toggleLinkMark(tr, state, {
    forceRemove: true
  });
  return fireAnalyticForMediaLink(transaction, state, ACTION.DELETED);
});

var getAction = function getAction(newUrl, state) {
  var currentUrl = getCurrentUrl(state);

  if (!currentUrl) {
    return ACTION.ADDED;
  } else if (newUrl !== currentUrl) {
    return ACTION.EDITED;
  }

  return undefined;
};

export var setUrlToMedia = function setUrlToMedia(url, inputMethod) {
  return createMediaLinkingCommand({
    type: MediaLinkingActionsTypes.setUrl,
    payload: normalizeUrl(url)
  }, function (tr, state) {
    var action = getAction(url, state);

    if (!action) {
      return tr;
    }

    try {
      var toggleLinkMarkResult = toggleLinkMark(tr, state, {
        url: url
      });
      fireAnalyticForMediaLink(tr, state, action, action === ACTION.ADDED ? {
        inputMethod: inputMethod
      } : undefined);
      return toggleLinkMarkResult;
    } catch (e) {
      fireAnalyticForMediaLink(tr, state, ACTION.ERRORED, {
        action: action
      });
      throw e;
    }
  });
};