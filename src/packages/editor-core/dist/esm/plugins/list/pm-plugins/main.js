import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { findParentNodeOfType } from 'prosemirror-utils';
import { isWrappingPossible } from '../utils/selection';
import { isListNode } from '../utils/node';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { setGapCursorSelection } from '../../../utils';
import { Side } from '../../selection/gap-cursor-selection';
import { listPaddingLeftMarkerSpace, CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
var listPluginKey = new PluginKey('listPlugin');
export var pluginKey = listPluginKey;
var initialState = {
  bulletListActive: false,
  bulletListDisabled: false,
  orderedListActive: false,
  orderedListDisabled: false,
  decorationSet: DecorationSet.empty
};
export var getDecorations = function getDecorations(doc) {
  var decorations = []; // this stack keeps track of each (nested) list to calculate the indentation level

  var processedListsStack = [];
  doc.nodesBetween(0, doc.content.size, function (node, currentNodeStartPos) {
    if (processedListsStack.length > 0) {
      var isOutsideLastList = true;

      while (isOutsideLastList && processedListsStack.length > 0) {
        var lastList = processedListsStack[processedListsStack.length - 1];
        var lastListEndPos = lastList.startPos + lastList.node.nodeSize;
        isOutsideLastList = currentNodeStartPos >= lastListEndPos; // once we finish iterating over each innermost list, pop the stack to
        // decrease the indent level attribute accordingly

        if (isOutsideLastList) {
          processedListsStack.pop();
        }
      }
    }

    if (isListNode(node)) {
      processedListsStack.push({
        node: node,
        startPos: currentNodeStartPos
      });
      var from = currentNodeStartPos;
      var to = currentNodeStartPos + node.nodeSize;
      var depth = processedListsStack.length;
      decorations.push(Decoration.node(from, to, {
        'data-indent-level': "".concat(depth)
      }));

      if (node.childCount >= 100) {
        decorations.push(Decoration.node(from, to, {
          'data-child-count': '100+'
        }));
      }
    }
  });
  return DecorationSet.empty.add(doc, decorations);
};

var handleDocChanged = function handleDocChanged(tr, pluginState) {
  var nextPluginState = handleSelectionChanged(tr, pluginState);
  var decorationSet = getDecorations(tr.doc);
  return _objectSpread(_objectSpread({}, nextPluginState), {}, {
    decorationSet: decorationSet
  });
};

var handleSelectionChanged = function handleSelectionChanged(tr, pluginState) {
  var _tr$doc$type$schema$n = tr.doc.type.schema.nodes,
      bulletList = _tr$doc$type$schema$n.bulletList,
      orderedList = _tr$doc$type$schema$n.orderedList;
  var listParent = findParentNodeOfType([bulletList, orderedList])(tr.selection);
  var bulletListActive = !!listParent && listParent.node.type === bulletList;
  var orderedListActive = !!listParent && listParent.node.type === orderedList;
  var bulletListDisabled = !(bulletListActive || orderedListActive || isWrappingPossible(bulletList, tr.selection));
  var orderedListDisabled = !(bulletListActive || orderedListActive || isWrappingPossible(orderedList, tr.selection));

  if (bulletListActive !== pluginState.bulletListActive || orderedListActive !== pluginState.orderedListActive || bulletListDisabled !== pluginState.bulletListDisabled || orderedListDisabled !== pluginState.orderedListDisabled) {
    var nextPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
      bulletListActive: bulletListActive,
      orderedListActive: orderedListActive,
      bulletListDisabled: bulletListDisabled,
      orderedListDisabled: orderedListDisabled
    });

    return nextPluginState;
  }

  return pluginState;
};

var reducer = function reducer() {
  return function (state) {
    return state;
  };
};

var _pluginFactory = pluginFactory(listPluginKey, reducer(), {
  onDocChanged: handleDocChanged,
  onSelectionChanged: handleSelectionChanged
}),
    getPluginState = _pluginFactory.getPluginState,
    createPluginState = _pluginFactory.createPluginState;

var createInitialState = function createInitialState(state) {
  return _objectSpread(_objectSpread({}, initialState), {}, {
    decorationSet: getDecorations(state.doc)
  });
};

export var createPlugin = function createPlugin(eventDispatch) {
  return new SafePlugin({
    state: createPluginState(eventDispatch, createInitialState),
    key: listPluginKey,
    props: {
      decorations: function decorations(state) {
        var _getPluginState = getPluginState(state),
            decorationSet = _getPluginState.decorationSet;

        return decorationSet;
      },
      handleClick: function handleClick(view, pos, event) {
        var state = view.state;

        if (['LI', 'UL'].includes((event === null || event === void 0 ? void 0 : event.target).tagName)) {
          var _nodeAtPos$firstChild;

          var nodeAtPos = state.tr.doc.nodeAt(pos);
          var _view$state$schema$no = view.state.schema.nodes,
              listItem = _view$state$schema$no.listItem,
              codeBlock = _view$state$schema$no.codeBlock;

          if ((nodeAtPos === null || nodeAtPos === void 0 ? void 0 : nodeAtPos.type) === listItem && (nodeAtPos === null || nodeAtPos === void 0 ? void 0 : (_nodeAtPos$firstChild = nodeAtPos.firstChild) === null || _nodeAtPos$firstChild === void 0 ? void 0 : _nodeAtPos$firstChild.type) === codeBlock) {
            var _document, _document$elementFrom;

            var bufferPx = 50;
            var isCodeBlockNextToListMarker = Boolean((_document = document) === null || _document === void 0 ? void 0 : (_document$elementFrom = _document.elementFromPoint(event.clientX + (listPaddingLeftMarkerSpace + bufferPx), event.clientY)) === null || _document$elementFrom === void 0 ? void 0 : _document$elementFrom.closest(".".concat(CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER)));

            if (isCodeBlockNextToListMarker) {
              // +1 needed to put cursor inside li
              // otherwise gap cursor markup will be injected as immediate child of ul resulting in invalid html
              setGapCursorSelection(view, pos + 1, Side.LEFT);
              return true;
            }
          }
        }

        return false;
      }
    }
  });
};