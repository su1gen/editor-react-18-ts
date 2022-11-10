"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorUtils = require("prosemirror-utils");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _styles = require("../gap-cursor/styles");

var _selection = require("../gap-cursor/selection");

var _utils = require("../gap-cursor/utils");

var _placeGapCursor = require("../gap-cursor/utils/place-gap-cursor");

var _actions = require("../gap-cursor/actions");

var _direction = require("../gap-cursor/direction");

var _gapCursorPluginKey = require("./gap-cursor-plugin-key");

var plugin = new _safePlugin.SafePlugin({
  key: _gapCursorPluginKey.gapCursorPluginKey,
  state: {
    init: function init() {
      return false;
    },
    apply: function apply(_tr, _pluginState, _oldState, newState) {
      return newState.selection instanceof _selection.GapCursorSelection;
    }
  },
  view: function view(_view) {
    /**
     * If the selection is at the beginning of a document and is a NodeSelection,
     * convert to a GapCursor selection. This is to stop users accidentally replacing
     * the first node of a document by accident.
     */
    if (_view.state.selection.anchor === 0 && _view.state.selection instanceof _prosemirrorState.NodeSelection) {
      // This is required otherwise the dispatch doesn't trigger in the correct place
      window.requestAnimationFrame(function () {
        _view.dispatch(_view.state.tr.setSelection(new _selection.GapCursorSelection(_view.state.doc.resolve(0), _selection.Side.LEFT)));
      });
    }

    return {
      update: function update(view) {
        var pluginState = _gapCursorPluginKey.gapCursorPluginKey.getState(view.state);
        /**
         * Starting with prosemirror-view 1.19.4, cursor wrapper that previousely was hiding cursor doesn't exist:
         * https://github.com/ProseMirror/prosemirror-view/commit/4a56bc7b7e61e96ef879d1dae1014ede0fc09e43
         *
         * Because it was causing issues with RTL: https://github.com/ProseMirror/prosemirror/issues/948
         *
         * This is the work around which uses `caret-color: transparent` in order to hide regular caret,
         * when gap cursor is visible.
         *
         * Browser support is pretty good: https://caniuse.com/#feat=css-caret-color
         */


        view.dom.classList.toggle(_styles.hideCaretModifier, pluginState);
      }
    };
  },
  props: {
    decorations: function decorations(_ref) {
      var doc = _ref.doc,
          selection = _ref.selection;

      if (selection instanceof _selection.GapCursorSelection) {
        var $from = selection.$from,
            side = selection.side; // render decoration DOM node always to the left of the target node even if selection points to the right
        // otherwise positioning of the right gap cursor is a nightmare when the target node has a nodeView with vertical margins

        var position = selection.head;
        var isRightCursor = side === _selection.Side.RIGHT;

        if (isRightCursor && $from.nodeBefore) {
          var nodeBeforeStart = (0, _prosemirrorUtils.findPositionOfNodeBefore)(selection);

          if (typeof nodeBeforeStart === 'number') {
            position = nodeBeforeStart;
          }
        }

        var node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;
        var breakoutMode = node && (0, _utils.getBreakoutModeFromTargetNode)(node);
        return _prosemirrorView.DecorationSet.create(doc, [_prosemirrorView.Decoration.widget(position, _placeGapCursor.toDOM, {
          key: "".concat(_selection.JSON_ID, "-").concat(side, "-").concat(breakoutMode),
          side: breakoutMode ? -1 : 0
        })]);
      }

      return null;
    },
    // render gap cursor only when its valid
    createSelectionBetween: function createSelectionBetween(view, $anchor, $head) {
      if (view && view.state && view.state.selection instanceof _cellSelection.CellSelection) {
        // Do not show GapCursor when there is a CellSection happening
        return;
      }

      if ($anchor.pos === $head.pos && _selection.GapCursorSelection.valid($head)) {
        return new _selection.GapCursorSelection($head);
      }

      return;
    },
    // there's no space between top level nodes and the wrapping ProseMirror contenteditable area and handleClick won't capture clicks, there's nothing to click on
    // it handles only attempts to set gap cursor for nested nodes, where we have space between parent and child nodes
    // top level nodes are handled by <ClickAreaBlock>
    handleClick: function handleClick(view, position, event) {
      var posAtCoords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY
      }); // this helps to ignore all of the clicks outside of the parent (e.g. nodeView controls)

      if (posAtCoords && posAtCoords.inside !== position && !(0, _utils.isIgnoredClick)(event.target)) {
        // max available space between parent and child from the left side in px
        // this ensures the correct side of the gap cursor in case of clicking in between two block nodes
        var leftSideOffsetX = 20;
        var side = event.offsetX > leftSideOffsetX ? _selection.Side.RIGHT : _selection.Side.LEFT;
        return (0, _actions.setGapCursorAtPos)(position, side)(view.state, view.dispatch);
      }

      return false;
    },
    handleDOMEvents: {
      /**
       * Android composition events aren't handled well by Prosemirror
       * We've added a couple of beforeinput hooks to help PM out when trying to delete
       * certain nodes. We can remove these when PM has better composition support.
       * @see https://github.com/ProseMirror/prosemirror/issues/543
       */
      beforeinput: function beforeinput(view, event) {
        if (event.inputType === 'deleteContentBackward' && view.state.selection instanceof _selection.GapCursorSelection) {
          event.preventDefault();
          return (0, _actions.deleteNode)(_direction.Direction.BACKWARD)(view.state, view.dispatch);
        }

        return false;
      }
    }
  }
});
var _default = plugin;
exports.default = _default;