"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
Object.defineProperty(exports, "md", {
  enumerable: true,
  get: function get() {
    return _md.md;
  }
});
Object.defineProperty(exports, "stateKey", {
  enumerable: true,
  get: function get() {
    return _pluginFactory.pluginKey;
  }
});

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _prosemirrorModel = require("prosemirror-model");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _uuid = _interopRequireDefault(require("uuid"));

var _editorMarkdownTransformer = require("@atlaskit/editor-markdown-transformer");

var _slice = require("../../../utils/slice");

var _extensions = require("@atlaskit/editor-common/extensions");

var clipboard = _interopRequireWildcard(require("../../../utils/clipboard"));

var _mediaSingle = require("../../media/utils/media-single");

var _util = require("../util");

var _utils = require("../../hyperlink/utils");

var _utils2 = require("../../expand/utils");

var _handlers = require("../handlers");

var _utils3 = require("../../code-block/utils");

var _analytics = require("./analytics");

var _analytics2 = require("../../analytics");

var _utils4 = require("../../../utils");

var _utils5 = require("@atlaskit/editor-common/utils");

var _mediaCommon = require("../../media/utils/media-common");

var _transforms = require("../../list/transforms");

var _md = require("../md");

var _utils6 = require("../../card/utils");

var _utils7 = require("../../tasks-and-decisions/utils");

var _utils8 = require("../../annotation/utils");

var _betterTypeHistory = require("../../base/pm-plugins/better-type-history");

var _clipboardTextSerializer = require("./clipboard-text-serializer");

var _tinyMCE = require("../util/tinyMCE");

var _utils9 = require("@atlaskit/editor-tables/utils");

var _step = require("../../../utils/step");

var _pluginFactory = require("./plugin-factory");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_analytics.sendPasteAnalyticsEvent;

function createPlugin(schema, dispatchAnalyticsEvent, dispatch, plainTextPasteLinkification, cardOptions, sanitizePrivateContent, providerFactory) {
  var atlassianMarkDownParser = new _editorMarkdownTransformer.MarkdownTransformer(schema, _md.md);

  function getMarkdownSlice(text, openStart, openEnd) {
    var textInput = text;

    if (textInput.includes('\\')) {
      textInput = textInput.replace(/\\/g, '\\\\');
    }

    var doc = atlassianMarkDownParser.parse((0, _util.escapeLinks)(textInput));

    if (doc && doc.content) {
      return new _prosemirrorModel.Slice(doc.content, openStart, openEnd);
    }

    return;
  }

  var extensionAutoConverter;

  function setExtensionAutoConverter(_x, _x2) {
    return _setExtensionAutoConverter.apply(this, arguments);
  }

  function _setExtensionAutoConverter() {
    _setExtensionAutoConverter = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(name, extensionProviderPromise) {
      return _regenerator.default.wrap(function _callee$(_context) {
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
              return (0, _extensions.getExtensionAutoConvertersFromProvider)(extensionProviderPromise);

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
  return new _safePlugin.SafePlugin({
    key: _pluginFactory.pluginKey,
    state: (0, _pluginFactory.createPluginState)(dispatch, {
      pastedMacroPositions: {}
    }),
    props: {
      // For serialising to plain text
      clipboardTextSerializer: _clipboardTextSerializer.clipboardTextSerializer,
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
          slice = new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(schema.text(text)), 1, 1);
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


          if ((0, _util.htmlContainsSingleFile)(html)) {
            return true;
          }

          event.stopPropagation();
        }

        var state = view.state;

        var analyticsPlugin = _analytics2.analyticsPluginKey.getState(state);

        var pasteTrackingEnabled = analyticsPlugin === null || analyticsPlugin === void 0 ? void 0 : (_analyticsPlugin$perf = analyticsPlugin.performanceTracking) === null || _analyticsPlugin$perf === void 0 ? void 0 : (_analyticsPlugin$perf2 = _analyticsPlugin$perf.pasteTracking) === null || _analyticsPlugin$perf2 === void 0 ? void 0 : _analyticsPlugin$perf2.enabled;

        if (pasteTrackingEnabled) {
          var content = (0, _analytics.getContentNodeTypes)(slice.content);
          var pasteId = (0, _uuid.default)();
          var measureName = "".concat(_utils4.measurements.PASTE, "_").concat(pasteId);
          (0, _utils5.measureRender)(measureName, function (_ref) {
            var duration = _ref.duration,
                distortedDuration = _ref.distortedDuration;
            var payload = (0, _analytics.createPasteMeasurePayload)({
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

            var slice = (0, _step.extractSliceFromStep)(step);
            var tableExists = false;
            slice === null || slice === void 0 ? void 0 : (_slice$content = slice.content) === null || _slice$content === void 0 ? void 0 : _slice$content.forEach(function (node) {
              if (node.type === state.schema.nodes.table) {
                tableExists = true;
              }
            });
            return tableExists;
          });

          if (!isPastingTextInsidePlaceholderText && !isPastingTable) {
            tr.setMeta(_betterTypeHistory.pluginKey, true);
          }

          view.dispatch(tr);
        };

        slice = (0, _handlers.handleParagraphBlockMarks)(state, slice);
        var plainTextPasteSlice = plainTextPasteLinkification === true ? (0, _utils.linkifyContent)(state.schema)(slice) : slice;

        if ((0, _analytics.handlePasteAsPlainTextWithAnalytics)(view, event, plainTextPasteSlice)(state, dispatch, view)) {
          return true;
        } // transform slices based on destination


        slice = (0, _mediaSingle.transformSliceForMedia)(slice, schema)(state.selection);
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
            if ((0, _analytics.handlePasteLinkOnSelectedTextWithAnalytics)(view, event, markdownSlice, _analytics2.PasteTypes.markdown)(state, dispatch)) {
              return true;
            } // run macro autoconvert prior to other conversions


            if ((0, _handlers.handleMacroAutoConvert)(text, markdownSlice, cardOptions, extensionAutoConverter)(state, dispatch, view)) {
              // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
              (0, _analytics.sendPasteAnalyticsEvent)(view, event, markdownSlice, {
                type: _analytics2.PasteTypes.markdown
              });
              return true;
            }
          }
        }

        slice = (0, _utils6.transformUnsupportedBlockCardToInline)(slice, state); // Handles edge case so that when copying text from the top level of the document
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

        if ((0, _analytics.handlePasteIntoTaskAndDecisionWithAnalytics)(view, event, slice, isPlainText ? _analytics2.PasteTypes.plain : _analytics2.PasteTypes.richText)(state, dispatch)) {
          return true;
        } // If we're in a code block, append the text contents of clipboard inside it


        if ((0, _analytics.handleCodeBlockWithAnalytics)(view, event, slice, text)(state, dispatch)) {
          return true;
        }

        if ((0, _analytics.handleMediaSingleWithAnalytics)(view, event, slice, isPastedFile ? _analytics2.PasteTypes.binary : _analytics2.PasteTypes.richText)(state, dispatch, view)) {
          return true;
        }

        if ((0, _analytics.handleSelectedTableWithAnalytics)(view, event, slice)(state, dispatch)) {
          return true;
        } // If the clipboard only contains plain text, attempt to parse it as Markdown


        if (isPlainText && markdownSlice) {
          if ((0, _analytics.handlePastePreservingMarksWithAnalytics)(view, event, markdownSlice, _analytics2.PasteTypes.markdown)(state, dispatch)) {
            return true;
          }

          return (0, _analytics.handleMarkdownWithAnalytics)(view, event, markdownSlice)(state, dispatch);
        }

        if (isRichText && (0, _utils4.isInsideBlockQuote)(state)) {
          //If pasting inside blockquote
          //Skip the blockquote node and keep remaining nodes as they are
          var blockquote = schema.nodes.blockquote;
          var children = [];
          (0, _slice.mapChildren)(slice.content, function (node) {
            if (node.type === blockquote) {
              for (var i = 0; i < node.childCount; i++) {
                children.push(node.child(i));
              }
            } else {
              children.push(node);
            }
          });
          slice = new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.fromArray(children), slice.openStart, slice.openEnd);
        } // finally, handle rich-text copy-paste


        if (isRichText) {
          // linkify the text where possible
          slice = (0, _utils.linkifyContent)(state.schema)(slice);

          if ((0, _analytics.handlePasteLinkOnSelectedTextWithAnalytics)(view, event, slice, _analytics2.PasteTypes.richText)(state, dispatch)) {
            return true;
          } // run macro autoconvert prior to other conversions


          if ((0, _handlers.handleMacroAutoConvert)(text, slice, cardOptions, extensionAutoConverter)(state, dispatch, view)) {
            // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
            (0, _analytics.sendPasteAnalyticsEvent)(view, event, slice, {
              type: _analytics2.PasteTypes.richText
            });
            return true;
          } // get editor-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content


          if ((0, _utils9.handlePaste)(view, null, slice)) {
            (0, _analytics.sendPasteAnalyticsEvent)(view, event, slice, {
              type: _analytics2.PasteTypes.richText
            });
            return true;
          } // remove annotation marks from the pasted data if they are not present in the document
          // for the cases when they are pasted from external pages


          if (slice.content.size && (0, _utils8.containsAnyAnnotations)(slice, state)) {
            (0, _utils8.stripNonExistingAnnotations)(slice, state);
          } // ED-4732


          if ((0, _analytics.handlePastePreservingMarksWithAnalytics)(view, event, slice, _analytics2.PasteTypes.richText)(state, dispatch)) {
            return true;
          } // Check that we are pasting in a location that does not accept
          // breakout marks, if so we strip the mark and paste. Note that
          // breakout marks are only valid in the root document.


          if (selectionParentType !== state.schema.nodes.doc) {
            var sliceCopy = _prosemirrorModel.Slice.fromJSON(state.schema, slice.toJSON() || {});

            sliceCopy.content.descendants(function (node) {
              node.marks = node.marks.filter(function (mark) {
                return mark.type.name !== 'breakout';
              }); // as breakout marks should only be on top level nodes,
              // we don't traverse the entire document

              return false;
            });
            slice = sliceCopy;
          }

          if ((0, _analytics.handleExpandWithAnalytics)(view, event, slice)(state, dispatch)) {
            return true;
          }

          if (!(0, _utils4.insideTable)(state)) {
            slice = (0, _utils2.transformSliceNestedExpandToExpand)(slice, state.schema);
          } // Create a custom handler to avoid handling with handleRichText method
          // As SafeInsert is used inside handleRichText which caused some bad UX like this:
          // https://product-fabric.atlassian.net/browse/MEX-1520


          if ((0, _analytics.handlePasteIntoCaptionWithAnalytics)(view, event, slice, _analytics2.PasteTypes.richText)(state, dispatch)) {
            return true;
          }

          if ((0, _analytics.handlePastePanelIntoListWithAnalytics)(view, event, slice)(state, dispatch)) {
            return true;
          }

          return (0, _analytics.handleRichTextWithAnalytics)(view, event, slice)(state, dispatch);
        }

        return false;
      },
      transformPasted: function transformPasted(slice) {
        if (sanitizePrivateContent) {
          slice = (0, _handlers.handleMention)(slice, schema);
        }
        /* Bitbucket copies diffs as multiple adjacent code blocks
         * so we merge ALL adjacent code blocks to support paste here */


        if (pastedFromBitBucket) {
          slice = (0, _utils3.transformSliceToJoinAdjacentCodeBlocks)(slice);
        }

        slice = (0, _utils3.transformSingleLineCodeBlockToCodeMark)(slice, schema);
        slice = (0, _mediaCommon.transformSliceToCorrectMediaWrapper)(slice, schema);
        slice = (0, _utils7.transformSliceToDecisionList)(slice, schema); // splitting linebreaks into paragraphs must happen before upgrading text to lists

        slice = (0, _transforms.splitParagraphs)(slice, schema);
        slice = (0, _transforms.upgradeTextToLists)(slice, schema);

        if (slice.content.childCount && slice.content.lastChild.type === schema.nodes.codeBlock) {
          slice = new _prosemirrorModel.Slice(slice.content.append(_prosemirrorModel.Fragment.from(schema.nodes.paragraph.createAndFill())), slice.openStart, 1);
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


        if (mostRecentPasteEvent && (0, _tinyMCE.isPastedFromTinyMCEConfluence)(mostRecentPasteEvent, html) && (0, _tinyMCE.htmlHasIncompleteTable)(html)) {
          var completeTableHtml = (0, _tinyMCE.tryRebuildCompleteTableHtml)(html);

          if (completeTableHtml) {
            html = completeTableHtml;
          }
        }

        if (!(0, _util.isPastedFromWord)(html) && !(0, _util.isPastedFromExcel)(html) && html.indexOf('<img ') >= 0) {
          html = (0, _mediaCommon.unwrapNestedMediaElements)(html);
        } // https://product-fabric.atlassian.net/browse/ED-11714
        // Checking for edge case when copying a list item containing links from Notion
        // The html from this case is invalid with duplicate nested links


        if ((0, _util.htmlHasInvalidLinkTags)(html)) {
          html = (0, _util.removeDuplicateInvalidLinks)(html);
        } // Fix for ED-13568: Code blocks being copied/pasted when next to each other get merged


        pastedFromBitBucket = html.indexOf('data-qa="code-line"') >= 0;
        mostRecentPasteEvent = null;
        return html;
      }
    }
  });
}