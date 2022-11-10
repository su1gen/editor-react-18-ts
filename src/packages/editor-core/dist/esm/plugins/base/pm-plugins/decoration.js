import { DecorationSet, Decoration } from 'prosemirror-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
export var decorationStateKey = new PluginKey('decorationPlugin');
export var ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["DECORATION_ADD"] = 0] = "DECORATION_ADD";
  ACTIONS[ACTIONS["DECORATION_REMOVE"] = 1] = "DECORATION_REMOVE";
})(ACTIONS || (ACTIONS = {}));

export var hoverDecoration = function hoverDecoration(nodeType, add) {
  var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'danger';
  return function (state, dispatch) {
    var from;
    var parentNode;

    if (state.selection instanceof NodeSelection) {
      var selectedNode = state.selection.node;
      var nodeTypes = Array.isArray(nodeType) ? nodeType : [nodeType];
      var isNodeTypeMatching = nodeTypes.indexOf(selectedNode.type) > -1; // This adds danger styling if the selected node is the one that requires
      // the decoration to be added, e.g. if a layout is selected and the user
      // hovers over the layout's delete button.

      if (isNodeTypeMatching) {
        from = state.selection.from;
        parentNode = selectedNode;
      }
    } // This adds danger styling if the selection is not a node selection, OR if
    // the selected node is a child of the one that requires the decoration to
    // be added, e.g. if a decision item is selected inside a layout and the
    // user hovers over the layout's delete button.


    var foundParentNode = findParentNodeOfType(nodeType)(state.selection);

    if (from === undefined && foundParentNode) {
      from = foundParentNode.pos;
      parentNode = foundParentNode.node;
    } // Note: can't use !from as from could be 0, which is falsy but valid


    if (from === undefined || parentNode === undefined) {
      return false;
    }

    if (dispatch) {
      dispatch(state.tr.setMeta(decorationStateKey, {
        action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
        data: Decoration.node(from, from + parentNode.nodeSize, {
          class: className
        }, {
          key: 'decorationNode'
        })
      }).setMeta('addToHistory', false));
    }

    return true;
  };
};
export default (function () {
  return new SafePlugin({
    key: decorationStateKey,
    state: {
      init: function init() {
        return {
          decoration: undefined
        };
      },
      apply: function apply(tr, pluginState) {
        if (pluginState.decoration) {
          var mapResult = tr.mapping.mapResult(pluginState.decoration.from);

          if (mapResult.deleted) {
            pluginState = {
              decoration: undefined
            };
          }
        }

        var meta = tr.getMeta(decorationStateKey);

        if (!meta) {
          return pluginState;
        }

        switch (meta.action) {
          case ACTIONS.DECORATION_ADD:
            return {
              decoration: meta.data
            };

          case ACTIONS.DECORATION_REMOVE:
            return {
              decoration: undefined
            };

          default:
            return pluginState;
        }
      }
    },
    props: {
      decorations: function decorations(state) {
        var doc = state.doc;

        var _ref = decorationStateKey.getState(state),
            decoration = _ref.decoration;

        if (decoration) {
          return DecorationSet.create(doc, [decoration]);
        }

        return null;
      }
    }
  });
});