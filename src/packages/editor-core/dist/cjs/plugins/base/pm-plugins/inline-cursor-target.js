"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInlineNodeView = exports.inlineCursorTargetStateKey = exports.default = void 0;

var _prosemirrorView = require("prosemirror-view");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("@atlaskit/editor-common/utils");

var _utils2 = require("../../../utils");

var inlineCursorTargetStateKey = new _prosemirrorState.PluginKey('inlineCursorTargetPlugin');
exports.inlineCursorTargetStateKey = inlineCursorTargetStateKey;

var isInlineNodeView = function isInlineNodeView(node) {
  return node && node.type.isInline && !node.type.isText;
};

exports.isInlineNodeView = isInlineNodeView;

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: inlineCursorTargetStateKey,
    state: {
      init: function init() {
        return {
          cursorTarget: undefined
        };
      },
      apply: function apply(tr) {
        var selection = tr.selection,
            doc = tr.doc;
        var $from = selection.$from,
            $to = selection.$to; // In Safari, if the cursor target is to the right of the cursor it will block selections
        // made with shift + arrowRight and vice versa for shift + arrowLeft. This is due to a
        // contenteditable bug in safari, where editable elements block the selection but we need
        // the cursor target to be editable for the following:
        // - Ability to navigate with down/up arrows when between inline nodes
        // - Ability to navigate with down/up arrows when between the start of a paragraph & an inline node
        // - Ability to click and drag to select an inline node if it is the first node
        // To prevent blocking the selection, we check handleDOMEvents and add meta to
        // the transaction to prevent the plugin from making cursor target decorations.

        var safariShiftSelection = tr.getMeta(inlineCursorTargetStateKey);

        if (selection && (0, _utils2.isTextSelection)(selection) && !safariShiftSelection) {
          var hasInlineNodeViewAfter = isInlineNodeView($from.nodeAfter);
          var hasInlineNodeViewBefore = isInlineNodeView($from.nodeBefore);
          var isAtStartAndInlineNodeViewAfter = $from.parentOffset === 0 && isInlineNodeView($from.nodeAfter);
          var isAtEndAndInlineNodeViewBefore = doc.resolve($from.pos).node().lastChild === $from.nodeBefore && isInlineNodeView($from.nodeBefore);

          var createWidget = function createWidget(side) {
            var node = document.createElement('span');
            node.contentEditable = 'true';
            node.appendChild(document.createTextNode(_utils.ZERO_WIDTH_SPACE));
            node.className = 'cursor-target';
            return _prosemirrorView.Decoration.widget(selection.from, node, {
              raw: true,
              side: side === 'left' ? -1 : 1,
              key: 'inlineCursor'
            });
          }; // Create editable decoration widgets either side of the cursor to allow
          // text input.
          // We check beforeInput events below to prevent content
          // being added to the decorations.
          //
          // This prevents issues with the cursor disappearing
          // or appearing in the wrong place when;
          // - positioned between inline nodes (chrome + firefox)
          // - positioned between the beginning of another node and an inline node (firefox)
          // - positioned between an inline node and the end of a node (chrome)


          if (!_utils.browser.safari && (hasInlineNodeViewAfter || isAtEndAndInlineNodeViewBefore) && (hasInlineNodeViewBefore || isAtStartAndInlineNodeViewAfter)) {
            return {
              cursorTarget: {
                decorations: [createWidget('left'), createWidget('right')],
                positions: {
                  from: $from.pos,
                  to: $to.pos
                }
              }
            };
          } // Only create one widget on the left or right of the cursor in Safari.
          // This is to prevent the left key from being blocked when at the start of a paragraph,
          // and the right key from being blocked when at the end of a paragraph. This also
          // improves click and drag selections, making it easier to select the first node.


          if (_utils.browser.safari) {
            if (isAtEndAndInlineNodeViewBefore || hasInlineNodeViewBefore && hasInlineNodeViewAfter) {
              return {
                cursorTarget: {
                  decorations: [createWidget('left')],
                  positions: {
                    from: $from.pos,
                    to: $to.pos
                  }
                }
              };
            } else if (isAtStartAndInlineNodeViewAfter) {
              return {
                cursorTarget: {
                  decorations: [createWidget('right')],
                  positions: {
                    from: $from.pos,
                    to: $to.pos
                  }
                }
              };
            }
          }
        }

        return {
          cursorTarget: undefined
        };
      }
    },
    props: {
      decorations: function decorations(state) {
        var doc = state.doc;

        var _ref = inlineCursorTargetStateKey.getState(state),
            cursorTarget = _ref.cursorTarget;

        if (cursorTargetHasValidDecorations(cursorTarget)) {
          return _prosemirrorView.DecorationSet.create(doc, cursorTarget.decorations);
        }

        return null;
      },
      handleDOMEvents: {
        // Workaround to prevent the decorations created by the plugin from
        // blocking shift + arrow left/right selections in safari. When
        // a shift + arrow left/right event is detected, send meta data to the
        // plugin to prevent it from creating decorations.
        // TODO We may be able to remove this when playing the following ticket:
        // https://product-fabric.atlassian.net/browse/ED-14938
        keydown: function keydown(view, event) {
          if (_utils.browser.safari && event instanceof KeyboardEvent && event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            view.dispatch(view.state.tr.setMeta(inlineCursorTargetStateKey, {
              cursorTarget: undefined
            }));
          }

          return false;
        },
        // Check the DOM to see if there are inline cursor targets
        // after a composition event ends. If so, manually insert the
        // event data in order to prevent contents ending up inside
        // of the cursor target decorations.
        compositionend: function compositionend(view, incorrectlyTypedEvent) {
          // This is typed by the prosemirror definitions as Event,
          // this type is incorrect, and it is actually an InputEvent
          var event = incorrectlyTypedEvent;
          var state = view.state;

          var _ref2 = inlineCursorTargetStateKey.getState(state),
              cursorTarget = _ref2.cursorTarget;

          if (cursorTarget !== undefined) {
            handleTextInputInsideCursorTargetDecoration({
              event: event,
              cursorTarget: cursorTarget,
              view: view
            });
            return true;
          }

          return false;
        },
        // Check the DOM to see if there are inline cursor targets
        // before any input event. If so, manually insert the
        // event data in order to prevent contents ending up inside
        // of the cursor target decorations.
        beforeinput: function beforeinput(view, incorrectlyTypedEvent) {
          // This is typed by the prosemirror definitions as Event,
          // this type is incorrect, and it is actually an InputEvent
          var event = incorrectlyTypedEvent;
          var state = view.state;

          var _ref3 = inlineCursorTargetStateKey.getState(state),
              cursorTarget = _ref3.cursorTarget;

          if (!event.isComposing && cursorTarget !== undefined) {
            handleTextInputInsideCursorTargetDecoration({
              event: event,
              cursorTarget: cursorTarget,
              view: view
            });
            return true;
          }

          return false;
        }
      }
    }
  });
};

exports.default = _default;

function cursorTargetHasValidDecorations(cursorTarget) {
  if (!cursorTarget || // Decorations can end up as null when the decorations prop is
  // called after the decorations have been removed from the dom.
  // https://github.com/ProseMirror/prosemirror-view/blob/8f0d313a6389b86a335274fba36534ba1cb21f12/src/decoration.js#L30
  cursorTarget.decorations.includes(null)) {
    return false;
  }

  return true;
}

function handleTextInputInsideCursorTargetDecoration(_ref4) {
  var event = _ref4.event,
      view = _ref4.view,
      cursorTarget = _ref4.cursorTarget;
  event.stopPropagation();
  event.preventDefault();
  var content = event.data || '';
  var tr = view.state.tr; // ensure any custom handleTextInput handlers are called for the input event
  // ie. type ahead, emoji shortcuts.

  var potentiallyHandleByHandleTextInput = view.someProp('handleTextInput', function (f) {
    return f(view, cursorTarget.positions.from, cursorTarget.positions.to, content);
  });

  if (potentiallyHandleByHandleTextInput) {
    // if a handleTextInput handler has handled the event, we don't want to
    // manually update the document.
    return;
  }

  tr.insertText(content);
  view.dispatch(tr);
}