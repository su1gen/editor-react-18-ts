import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { Fragment, Slice } from 'prosemirror-model';
import { safeInsert as pmSafeInsert, hasParentNodeOfType } from 'prosemirror-utils';
import { calcPxFromPct, wrappedLayouts } from '@atlaskit/editor-common/ui';
import { akEditorBreakoutPadding, breakoutWideScaleRatio } from '@atlaskit/editor-shared-styles';
import { checkNodeDown, isEmptyParagraph } from '../../../utils';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { mapSlice } from '../../../utils/slice';
import { addAnalytics, ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../analytics';
import { safeInsert, shouldSplitSelectedNodeOnNodeInsertion } from '../../../utils/insert';
import { getFeatureFlags } from '../../feature-flags-context';
import { isImage } from './is-image';
import { atTheBeginningOfBlock } from '../../../utils/prosemirror/position';

var getInsertMediaAnalytics = function getInsertMediaAnalytics(inputMethod, fileExtension) {
  return {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
    attributes: {
      inputMethod: inputMethod,
      fileExtension: fileExtension,
      type: ACTION_SUBJECT_ID.MEDIA_SINGLE
    },
    eventType: EVENT_TYPE.TRACK
  };
};

function shouldAddParagraph(state) {
  return atTheBeginningOfBlock(state) && !checkNodeDown(state.selection, state.doc, isEmptyParagraph);
}

function insertNodesWithOptionalParagraph(nodes) {
  var analyticsAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (state, dispatch) {
    var tr = state.tr,
        schema = state.schema;
    var paragraph = schema.nodes.paragraph;
    var inputMethod = analyticsAttributes.inputMethod,
        fileExtension = analyticsAttributes.fileExtension;
    var openEnd = 0;

    if (shouldAddParagraph(state)) {
      nodes.push(paragraph.create());
      openEnd = 1;
    }

    tr.replaceSelection(new Slice(Fragment.from(nodes), 0, openEnd));

    if (inputMethod) {
      addAnalytics(state, tr, getInsertMediaAnalytics(inputMethod, fileExtension));
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

export var isMediaSingle = function isMediaSingle(schema, fileMimeType) {
  return !!schema.nodes.mediaSingle && isImage(fileMimeType);
};
export var insertMediaAsMediaSingle = function insertMediaAsMediaSingle(view, node, inputMethod) {
  var state = view.state,
      dispatch = view.dispatch;
  var _state$schema$nodes = state.schema.nodes,
      mediaSingle = _state$schema$nodes.mediaSingle,
      media = _state$schema$nodes.media;

  if (!mediaSingle) {
    return false;
  } // if not an image type media node


  if (node.type !== media || !isImage(node.attrs.__fileMimeType) && node.attrs.type !== 'external') {
    return false;
  }

  var mediaSingleNode = mediaSingle.create({}, node);
  var nodes = [mediaSingleNode];
  var analyticsAttributes = {
    inputMethod: inputMethod,
    fileExtension: node.attrs.__fileMimeType
  };
  return insertNodesWithOptionalParagraph(nodes, analyticsAttributes)(state, dispatch);
};
export var insertMediaSingleNode = function insertMediaSingleNode(view, mediaState, inputMethod, collection, alignLeftOnInsert) {
  var _state$selection$$fro;

  if (collection === undefined) {
    return false;
  }

  var state = view.state,
      dispatch = view.dispatch;
  var grandParentNodeType = (_state$selection$$fro = state.selection.$from.node(-1)) === null || _state$selection$$fro === void 0 ? void 0 : _state$selection$$fro.type;
  var parentNodeType = state.selection.$from.parent.type;
  var node = createMediaSingleNode(state.schema, collection, alignLeftOnInsert)(mediaState);
  var fileExtension;

  if (mediaState.fileName) {
    var extensionIdx = mediaState.fileName.lastIndexOf('.');
    fileExtension = extensionIdx >= 0 ? mediaState.fileName.substring(extensionIdx + 1) : undefined;
  } // should split if media is valid content for the grandparent of the selected node
  // and the parent node is a paragraph


  if (shouldSplitSelectedNodeOnNodeInsertion({
    parentNodeType: parentNodeType,
    grandParentNodeType: grandParentNodeType,
    content: node
  })) {
    insertNodesWithOptionalParagraph([node], {
      fileExtension: fileExtension,
      inputMethod: inputMethod
    })(state, dispatch);
  } else {
    var _getFeatureFlags = getFeatureFlags(view.state),
        newInsertionBehaviour = _getFeatureFlags.newInsertionBehaviour;

    var tr = null;

    if (newInsertionBehaviour) {
      tr = safeInsert(node, state.selection.from)(state.tr);
    }

    if (!tr) {
      var content = shouldAddParagraph(view.state) ? Fragment.fromArray([node, state.schema.nodes.paragraph.create()]) : node;
      tr = pmSafeInsert(content, undefined, true)(state.tr);
    }

    if (inputMethod) {
      tr = addAnalytics(state, tr, getInsertMediaAnalytics(inputMethod, fileExtension));
    }

    dispatch(tr);
  }

  return true;
};
export var createMediaSingleNode = function createMediaSingleNode(schema, collection, alignLeftOnInsert) {
  return function (mediaState) {
    var id = mediaState.id,
        dimensions = mediaState.dimensions,
        contextId = mediaState.contextId,
        _mediaState$scaleFact = mediaState.scaleFactor,
        scaleFactor = _mediaState$scaleFact === void 0 ? 1 : _mediaState$scaleFact;

    var _ref = dimensions || {
      height: undefined,
      width: undefined
    },
        width = _ref.width,
        height = _ref.height;

    var _schema$nodes = schema.nodes,
        media = _schema$nodes.media,
        mediaSingle = _schema$nodes.mediaSingle;
    var mediaNode = media.create({
      id: id,
      type: 'file',
      collection: collection,
      contextId: contextId,
      width: width && Math.round(width / scaleFactor),
      height: height && Math.round(height / scaleFactor)
    });
    var mediaSingleAttrs = alignLeftOnInsert ? {
      layout: 'align-start'
    } : {};
    copyOptionalAttrsFromMediaState(mediaState, mediaNode);
    return mediaSingle.createChecked(mediaSingleAttrs, mediaNode);
  };
};
export function transformSliceForMedia(slice, schema) {
  var _schema$nodes2 = schema.nodes,
      mediaSingle = _schema$nodes2.mediaSingle,
      layoutSection = _schema$nodes2.layoutSection,
      table = _schema$nodes2.table,
      bulletList = _schema$nodes2.bulletList,
      orderedList = _schema$nodes2.orderedList,
      media = _schema$nodes2.media,
      expand = _schema$nodes2.expand;
  return function (selection) {
    var newSlice = slice;

    if (hasParentNodeOfType([layoutSection, table, bulletList, orderedList, expand])(selection)) {
      newSlice = mapSlice(newSlice, function (node) {
        var attrs = hasParentNodeOfType([layoutSection, table])(selection) ? {
          layout: node.attrs.layout
        } : {};
        return node.type.name === 'mediaSingle' ? mediaSingle.createChecked(attrs, node.content, node.marks) : node;
      });
    }

    newSlice = mapSlice(newSlice, function (node) {
      return node.type.name === 'media' && node.attrs.type === 'external' ? media.createChecked(_objectSpread(_objectSpread({}, node.attrs), {}, {
        __external: true
      }), node.content, node.marks) : node;
    });
    return newSlice;
  };
}
export var calcMediaPxWidth = function calcMediaPxWidth(opts) {
  var origWidth = opts.origWidth,
      origHeight = opts.origHeight,
      layout = opts.layout,
      pctWidth = opts.pctWidth,
      containerWidth = opts.containerWidth,
      resizedPctWidth = opts.resizedPctWidth;
  var width = containerWidth.width,
      lineLength = containerWidth.lineLength;
  var calculatedPctWidth = calcPctWidth(containerWidth, pctWidth, origWidth, origHeight);
  var calculatedResizedPctWidth = calcPctWidth(containerWidth, resizedPctWidth, origWidth, origHeight);

  if (layout === 'wide') {
    if (lineLength) {
      var wideWidth = Math.ceil(lineLength * breakoutWideScaleRatio);
      return wideWidth > width ? lineLength : wideWidth;
    }
  } else if (layout === 'full-width') {
    return width - akEditorBreakoutPadding;
  } else if (calculatedPctWidth) {
    if (wrappedLayouts.indexOf(layout) > -1) {
      if (calculatedResizedPctWidth) {
        if (resizedPctWidth < 50) {
          return calculatedResizedPctWidth;
        }

        return calculatedPctWidth;
      }

      return Math.min(calculatedPctWidth, origWidth);
    }

    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }

    return calculatedPctWidth;
  } else if (layout === 'center') {
    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }

    return Math.min(origWidth, lineLength || width);
  } else if (layout && wrappedLayouts.indexOf(layout) !== -1) {
    var halfLineLength = Math.ceil((lineLength || width) / 2);
    return origWidth <= halfLineLength ? origWidth : halfLineLength;
  }

  return origWidth;
};

var calcPctWidth = function calcPctWidth(containerWidth, pctWidth, origWidth, origHeight) {
  return pctWidth && origWidth && origHeight && Math.ceil(calcPxFromPct(pctWidth / 100, containerWidth.lineLength || containerWidth.width));
};

export function isCaptionNode(editorView) {
  var $from = editorView.state.selection.$from;
  var immediateWrapperParentNode = editorView.state.doc.nodeAt($from.before(Math.max($from.depth, 1)));

  if (immediateWrapperParentNode && immediateWrapperParentNode.type.name === 'caption') {
    return true;
  }

  return false;
}