import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { Slice, Fragment } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import uuid from 'uuid';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { mapChildren } from '../../../utils/slice';
import { getExtensionAutoConvertersFromProvider } from '@atlaskit/editor-common/extensions';
sendPasteAnalyticsEvent;
import * as clipboard from '../../../utils/clipboard';
import { transformSliceForMedia } from '../../media/utils/media-single';
import { escapeLinks, htmlContainsSingleFile, isPastedFromWord, isPastedFromExcel, htmlHasInvalidLinkTags, removeDuplicateInvalidLinks } from '../util';
import { linkifyContent } from '../../hyperlink/utils';
import { transformSliceNestedExpandToExpand } from '../../expand/utils';
import { handleMacroAutoConvert, handleMention, handleParagraphBlockMarks } from '../handlers';
import { transformSliceToJoinAdjacentCodeBlocks, transformSingleLineCodeBlockToCodeMark } from '../../code-block/utils';
import { createPasteMeasurePayload, getContentNodeTypes, handlePasteAsPlainTextWithAnalytics, handlePasteIntoTaskAndDecisionWithAnalytics, handleCodeBlockWithAnalytics, handleMediaSingleWithAnalytics, handlePastePreservingMarksWithAnalytics, handleMarkdownWithAnalytics, handleRichTextWithAnalytics, handleExpandWithAnalytics, handleSelectedTableWithAnalytics, handlePasteLinkOnSelectedTextWithAnalytics, sendPasteAnalyticsEvent, handlePasteIntoCaptionWithAnalytics, handlePastePanelIntoListWithAnalytics } from './analytics';
import { analyticsPluginKey, PasteTypes } from '../../analytics';
import { isInsideBlockQuote, insideTable, measurements } from '../../../utils';
import { measureRender } from '@atlaskit/editor-common/utils';
import { transformSliceToCorrectMediaWrapper, unwrapNestedMediaElements } from '../../media/utils/media-common';
import { upgradeTextToLists, splitParagraphs } from '../../list/transforms';
import { md } from '../md';
import { transformUnsupportedBlockCardToInline } from '../../card/utils';
import { transformSliceToDecisionList } from '../../tasks-and-decisions/utils';
import { containsAnyAnnotations, stripNonExistingAnnotations } from '../../annotation/utils';
import { pluginKey as betterTypePluginKey } from '../../base/pm-plugins/better-type-history';
import { clipboardTextSerializer } from './clipboard-text-serializer';
import { htmlHasIncompleteTable, tryRebuildCompleteTableHtml, isPastedFromTinyMCEConfluence } from '../util/tinyMCE';
import { handlePaste as handlePasteTable } from '@atlaskit/editor-tables/utils';
import { extractSliceFromStep } from '../../../utils/step';
import { pluginKey as stateKey, createPluginState } from './plugin-factory';
export { pluginKey as stateKey } from './plugin-factory';
export { md } from '../md';
export function createPlugin(schema, dispatchAnalyticsEvent, dispatch, plainTextPasteLinkification, cardOptions, sanitizePrivateContent, providerFactory) {
  var atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  function getMarkdownSlice(text, openStart, openEnd) {
    var textInput = text;

    if (textInput.includes('\\')) {
      textInput = textInput.replace(/\\/g, '\\\\');
    }

    var doc = atlassianMarkDownParser.parse(escapeLinks(textInput));

    if (doc && doc.content) {
      return new Slice(doc.content, openStart, openEnd);
    }

    return;
  }

  var extensionAutoConverter;

  function setExtensionAutoConverter(_x, _x2) {
    return _setExtensionAutoConverter.apply(this, arguments);
  }

  function _setExtensionAutoConverter() {
    _setExtensionAutoConverter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(name, extensionProviderPromise) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(name !== 'extensionProvider' || !extensionProviderPromise)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return getExtensionAutoConvertersFromProvider(extensionProviderPromise);

            case 5:
              extensionAutoConverter = _context.sent;
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              // eslint-disable-next-line no-console
              console.error(_context.t0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));
    return _setExtensionAutoConverter.apply(this, arguments);
  }

  if (providerFactory) {
    providerFactory.subscribe('extensionProvider', setExtensionAutoConverter);
  }

  var mostRecentPasteEvent;
  var pastedFromBitBucket = false;
  return new SafePlugin({
    key: stateKey,
    state: createPluginState(dispatch, {
      pastedMacroPositions: {}
    }),
    props: {
      // For serialising to plain text
      clipboardTextSerializer: clipboardTextSerializer,
      handleDOMEvents: {
        paste: function paste(view, event) {
          mostRecentPasteEvent = event;
          return false;
        }
      },
      handlePaste: function handlePaste(view, rawEvent, slice) {
        var _text, _analyticsPlugin$perf, _analyticsPlugin$perf2, _schema$nodes, _schema$nodes2, _schema$nodes3;

        var event = rawEvent;

        if (!event.clipboardData) {
          return false;
        }

        var text = event.clipboardData.getData('text/plain');
        var html = event.clipboardData.getData('text/html');
        var uriList = event.clipboardData.getData('text/uri-list'); // Links copied from iOS Safari share button only have the text/uri-list data type
        // ProseMirror don't do anything with this type so we want to make our own open slice
        // with url as text content so link is pasted inline

        if (uriList && !text && !html) {
          text = uriList;
          slice = new Slice(Fragment.from(schema.text(text)), 1, 1);
        }

        if ((_text = text) !== null && _text !== void 0 && _text.includes('\r')) {
          text = text.replace(/\r/g, '');
        }

        var isPastedFile = clipboard.isPastedFile(event);
        var isPlainText = text && !html;
        var isRichText = !!html; // Bail if copied content has files

        if (isPastedFile) {
          if (!html) {
            /**
             * Microsoft Office, Number, Pages, etc. adds an image to clipboard
             * with other mime-types so we don't let the event reach media.
             * The detection ration here is that if the payload has both `html` and
             * `files`, then it could be one of above or an image copied from web.
             * Here, we don't have html, so we return true to allow default event behaviour
             */
            return true;
          }
          /**
           * We want to return false for external copied image to allow
           * it to be uploaded by the client.
           */


          if (htmlContainsSingleFile(html)) {
            return true;
          }

          event.stopPropagation();
        }

        var state = view.state;
        var analyticsPlugin = analyticsPluginKey.getState(state);
        var pasteTrackingEnabled = analyticsPlugin === null || analyticsPlugin === void 0 ? void 0 : (_analyticsPlugin$perf = analyticsPlugin.performanceTracking) === null || _analyticsPlugin$perf === void 0 ? void 0 : (_analyticsPlugin$perf2 = _analyticsPlugin$perf.pasteTracking) === null || _analyticsPlugin$perf2 === void 0 ? void 0 : _analyticsPlugin$perf2.enabled;

        if (pasteTrackingEnabled) {
          var content = getContentNodeTypes(slice.content);
          var pasteId = uuid();
          var measureName = "".concat(measurements.PASTE, "_").concat(pasteId);
          measureRender(measureName, function (_ref) {
            var duration = _ref.duration,
                distortedDuration = _ref.distortedDuration;
            var payload = createPasteMeasurePayload({
              view: view,
              duration: duration,
              content: content,
              distortedDuration: distortedDuration
            });

            if (payload) {
              dispatchAnalyticsEvent(payload);
            }
          });
        } // creating a custom dispatch because we want to add a meta whenever we do a paste.


        var dispatch = function dispatch(tr) {
          var _state$doc$resolve$no;

          // https://product-fabric.atlassian.net/browse/ED-12633
          // don't add closeHistory call if we're pasting a text inside placeholder text as we want the whole action
          // to be atomic
          var placeholder = state.schema.nodes.placeholder;
          var isPastingTextInsidePlaceholderText = ((_state$doc$resolve$no = state.doc.resolve(state.selection.$anchor.pos).nodeAfter) === null || _state$doc$resolve$no === void 0 ? void 0 : _state$doc$resolve$no.type) === placeholder; // don't add closeHistory call if we're pasting a table, as some tables may involve additional
          // appendedTransactions to repair them (if they're partial or incomplete) and we don't want
          // to split those repairing transactions in prosemirror-history when they're being added to the
          // "done" stack

          var isPastingTable = tr.steps.some(function (step) {
            var _slice$content;

            var slice = extractSliceFromStep(step);
            var tableExists = false;
            slice === null || slice === void 0 ? void 0 : (_slice$content = slice.content) === null || _slice$content === void 0 ? void 0 : _slice$content.forEach(function (node) {
              if (node.type === state.schema.nodes.table) {
                tableExists = true;
              }
            });
            return tableExists;
          });

          if (!isPastingTextInsidePlaceholderText && !isPastingTable) {
            tr.setMeta(betterTypePluginKey, true);
          }

          view.dispatch(tr);
        };

        slice = handleParagraphBlockMarks(state, slice);
        var plainTextPasteSlice = plainTextPasteLinkification === true ? linkifyContent(state.schema)(slice) : slice;

        if (handlePasteAsPlainTextWithAnalytics(view, event, plainTextPasteSlice)(state, dispatch, view)) {
          return true;
        } // transform slices based on destination


        slice = transformSliceForMedia(slice, schema)(state.selection);
        var markdownSlice;

        if (isPlainText) {
          var _markdownSlice;

          markdownSlice = getMarkdownSlice(text, slice.openStart, slice.openEnd); // https://product-fabric.atlassian.net/browse/ED-15134
          // Lists are not allowed within Blockquotes at this time. Attempting to
          // paste a markdown list ie. ">- foo" will yeild a markdownSlice of size 0.
          // Rather then blocking the paste action with no UI feedback, this will instead
          // force a "paste as plain text" action by clearing the markdownSlice.

          markdownSlice = !((_markdownSlice = markdownSlice) !== null && _markdownSlice !== void 0 && _markdownSlice.size) ? undefined : markdownSlice;

          if (markdownSlice) {
            // linkify text prior to converting to macro
            if (handlePasteLinkOnSelectedTextWithAnalytics(view, event, markdownSlice, PasteTypes.markdown)(state, dispatch)) {
              return true;
            } // run macro autoconvert prior to other conversions


            if (handleMacroAutoConvert(text, markdownSlice, cardOptions, extensionAutoConverter)(state, dispatch, view)) {
              // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
              sendPasteAnalyticsEvent(view, event, markdownSlice, {
                type: PasteTypes.markdown
              });
              return true;
            }
          }
        }

        slice = transformUnsupportedBlockCardToInline(slice, state); // Handles edge case so that when copying text from the top level of the document
        // it can be pasted into nodes like panels/actions/decisions without removing them.
        // Overriding openStart to be 1 when only pasting a paragraph makes the preferred
        // depth favour the text, rather than the paragraph node.
        // https://github.com/ProseMirror/prosemirror-transform/blob/master/src/replace.js#:~:text=Transform.prototype.-,replaceRange,-%3D%20function(from%2C%20to

        var selectionDepth = state.selection.$head.depth;
        var selectionParentNode = state.selection.$head.node(selectionDepth - 1);
        var selectionParentType = selectionParentNode === null || selectionParentNode === void 0 ? void 0 : selectionParentNode.type;
        var edgeCaseNodeTypes = [(_schema$nodes = schema.nodes) === null || _schema$nodes === void 0 ? void 0 : _schema$nodes.panel, (_schema$nodes2 = schema.nodes) === null || _schema$nodes2 === void 0 ? void 0 : _schema$nodes2.taskList, (_schema$nodes3 = schema.nodes) === null || _schema$nodes3 === void 0 ? void 0 : _schema$nodes3.decisionList];

        if (slice.openStart === 0 && selectionParentNode && edgeCaseNodeTypes.includes(selectionParentType)) {
          slice.openStart = 1;
        }

        if (handlePasteIntoTaskAndDecisionWithAnalytics(view, event, slice, isPlainText ? PasteTypes.plain : PasteTypes.richText)(state, dispatch)) {
          return true;
        } // If we're in a code block, append the text contents of clipboard inside it


        if (handleCodeBlockWithAnalytics(view, event, slice, text)(state, dispatch)) {
          return true;
        }

        if (handleMediaSingleWithAnalytics(view, event, slice, isPastedFile ? PasteTypes.binary : PasteTypes.richText)(state, dispatch, view)) {
          return true;
        }

        if (handleSelectedTableWithAnalytics(view, event, slice)(state, dispatch)) {
          return true;
        } // If the clipboard only contains plain text, attempt to parse it as Markdown


        if (isPlainText && markdownSlice) {
          if (handlePastePreservingMarksWithAnalytics(view, event, markdownSlice, PasteTypes.markdown)(state, dispatch)) {
            return true;
          }

          return handleMarkdownWithAnalytics(view, event, markdownSlice)(state, dispatch);
        }

        if (isRichText && isInsideBlockQuote(state)) {
          //If pasting inside blockquote
          //Skip the blockquote node and keep remaining nodes as they are
          var blockquote = schema.nodes.blockquote;
          var children = [];
          mapChildren(slice.content, function (node) {
            if (node.type === blockquote) {
              for (var i = 0; i < node.childCount; i++) {
                children.push(node.child(i));
              }
            } else {
              children.push(node);
            }
          });
          slice = new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
        } // finally, handle rich-text copy-paste


        if (isRichText) {
          // linkify the text where possible
          slice = linkifyContent(state.schema)(slice);

          if (handlePasteLinkOnSelectedTextWithAnalytics(view, event, slice, PasteTypes.richText)(state, dispatch)) {
            return true;
          } // run macro autoconvert prior to other conversions


          if (handleMacroAutoConvert(text, slice, cardOptions, extensionAutoConverter)(state, dispatch, view)) {
            // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
            sendPasteAnalyticsEvent(view, event, slice, {
              type: PasteTypes.richText
            });
            return true;
          } // get editor-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content


          if (handlePasteTable(view, null, slice)) {
            sendPasteAnalyticsEvent(view, event, slice, {
              type: PasteTypes.richText
            });
            return true;
          } // remove annotation marks from the pasted data if they are not present in the document
          // for the cases when they are pasted from external pages


          if (slice.content.size && containsAnyAnnotations(slice, state)) {
            stripNonExistingAnnotations(slice, state);
          } // ED-4732


          if (handlePastePreservingMarksWithAnalytics(view, event, slice, PasteTypes.richText)(state, dispatch)) {
            return true;
          } // Check that we are pasting in a location that does not accept
          // breakout marks, if so we strip the mark and paste. Note that
          // breakout marks are only valid in the root document.


          if (selectionParentType !== state.schema.nodes.doc) {
            var sliceCopy = Slice.fromJSON(state.schema, slice.toJSON() || {});
            sliceCopy.content.descendants(function (node) {
              node.marks = node.marks.filter(function (mark) {
                return mark.type.name !== 'breakout';
              }); // as breakout marks should only be on top level nodes,
              // we don't traverse the entire document

              return false;
            });
            slice = sliceCopy;
          }

          if (handleExpandWithAnalytics(view, event, slice)(state, dispatch)) {
            return true;
          }

          if (!insideTable(state)) {
            slice = transformSliceNestedExpandToExpand(slice, state.schema);
          } // Create a custom handler to avoid handling with handleRichText method
          // As SafeInsert is used inside handleRichText which caused some bad UX like this:
          // https://product-fabric.atlassian.net/browse/MEX-1520


          if (handlePasteIntoCaptionWithAnalytics(view, event, slice, PasteTypes.richText)(state, dispatch)) {
            return true;
          }

          if (handlePastePanelIntoListWithAnalytics(view, event, slice)(state, dispatch)) {
            return true;
          }

          return handleRichTextWithAnalytics(view, event, slice)(state, dispatch);
        }

        return false;
      },
      transformPasted: function transformPasted(slice) {
        if (sanitizePrivateContent) {
          slice = handleMention(slice, schema);
        }
        /* Bitbucket copies diffs as multiple adjacent code blocks
         * so we merge ALL adjacent code blocks to support paste here */


        if (pastedFromBitBucket) {
          slice = transformSliceToJoinAdjacentCodeBlocks(slice);
        }

        slice = transformSingleLineCodeBlockToCodeMark(slice, schema);
        slice = transformSliceToCorrectMediaWrapper(slice, schema);
        slice = transformSliceToDecisionList(slice, schema); // splitting linebreaks into paragraphs must happen before upgrading text to lists

        slice = splitParagraphs(slice, schema);
        slice = upgradeTextToLists(slice, schema);

        if (slice.content.childCount && slice.content.lastChild.type === schema.nodes.codeBlock) {
          slice = new Slice(slice.content.append(Fragment.from(schema.nodes.paragraph.createAndFill())), slice.openStart, 1);
        }

        return slice;
      },
      transformPastedHTML: function transformPastedHTML(html) {
        // Fix for issue ED-4438
        // text from google docs should not be pasted as inline code
        if (html.indexOf('id="docs-internal-guid-') >= 0) {
          html = html.replace(/white-space:pre/g, '');
          html = html.replace(/white-space:pre-wrap/g, '');
        } // Partial fix for ED-7331: During a copy/paste from the legacy tinyMCE
        // confluence editor, if we encounter an incomplete table (e.g. table elements
        // not wrapped in <table>), we try to rebuild a complete, valid table if possible.


        if (mostRecentPasteEvent && isPastedFromTinyMCEConfluence(mostRecentPasteEvent, html) && htmlHasIncompleteTable(html)) {
          var completeTableHtml = tryRebuildCompleteTableHtml(html);

          if (completeTableHtml) {
            html = completeTableHtml;
          }
        }

        if (!isPastedFromWord(html) && !isPastedFromExcel(html) && html.indexOf('<img ') >= 0) {
          html = unwrapNestedMediaElements(html);
        } // https://product-fabric.atlassian.net/browse/ED-11714
        // Checking for edge case when copying a list item containing links from Notion
        // The html from this case is invalid with duplicate nested links


        if (htmlHasInvalidLinkTags(html)) {
          html = removeDuplicateInvalidLinks(html);
        } // Fix for ED-13568: Code blocks being copied/pasted when next to each other get merged


        pastedFromBitBucket = html.indexOf('data-qa="code-line"') >= 0;
        mostRecentPasteEvent = null;
        return html;
      }
    }
  });
}