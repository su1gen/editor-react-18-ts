import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { closeHistory } from 'prosemirror-history';
import { Fragment, Node as PMNode, Slice } from 'prosemirror-model';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType, hasParentNodeOfType, safeInsert } from 'prosemirror-utils';
import uuid from 'uuid/v4';
import { replaceSelectedTable } from '@atlaskit/editor-tables/utils';
import { compose, insideTable, isParagraph, isText, isLinkMark, insideTableCell, isInListItem } from '../../utils';
import { mapSlice } from '../../utils/slice';
import { INPUT_METHOD } from '../analytics';
import { queueCardsFromChangedTr } from '../card/pm-plugins/doc';
import { GapCursorSelection, Side } from '../selection/gap-cursor-selection';
import { linkifyContent } from '../hyperlink/utils';
import { runMacroAutoConvert } from '../macro';
import { insertMediaAsMediaSingle } from '../media/utils/media-single';
import { pluginKey as textFormattingPluginKey } from '../text-formatting/pm-plugins/main';
import { addReplaceSelectedTableAnalytics, applyTextMarksToSlice, hasOnlyNodesOfType } from './util';
import { isListNode, isListItemNode } from '../list/utils/node';
import { canLinkBeCreatedInRange } from '../hyperlink/pm-plugins/main';
import { insertSliceForLists } from './edge-cases';
import { startTrackingPastedMacroPositions, stopTrackingPastedMacroPositions } from './commands';
import { getPluginState as getPastePluginState } from './pm-plugins/plugin-factory'; // remove text attribute from mention for copy/paste (GDPR)

export function handleMention(slice, schema) {
  return mapSlice(slice, function (node) {
    if (node.type.name === schema.nodes.mention.name) {
      var mention = node.attrs;

      var newMention = _objectSpread(_objectSpread({}, mention), {}, {
        text: ''
      });

      return schema.nodes.mention.create(newMention, node.content, node.marks);
    }

    return node;
  });
}
export function handlePasteIntoTaskOrDecisionOrPanel(slice) {
  return function (state, dispatch) {
    var _slice$content$firstC, _transformedSlice$con;

    var schema = state.schema,
        selection = state.tr.selection;
    var codeMark = schema.marks.code,
        _schema$nodes = schema.nodes,
        decisionItem = _schema$nodes.decisionItem,
        emoji = _schema$nodes.emoji,
        hardBreak = _schema$nodes.hardBreak,
        mention = _schema$nodes.mention,
        paragraph = _schema$nodes.paragraph,
        taskItem = _schema$nodes.taskItem,
        text = _schema$nodes.text,
        panel = _schema$nodes.panel,
        bulletList = _schema$nodes.bulletList,
        orderedList = _schema$nodes.orderedList,
        listItem = _schema$nodes.listItem,
        expand = _schema$nodes.expand,
        heading = _schema$nodes.heading;
    var selectionIsValidNode = state.selection instanceof NodeSelection && ['decisionList', 'decisionItem', 'taskList', 'taskItem'].includes(state.selection.node.type.name);
    var selectionHasValidParentNode = hasParentNodeOfType([decisionItem, taskItem, panel])(state.selection);
    var selectionIsPanel = hasParentNodeOfType([panel])(state.selection); // Some types of content should be handled by the default handler, not this function.
    // Check through slice content to see if it contains an invalid node.

    var sliceIsInvalid = false;
    slice.content.nodesBetween(0, slice.content.size, function (node) {
      if (node.type === bulletList || node.type === orderedList || node.type === expand || node.type === heading || node.type === listItem) {
        sliceIsInvalid = true;
      }
    }); // If the selection is a panel,
    // and the slice's first node is a paragraph
    // and it is not from a depth that would indicate it being from inside from another node (e.g. text from a decision)
    // then we can rely on the default behaviour.

    var sliceIsAPanelReceivingLowDepthText = selectionIsPanel && ((_slice$content$firstC = slice.content.firstChild) === null || _slice$content$firstC === void 0 ? void 0 : _slice$content$firstC.type) === paragraph && slice.openEnd < 2;

    if (sliceIsInvalid || sliceIsAPanelReceivingLowDepthText || !selectionIsValidNode && !selectionHasValidParentNode) {
      return false;
    }

    var filters = [linkifyContent(schema)];
    var selectionMarks = selection.$head.marks();
    var textFormattingState = textFormattingPluginKey.getState(state);

    if (selection instanceof TextSelection && Array.isArray(selectionMarks) && selectionMarks.length > 0 && hasOnlyNodesOfType(paragraph, text, emoji, mention, hardBreak)(slice) && (!codeMark.isInSet(selectionMarks) || textFormattingState.codeActive) // for codeMarks let's make sure mark is active
    ) {
      filters.push(applyTextMarksToSlice(schema, selection.$head.marks()));
    }

    var transformedSlice = compose.apply(null, filters)(slice);
    var tr = closeHistory(state.tr);
    var transformedSliceIsValidNode = transformedSlice.content.firstChild.type.inlineContent || ['decisionList', 'decisionItem', 'taskList', 'taskItem', 'panel'].includes(transformedSlice.content.firstChild.type.name); // If the slice or the selection are valid nodes to handle,
    // and the slice is not a whole node (i.e. openStart is 1 and openEnd is 0)
    // or the slice's first node is a paragraph,
    // then we can replace the selection with our slice.

    if ((transformedSliceIsValidNode || selectionIsValidNode) && !(transformedSlice.openStart === 1 && transformedSlice.openEnd === 0) || ((_transformedSlice$con = transformedSlice.content.firstChild) === null || _transformedSlice$con === void 0 ? void 0 : _transformedSlice$con.type) === paragraph) {
      tr.replaceSelection(transformedSlice).scrollIntoView();
    } else {
      // This maintains both the selection (destination) and the slice (paste content).
      safeInsert(transformedSlice.content)(tr).scrollIntoView();
    }

    queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export function handlePastePanelIntoList(slice) {
  return function (state, dispatch) {
    var schema = state.schema,
        tr = state.tr;
    var selection = tr.selection; // Check this pasting action is related to copy content from panel node into a selected the list node

    var selectionParentListNode = selection.$to.node(selection.$to.depth - 1);
    var panelNode = slice.content.firstChild;

    if (!dispatch || !selectionParentListNode || (selectionParentListNode === null || selectionParentListNode === void 0 ? void 0 : selectionParentListNode.type) !== schema.nodes.listItem || !panelNode || (panelNode === null || panelNode === void 0 ? void 0 : panelNode.type) !== schema.nodes.panel || (panelNode === null || panelNode === void 0 ? void 0 : panelNode.content.firstChild) === undefined) {
      return false;
    } // Paste the panel node contents extracted instead of pasting the entire panel node


    tr.replaceSelection(slice).scrollIntoView();
    dispatch(tr);
    return true;
  };
} // If we paste a link onto some selected text, apply the link as a mark

export function handlePasteLinkOnSelectedText(slice) {
  return function (state, dispatch) {
    var schema = state.schema,
        selection = state.selection,
        _state$selection = state.selection,
        from = _state$selection.from,
        to = _state$selection.to,
        tr = state.tr;
    var linkMark; // check if we have a link on the clipboard

    if (slice.content.childCount === 1 && isParagraph(slice.content.child(0), schema)) {
      var paragraph = slice.content.child(0);

      if (paragraph.content.childCount === 1 && isText(paragraph.content.child(0), schema)) {
        var text = paragraph.content.child(0); // If pasteType is plain text, then
        //  @atlaskit/editor-markdown-transformer in getMarkdownSlice decode
        //  url before setting text property of text node.
        //  However href of marks will be without decoding.
        //  So, if there is character (e.g space) in url eligible escaping then
        //  mark.attrs.href will not be equal to text.text.
        //  That's why decoding mark.attrs.href before comparing.
        // However, if pasteType is richText, that means url in text.text
        //  and href in marks, both won't be decoded.

        linkMark = text.marks.find(function (mark) {
          return isLinkMark(mark, schema) && (mark.attrs.href === text.text || decodeURI(mark.attrs.href) === text.text);
        });
      }
    } // if we have a link, apply it to the selected text if we have any and it's allowed


    if (linkMark && selection instanceof TextSelection && !selection.empty && canLinkBeCreatedInRange(from, to)(state)) {
      tr.addMark(from, to, linkMark);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
}
export function handlePasteAsPlainText(slice, _event) {
  return function (state, dispatch, view) {
    // In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
    // fuzzy matching of content. ProseMirror already handles this scenario and will
    // provide us with slice containing paragraphs with plain text, which we decorate
    // with "stored marks".
    // @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
    // @see prosemirror-view/src/input.js:doPaste().
    if (view && view.shiftKey) {
      var tr = closeHistory(state.tr);
      var _tr = tr,
          selection = _tr.selection; // <- using the same internal flag that prosemirror-view is using
      // if user has selected table we need custom logic to replace the table

      tr = replaceSelectedTable(state, slice); // add analytics after replacing selected table

      tr = addReplaceSelectedTableAnalytics(state, tr); // otherwise just replace the selection

      if (!tr.docChanged) {
        tr.replaceSelection(slice);
      }

      (state.storedMarks || []).forEach(function (mark) {
        tr.addMark(selection.from, selection.from + slice.size, mark);
      });
      tr.scrollIntoView();

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
}
export function handlePastePreservingMarks(slice) {
  return function (state, dispatch) {
    var schema = state.schema,
        selection = state.tr.selection;
    var _schema$marks = schema.marks,
        codeMark = _schema$marks.code,
        linkMark = _schema$marks.link,
        _schema$nodes2 = schema.nodes,
        bulletList = _schema$nodes2.bulletList,
        emoji = _schema$nodes2.emoji,
        hardBreak = _schema$nodes2.hardBreak,
        heading = _schema$nodes2.heading,
        listItem = _schema$nodes2.listItem,
        mention = _schema$nodes2.mention,
        orderedList = _schema$nodes2.orderedList,
        paragraph = _schema$nodes2.paragraph,
        text = _schema$nodes2.text;

    if (!(selection instanceof TextSelection)) {
      return false;
    }

    var selectionMarks = selection.$head.marks();

    if (selectionMarks.length === 0) {
      return false;
    }

    var textFormattingState = textFormattingPluginKey.getState(state); // special case for codeMark: will preserve mark only if codeMark is currently active
    // won't preserve mark if cursor is on the edge on the mark (namely inactive)

    if (codeMark.isInSet(selectionMarks) && !textFormattingState.codeActive) {
      return false;
    }

    var isPlainTextSlice = slice.content.childCount === 1 && slice.content.firstChild.type === paragraph && slice.content.firstChild.content.childCount === 1 && slice.content.firstChild.firstChild.type === text; // special case for plainTextSlice & linkMark: merge into existing link

    if (isPlainTextSlice && linkMark.isInSet(selectionMarks) && selectionMarks.length === 1) {
      var tr = closeHistory(state.tr).replaceSelectionWith(slice.content.firstChild.firstChild, true).setStoredMarks(selectionMarks).scrollIntoView();
      queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    } // if the pasted data is one of the node types below
    // we apply current selection marks to the pasted slice


    if (hasOnlyNodesOfType(bulletList, hardBreak, heading, listItem, paragraph, text, emoji, mention, orderedList)(slice)) {
      var transformedSlice = applyTextMarksToSlice(schema, selectionMarks)(slice);

      var _tr2 = closeHistory(state.tr).replaceSelection(transformedSlice).setStoredMarks(selectionMarks).scrollIntoView();

      queueCardsFromChangedTr(state, _tr2, INPUT_METHOD.CLIPBOARD);

      if (dispatch) {
        dispatch(_tr2);
      }

      return true;
    }

    return false;
  };
}

function getSmartLinkAdf(_x, _x2, _x3) {
  return _getSmartLinkAdf.apply(this, arguments);
}

function _getSmartLinkAdf() {
  _getSmartLinkAdf = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(text, type, cardOptions) {
    var provider;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (cardOptions.provider) {
              _context.next = 2;
              break;
            }

            throw Error('No card provider found');

          case 2:
            _context.next = 4;
            return cardOptions.provider;

          case 4:
            provider = _context.sent;
            _context.next = 7;
            return provider.resolve(text, type);

          case 7:
            return _context.abrupt("return", _context.sent);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getSmartLinkAdf.apply(this, arguments);
}

function insertAutoMacro(slice, macro, view, from, to) {
  if (view) {
    // insert the text or linkified/md-converted clipboard data
    var selection = view.state.tr.selection;
    var tr;
    var before;

    if (typeof from === 'number' && typeof to === 'number') {
      tr = view.state.tr.replaceRange(from, to, slice);
      before = tr.mapping.map(from, -1);
    } else {
      tr = view.state.tr.replaceSelection(slice);
      before = tr.mapping.map(selection.from, -1);
    }

    view.dispatch(tr); // replace the text with the macro as a separate transaction
    // so the autoconversion generates 2 undo steps

    view.dispatch(closeHistory(view.state.tr).replaceRangeWith(before, before + slice.size, macro).scrollIntoView());
    return true;
  }

  return false;
}

export function handleMacroAutoConvert(text, slice, cardsOptions, extensionAutoConverter) {
  return function (state, dispatch, view) {
    var macro = null; // try to use auto convert from extension provider first

    if (extensionAutoConverter) {
      var extension = extensionAutoConverter(text);

      if (extension) {
        macro = PMNode.fromJSON(state.schema, extension);
      }
    } // then try from macro provider (which will be removed some time in the future)


    if (!macro) {
      macro = runMacroAutoConvert(state, text);
    }

    if (macro) {
      /**
       * if FF enabled, run through smart links and check for result
       */
      if (cardsOptions && cardsOptions.resolveBeforeMacros && cardsOptions.resolveBeforeMacros.length) {
        var _startTrackingPastedM;

        if (cardsOptions.resolveBeforeMacros.indexOf(macro.attrs.extensionKey) < 0) {
          return insertAutoMacro(slice, macro, view);
        }

        if (!view) {
          throw new Error('View is missing');
        }

        var trackingId = uuid();
        var trackingFrom = "handleMacroAutoConvert-from-".concat(trackingId);
        var trackingTo = "handleMacroAutoConvert-to-".concat(trackingId);
        startTrackingPastedMacroPositions((_startTrackingPastedM = {}, _defineProperty(_startTrackingPastedM, trackingFrom, state.selection.from), _defineProperty(_startTrackingPastedM, trackingTo, state.selection.to), _startTrackingPastedM))(state, dispatch);
        getSmartLinkAdf(text, 'inline', cardsOptions).then(function () {
          // we use view.state rather than state because state becomes a stale
          // state reference after getSmartLinkAdf's async work
          var _getPastePluginState = getPastePluginState(view.state),
              pastedMacroPositions = _getPastePluginState.pastedMacroPositions;

          if (dispatch) {
            handleMarkdown(slice, pastedMacroPositions[trackingFrom], pastedMacroPositions[trackingTo])(view.state, dispatch);
          }
        }).catch(function () {
          var _getPastePluginState2 = getPastePluginState(view.state),
              pastedMacroPositions = _getPastePluginState2.pastedMacroPositions;

          insertAutoMacro(slice, macro, view, pastedMacroPositions[trackingFrom], pastedMacroPositions[trackingTo]);
        }).finally(function () {
          stopTrackingPastedMacroPositions([trackingFrom, trackingTo])(view.state, dispatch);
        });
        return true;
      }

      return insertAutoMacro(slice, macro, view);
    }

    return !!macro;
  };
}
export function handleCodeBlock(text) {
  return function (state, dispatch) {
    var codeBlock = state.schema.nodes.codeBlock;

    if (text && hasParentNodeOfType(codeBlock)(state.selection)) {
      var tr = closeHistory(state.tr);
      tr.scrollIntoView();

      if (dispatch) {
        dispatch(tr.insertText(text));
      }

      return true;
    }

    return false;
  };
}

function isOnlyMedia(state, slice) {
  var media = state.schema.nodes.media;
  return slice.content.childCount === 1 && slice.content.firstChild.type === media;
}

function isOnlyMediaSingle(state, slice) {
  var mediaSingle = state.schema.nodes.mediaSingle;
  return mediaSingle && slice.content.childCount === 1 && slice.content.firstChild.type === mediaSingle;
}

export function handleMediaSingle(inputMethod) {
  return function (slice) {
    return function (state, dispatch, view) {
      if (view) {
        if (isOnlyMedia(state, slice)) {
          return insertMediaAsMediaSingle(view, slice.content.firstChild, inputMethod);
        }

        if (insideTable(state) && isOnlyMediaSingle(state, slice)) {
          var tr = state.tr.replaceSelection(slice);
          var nextPos = tr.doc.resolve(tr.mapping.map(state.selection.$from.pos));

          if (dispatch) {
            dispatch(tr.setSelection(new GapCursorSelection(nextPos, Side.RIGHT)));
          }

          return true;
        }
      }

      return false;
    };
  };
}

var checkExpand = function checkExpand(slice) {
  var hasExpand = false;
  slice.content.forEach(function (node) {
    if (node.type.name === 'expand') {
      hasExpand = true;
    }
  });
  return hasExpand;
};

export function handleExpandPasteInTable(slice) {
  return function (state, dispatch) {
    // Do not handle expand if it's not being pasted into a table
    // OR if it's nested within another node when being pasted into a table
    if (!insideTable(state) || !checkExpand(slice)) {
      return false;
    }

    var _state$schema$nodes = state.schema.nodes,
        expand = _state$schema$nodes.expand,
        nestedExpand = _state$schema$nodes.nestedExpand;
    var tr = state.tr;
    var hasExpand = false;
    var newSlice = mapSlice(slice, function (maybeNode) {
      if (maybeNode.type === expand) {
        hasExpand = true;

        try {
          return nestedExpand.createChecked(maybeNode.attrs, maybeNode.content, maybeNode.marks);
        } catch (e) {
          tr = safeInsert(maybeNode, tr.selection.$to.pos)(tr);
          return Fragment.empty;
        }
      }

      return maybeNode;
    });

    if (hasExpand && dispatch) {
      // If the slice is a subset, we can let PM replace the selection
      // it will insert as text where it can't place the node.
      // Otherwise we use safeInsert to insert below instead of
      // replacing/splitting the current node.
      if (slice.openStart > 1 && slice.openEnd > 1) {
        dispatch(tr.replaceSelection(newSlice));
      } else {
        dispatch(safeInsert(newSlice.content)(tr));
      }

      return true;
    }

    return false;
  };
}
export function handleMarkdown(markdownSlice, from, to) {
  return function (state, dispatch) {
    var tr = closeHistory(state.tr);
    var pastesFrom = typeof from === 'number' ? from : tr.selection.from;

    if (typeof from === 'number' && typeof to === 'number') {
      tr.replaceRange(from, to, markdownSlice);
    } else {
      tr.replaceSelection(markdownSlice);
    }

    tr.setSelection(TextSelection.near(tr.doc.resolve(pastesFrom + markdownSlice.size), -1));
    queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
}

function removePrecedingBackTick(tr) {
  var _tr$selection = tr.selection,
      nodeBefore = _tr$selection.$from.nodeBefore,
      from = _tr$selection.from;

  if (nodeBefore && nodeBefore.isText && nodeBefore.text.endsWith('`')) {
    tr.delete(from - 1, from);
  }
}

function hasInlineCode(state, slice) {
  return slice.content.firstChild && slice.content.firstChild.marks.some(function (m) {
    return m.type === state.schema.marks.code;
  });
}

function rollupLeafListItems(list, leafListItems) {
  list.content.forEach(function (child) {
    if (isListNode(child) || isListItemNode(child) && isListNode(child.firstChild)) {
      rollupLeafListItems(child, leafListItems);
    } else {
      leafListItems.push(child);
    }
  });
}

function shouldFlattenList(state, slice) {
  var node = slice.content.firstChild;
  return node && insideTable(state) && isListNode(node) && slice.openStart > slice.openEnd;
}

function sliceHasTopLevelMarks(slice) {
  var hasTopLevelMarks = false;
  slice.content.descendants(function (node) {
    if (node.marks.length > 0) {
      hasTopLevelMarks = true;
    }

    return false;
  });
  return hasTopLevelMarks;
}

function getTopLevelMarkTypesInSlice(slice) {
  var markTypes = new Set();
  slice.content.descendants(function (node) {
    node.marks.map(function (mark) {
      return mark.type;
    }).forEach(function (markType) {
      return markTypes.add(markType);
    });
    return false;
  });
  return markTypes;
}

export function handleParagraphBlockMarks(state, slice) {
  if (slice.content.size === 0) {
    return slice;
  }

  var schema = state.schema,
      $from = state.selection.$from; // If no paragraph in the slice contains marks, there's no need for special handling
  // Note: this doesn't check for marks applied to lower level nodes such as text

  if (!sliceHasTopLevelMarks(slice)) {
    return slice;
  } // If pasting a single paragraph into pre-existing content, match destination formatting


  var destinationHasContent = $from.parent.textContent.length > 0;

  if (slice.content.childCount === 1 && destinationHasContent) {
    return slice;
  } // Check the parent of (paragraph -> text) because block marks are assigned to a wrapper
  // element around the paragraph node


  var grandparent = $from.node(Math.max(0, $from.depth - 1));
  var markTypesInSlice = getTopLevelMarkTypesInSlice(slice);
  var forbiddenMarkTypes = [];

  var _iterator = _createForOfIteratorHelper(markTypesInSlice),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var markType = _step.value;

      if (!grandparent.type.allowsMarkType(markType)) {
        forbiddenMarkTypes.push(markType);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (forbiddenMarkTypes.length === 0) {
    // In a slice containing one or more paragraphs at the document level (not wrapped in
    // another node), the first paragraph will only have its text content captured and pasted
    // since openStart is 1. We decrement the open depth of the slice so it retains any block
    // marks applied to it. We only care about the depth at the start of the selection so
    // there's no need to change openEnd - the rest of the slice gets pasted correctly.
    var openStart = Math.max(0, slice.openStart - 1);
    return new Slice(slice.content, openStart, slice.openEnd);
  } // If the paragraph contains marks forbidden by the parent node (e.g. alignment/indentation),
  // drop those marks from the slice


  return mapSlice(slice, function (node) {
    if (node.type === schema.nodes.paragraph) {
      return schema.nodes.paragraph.createChecked(undefined, node.content, node.marks.filter(function (mark) {
        return !forbiddenMarkTypes.includes(mark.type);
      }));
    }

    return node;
  });
}
/**
 * ED-6300: When a nested list is pasted in a table cell and the slice has openStart > openEnd,
 * it splits the table. As a workaround, we flatten the list to even openStart and openEnd.
 *
 * Note: this only happens if the first child is a list
 *
 * Example: copying "one" and "two"
 * - zero
 *   - one
 * - two
 *
 * Before:
 * ul
 *   ┗━ li
 *     ┗━ ul
 *       ┗━ li
 *         ┗━ p -> "one"
 *   ┗━ li
 *     ┗━ p -> "two"
 *
 * After:
 * ul
 *   ┗━ li
 *     ┗━ p -> "one"
 *   ┗━ li
 *     ┗━p -> "two"
 */

export function flattenNestedListInSlice(slice) {
  if (!slice.content.firstChild) {
    return slice;
  }

  var listToFlatten = slice.content.firstChild;
  var leafListItems = [];
  rollupLeafListItems(listToFlatten, leafListItems);
  var contentWithFlattenedList = slice.content.replaceChild(0, listToFlatten.type.createChecked(listToFlatten.attrs, leafListItems));
  return new Slice(contentWithFlattenedList, slice.openEnd, slice.openEnd);
}
export function handleRichText(slice) {
  return function (state, dispatch) {
    var _slice$content, _slice$content2, _panelParentOverCurre;

    var _state$schema$nodes2 = state.schema.nodes,
        codeBlock = _state$schema$nodes2.codeBlock,
        heading = _state$schema$nodes2.heading,
        paragraph = _state$schema$nodes2.paragraph,
        panel = _state$schema$nodes2.panel;
    var selection = state.selection,
        schema = state.schema;
    var firstChildOfSlice = (_slice$content = slice.content) === null || _slice$content === void 0 ? void 0 : _slice$content.firstChild;
    var lastChildOfSlice = (_slice$content2 = slice.content) === null || _slice$content2 === void 0 ? void 0 : _slice$content2.lastChild; // In case user is pasting inline code,
    // any backtick ` immediately preceding it should be removed.

    var tr = state.tr;

    if (hasInlineCode(state, slice)) {
      removePrecedingBackTick(tr);
    }

    if (shouldFlattenList(state, slice)) {
      slice = flattenNestedListInSlice(slice);
    }

    closeHistory(tr);
    var isFirstChildListNode = isListNode(firstChildOfSlice);
    var isLastChildListNode = isListNode(lastChildOfSlice);
    var isSliceContentListNodes = isFirstChildListNode || isLastChildListNode; // We want to use safeInsert to insert invalid content, as it inserts at the closest non schema violating position
    // rather than spliting the selection parent node in half (which is what replaceSelection does)
    // Exception is paragraph and heading nodes, these should be split, provided their parent supports the pasted content

    var textNodes = [heading, paragraph];
    var selectionParent = selection.$to.node(selection.$to.depth - 1);
    var noNeedForSafeInsert = selection.$to.node().type.validContent(slice.content) || textNodes.includes(selection.$to.node().type) && selectionParent.type.validContent(slice.content);
    var panelParentOverCurrentSelection = findParentNodeOfType(panel)(tr.selection);
    var isTargetPanelEmpty = panelParentOverCurrentSelection && ((_panelParentOverCurre = panelParentOverCurrentSelection.node) === null || _panelParentOverCurre === void 0 ? void 0 : _panelParentOverCurre.content.size) === 2;

    if (isSliceContentListNodes || isTargetPanelEmpty) {
      insertSliceForLists({
        tr: tr,
        slice: slice,
        schema: schema
      });
    } else if (noNeedForSafeInsert) {
      tr.replaceSelection(slice);
    } else {
      // need to scan the slice if there's a block node or list items inside it
      var doesBlockNodeExist = false;
      var sliceHasList = false;
      slice.content.nodesBetween(0, slice.content.size, function (node, start) {
        if (node.type === state.schema.nodes.listItem) {
          sliceHasList = true;
        }

        if (start >= slice.openStart && start <= slice.content.size - slice.openEnd && node.isBlock) {
          doesBlockNodeExist = true;
          return false;
        }
      });

      if (insideTableCell(state) && (!doesBlockNodeExist || isInListItem(state)) || sliceHasList) {
        tr.replaceSelection(slice);
      } else {
        // need safeInsert rather than replaceSelection, so that nodes aren't split in half
        // e.g. when pasting a layout into a table, replaceSelection splits the table in half and adds the layout in the middle
        tr = safeInsert(slice.content, tr.selection.$to.pos)(tr);
      }
    }

    tr.setStoredMarks([]);

    if (tr.selection.empty && tr.selection.$from.parent.type === codeBlock) {
      tr.setSelection(TextSelection.near(tr.selection.$from, 1));
    }

    tr.scrollIntoView(); // queue link cards, ignoring any errors

    if (dispatch) {
      dispatch(queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD));
    }

    return true;
  };
}
export function handlePasteIntoCaption(slice) {
  return function (state, dispatch) {
    var caption = state.schema.nodes.caption;
    var tr = state.tr;

    if (hasParentNodeOfType(caption)(state.selection)) {
      // We let PM replace the selection and it will insert as text where it can't place the node
      // This is totally fine as caption is just a simple block that only contains inline contents
      // And it is more in line with WYSIWYG expectations
      tr.replaceSelection(slice).scrollIntoView();

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
}
export var handleSelectedTable = function handleSelectedTable(slice) {
  return function (state, dispatch) {
    var tr = replaceSelectedTable(state, slice); // add analytics after replacing selected table

    tr = addReplaceSelectedTableAnalytics(state, tr);

    if (tr.docChanged) {
      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};