import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, TextSelection } from 'prosemirror-state';
import uuid from 'uuid';
import { shallowEqual } from '../../../utils';
export let LinkAction;

(function (LinkAction) {
  LinkAction["SHOW_INSERT_TOOLBAR"] = "SHOW_INSERT_TOOLBAR";
  LinkAction["HIDE_TOOLBAR"] = "HIDE_TOOLBAR";
  LinkAction["SELECTION_CHANGE"] = "SELECTION_CHANGE";
  LinkAction["INSERT_LINK_TOOLBAR"] = "INSERT";
  LinkAction["EDIT_INSERTED_TOOLBAR"] = "EDIT_INSERTED_TOOLBAR";
})(LinkAction || (LinkAction = {}));

export let InsertStatus;

(function (InsertStatus) {
  InsertStatus["EDIT_LINK_TOOLBAR"] = "EDIT";
  InsertStatus["INSERT_LINK_TOOLBAR"] = "INSERT";
  InsertStatus["EDIT_INSERTED_TOOLBAR"] = "EDIT_INSERTED";
})(InsertStatus || (InsertStatus = {}));

export const canLinkBeCreatedInRange = (from, to) => state => {
  if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
    const $from = state.doc.resolve(from);
    const $to = state.doc.resolve(to);
    const link = state.schema.marks.link;

    if ($from.parent === $to.parent && $from.parent.isTextblock) {
      if ($from.parent.type.allowsMarkType(link)) {
        let allowed = true;
        state.doc.nodesBetween(from, to, node => {
          allowed = allowed && !node.marks.some(m => m.type.excludes(link));
          return allowed;
        });
        return allowed;
      }
    }
  }

  return false;
};

const isSelectionInsideLink = state => !!state.doc.type.schema.marks.link.isInSet(state.selection.$from.marks());

const isSelectionAroundLink = state => {
  const {
    $from,
    $to
  } = state.selection;
  const node = $from.nodeAfter;
  return !!node && $from.textOffset === 0 && $to.pos - $from.pos === node.nodeSize && !!state.doc.type.schema.marks.link.isInSet(node.marks);
};

const mapTransactionToState = (state, tr) => {
  if (!state) {
    return undefined;
  } else if (state.type === InsertStatus.EDIT_LINK_TOOLBAR || state.type === InsertStatus.EDIT_INSERTED_TOOLBAR) {
    const {
      pos,
      deleted
    } = tr.mapping.mapResult(state.pos, 1);
    const node = tr.doc.nodeAt(pos); // If the position was not deleted & it is still a link

    if (!deleted && !!node.type.schema.marks.link.isInSet(node.marks)) {
      if (node === state.node && pos === state.pos) {
        return state;
      }

      return { ...state,
        pos,
        node
      };
    } // If the position has been deleted, then require a navigation to show the toolbar again


    return;
  } else if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    return { ...state,
      from: tr.mapping.map(state.from),
      to: tr.mapping.map(state.to)
    };
  }

  return;
};

const toState = (state, action, editorState) => {
  // Show insert or edit toolbar
  if (!state) {
    switch (action) {
      case LinkAction.SHOW_INSERT_TOOLBAR:
        {
          const {
            from,
            to
          } = editorState.selection;

          if (canLinkBeCreatedInRange(from, to)(editorState)) {
            return {
              type: InsertStatus.INSERT_LINK_TOOLBAR,
              from,
              to
            };
          }

          return undefined;
        }

      case LinkAction.SELECTION_CHANGE:
        // If the user has moved their cursor, see if they're in a link
        const link = getActiveLinkMark(editorState);

        if (link) {
          return { ...link,
            type: InsertStatus.EDIT_LINK_TOOLBAR
          };
        }

        return undefined;

      default:
        return undefined;
    }
  } // Update toolbar state if selection changes, or if toolbar is hidden


  if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.EDIT_INSERTED_TOOLBAR:
        {
          const link = getActiveLinkMark(editorState);

          if (link) {
            if (link.pos === state.pos && link.node === state.node) {
              return { ...state,
                type: InsertStatus.EDIT_INSERTED_TOOLBAR
              };
            }

            return { ...link,
              type: InsertStatus.EDIT_INSERTED_TOOLBAR
            };
          }

          return undefined;
        }

      case LinkAction.SELECTION_CHANGE:
        const link = getActiveLinkMark(editorState);

        if (link) {
          if (link.pos === state.pos && link.node === state.node) {
            // Make sure we return the same object, if it's the same link
            return state;
          }

          return { ...link,
            type: InsertStatus.EDIT_LINK_TOOLBAR
          };
        }

        return undefined;

      case LinkAction.HIDE_TOOLBAR:
        return undefined;

      default:
        return state;
    }
  } // Remove toolbar if user changes selection or toolbar is hidden


  if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.SELECTION_CHANGE:
      case LinkAction.HIDE_TOOLBAR:
        return undefined;

      default:
        return state;
    }
  }

  return;
};

const getActiveLinkMark = state => {
  const {
    selection: {
      $from
    }
  } = state;

  if (isSelectionInsideLink(state) || isSelectionAroundLink(state)) {
    const pos = $from.pos - $from.textOffset;
    const node = state.doc.nodeAt(pos);
    return node && node.isText ? {
      node,
      pos
    } : undefined;
  }

  return undefined;
};

const getActiveText = selection => {
  const currentSlice = selection.content();

  if (currentSlice.size === 0) {
    return;
  }

  if (currentSlice.content.childCount === 1 && currentSlice.content.firstChild && selection instanceof TextSelection) {
    return currentSlice.content.firstChild.textContent;
  }

  return;
};

export const stateKey = new PluginKey('hyperlinkPlugin');
export const plugin = dispatch => new SafePlugin({
  state: {
    init(_, state) {
      const canInsertLink = canLinkBeCreatedInRange(state.selection.from, state.selection.to)(state);
      return {
        activeText: getActiveText(state.selection),
        canInsertLink,
        timesViewed: 0,
        activeLinkMark: toState(undefined, LinkAction.SELECTION_CHANGE, state)
      };
    },

    apply(tr, pluginState, oldState, newState) {
      let state = pluginState;
      const action = tr.getMeta(stateKey) && tr.getMeta(stateKey).type;
      const inputMethod = tr.getMeta(stateKey) && tr.getMeta(stateKey).inputMethod;

      if (tr.docChanged) {
        state = {
          activeText: state.activeText,
          canInsertLink: canLinkBeCreatedInRange(newState.selection.from, newState.selection.to)(newState),
          timesViewed: state.timesViewed,
          inputMethod,
          activeLinkMark: mapTransactionToState(state.activeLinkMark, tr)
        };
      }

      if (action) {
        const stateForAnalytics = [LinkAction.SHOW_INSERT_TOOLBAR, LinkAction.EDIT_INSERTED_TOOLBAR].includes(action) ? {
          timesViewed: ++state.timesViewed,
          searchSessionId: uuid()
        } : {
          timesViewed: state.timesViewed,
          searchSessionId: state.searchSessionId
        };
        state = {
          activeText: state.activeText,
          canInsertLink: state.canInsertLink,
          inputMethod,
          activeLinkMark: toState(state.activeLinkMark, action, newState),
          ...stateForAnalytics
        };
      }

      const hasPositionChanged = oldState.selection.from !== newState.selection.from || oldState.selection.to !== newState.selection.to;

      if (tr.selectionSet && hasPositionChanged) {
        state = {
          activeText: getActiveText(newState.selection),
          canInsertLink: canLinkBeCreatedInRange(newState.selection.from, newState.selection.to)(newState),
          activeLinkMark: toState(state.activeLinkMark, LinkAction.SELECTION_CHANGE, newState),
          timesViewed: state.timesViewed,
          searchSessionId: state.searchSessionId,
          inputMethod
        };
      }

      if (!shallowEqual(state, pluginState)) {
        dispatch(stateKey, state);
      }

      return state;
    }

  },
  key: stateKey,
  props: {
    handleDOMEvents: {
      mouseup: (_, event) => {
        // this prevents redundant selection transaction when clicking on link
        // link state will be update on slection change which happens on mousedown
        if (isLinkDirectTarget(event)) {
          event.preventDefault();
          return true;
        }

        return false;
      },
      mousedown: (view, event) => {
        // since link clicks are disallowed by browsers inside contenteditable
        // so we need to handle shift+click selection ourselves in this case
        if (!event.shiftKey || !isLinkDirectTarget(event)) {
          return false;
        }

        const {
          state
        } = view;
        const {
          selection: {
            $anchor
          }
        } = state;
        const newPosition = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        });

        if ((newPosition === null || newPosition === void 0 ? void 0 : newPosition.pos) != null && newPosition.pos !== $anchor.pos) {
          const tr = state.tr.setSelection(TextSelection.create(state.doc, $anchor.pos, newPosition.pos));
          view.dispatch(tr);
          return true;
        }

        return false;
      }
    }
  }
});

function isLinkDirectTarget(event) {
  return (event === null || event === void 0 ? void 0 : event.target) instanceof HTMLElement && event.target.tagName === 'A';
}