import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { hideCaretModifier } from '../gap-cursor/styles';
import { GapCursorSelection, JSON_ID, Side as GapCursorSide, Side } from '../gap-cursor/selection';
import { getBreakoutModeFromTargetNode, isIgnoredClick } from '../gap-cursor/utils';
import { toDOM } from '../gap-cursor/utils/place-gap-cursor';
import { deleteNode, setGapCursorAtPos } from '../gap-cursor/actions';
import { Direction } from '../gap-cursor/direction';
import { gapCursorPluginKey } from './gap-cursor-plugin-key';
var plugin = new SafePlugin({
  key: gapCursorPluginKey,
  state: {
    init: function init() {
      return false;
    },
    apply: function apply(_tr, _pluginState, _oldState, newState) {
      return newState.selection instanceof GapCursorSelection;
    }
  },
  view: function view(_view) {
    /**
     * If the selection is at the beginning of a document and is a NodeSelection,
     * convert to a GapCursor selection. This is to stop users accidentally replacing
     * the first node of a document by accident.
     */
    if (_view.state.selection.anchor === 0 && _view.state.selection instanceof NodeSelection) {
      // This is required otherwise the dispatch doesn't trigger in the correct place
      window.requestAnimationFrame(function () {
        _view.dispatch(_view.state.tr.setSelection(new GapCursorSelection(_view.state.doc.resolve(0), GapCursorSide.LEFT)));
      });
    }

    return {
      update: function update(view) {
        var pluginState = gapCursorPluginKey.getState(view.state);
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

        view.dom.classList.toggle(hideCaretModifier, pluginState);
      }
    };
  },
  props: {
    decorations: function decorations(_ref) {
      var doc = _ref.doc,
          selection = _ref.selection;

      if (selection instanceof GapCursorSelection) {
        var $from = selection.$from,
            side = selection.side; // render decoration DOM node always to the left of the target node even if selection points to the right
        // otherwise positioning of the right gap cursor is a nightmare when the target node has a nodeView with vertical margins

        var position = selection.head;
        var isRightCursor = side === Side.RIGHT;

        if (isRightCursor && $from.nodeBefore) {
          var nodeBeforeStart = findPositionOfNodeBefore(selection);

          if (typeof nodeBeforeStart === 'number') {
            position = nodeBeforeStart;
          }
        }

        var node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;
        var breakoutMode = node && getBreakoutModeFromTargetNode(node);
        return DecorationSet.create(doc, [Decoration.widget(position, toDOM, {
          key: "".concat(JSON_ID, "-").concat(side, "-").concat(breakoutMode),
          side: breakoutMode ? -1 : 0
        })]);
      }

      return null;
    },
    // render gap cursor only when its valid
    createSelectionBetween: function createSelectionBetween(view, $anchor, $head) {
      if (view && view.state && view.state.selection instanceof CellSelection) {
        // Do not show GapCursor when there is a CellSection happening
        return;
      }

      if ($anchor.pos === $head.pos && GapCursorSelection.valid($head)) {
        return new GapCursorSelection($head);
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

      if (posAtCoords && posAtCoords.inside !== position && !isIgnoredClick(event.target)) {
        // max available space between parent and child from the left side in px
        // this ensures the correct side of the gap cursor in case of clicking in between two block nodes
        var leftSideOffsetX = 20;
        var side = event.offsetX > leftSideOffsetX ? Side.RIGHT : Side.LEFT;
        return setGapCursorAtPos(position, side)(view.state, view.dispatch);
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
        if (event.inputType === 'deleteContentBackward' && view.state.selection instanceof GapCursorSelection) {
          event.preventDefault();
          return deleteNode(Direction.BACKWARD)(view.state, view.dispatch);
        }

        return false;
      }
    }
  }
});
export default plugin;