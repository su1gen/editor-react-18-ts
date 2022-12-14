import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection } from 'prosemirror-state';
import { uuid } from '@atlaskit/adf-schema';
import { nodesBetweenChanged, SetAttrsStep } from '../../../utils';
import { createSelectionClickHandler } from '../../selection/utils';
import { decisionItemNodeView } from '../nodeviews/decisionItem';
import { taskItemNodeViewFactory } from '../nodeviews/taskItem';
import { stateKey } from './plugin-key';
var ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["SET_CONTEXT_PROVIDER"] = 0] = "SET_CONTEXT_PROVIDER";
})(ACTIONS || (ACTIONS = {}));

const setContextIdentifierProvider = provider => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(stateKey, {
      action: ACTIONS.SET_CONTEXT_PROVIDER,
      data: provider
    }));
  }

  return true;
};

export function createPlugin(portalProviderAPI, eventDispatcher, providerFactory, dispatch, useLongPressSelection = false) {
  return new SafePlugin({
    props: {
      nodeViews: {
        taskItem: taskItemNodeViewFactory(portalProviderAPI, eventDispatcher, providerFactory),
        decisionItem: decisionItemNodeView(portalProviderAPI, eventDispatcher)
      },

      handleTextInput(view, from, to, text) {
        // When a decision item is selected and the user starts typing, the entire node
        // should be replaced with what was just typed. This custom text input handler
        // is needed to implement that behaviour.
        // TODO: ProseMirror should already do this by default
        // Tech debt to investigate why we need a custom handler here:
        // https://product-fabric.atlassian.net/browse/ED-9278
        const {
          state,
          dispatch
        } = view;
        const {
          tr
        } = state;

        if (state.selection instanceof NodeSelection && state.selection.node.type === view.state.schema.nodes.decisionItem) {
          state.selection.replace(tr);
          tr.insertText(text);

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        }

        return false;
      },

      handleClickOn: createSelectionClickHandler(['decisionItem'], target => target.hasAttribute('data-decision-wrapper') || target.getAttribute('aria-label') === 'Decision', {
        useLongPressSelection
      })
    },
    state: {
      init() {
        return {
          insideTaskDecisionItem: false
        };
      },

      apply(tr, pluginState) {
        const {
          action,
          data
        } = tr.getMeta(stateKey) || {
          action: null,
          data: null
        };
        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_CONTEXT_PROVIDER:
            newPluginState = { ...pluginState,
              contextIdentifierProvider: data
            };
            break;
        }

        dispatch(stateKey, newPluginState);
        return newPluginState;
      }

    },

    view(editorView) {
      const providerHandler = (name, providerPromise) => {
        if (name === 'contextIdentifierProvider') {
          if (!providerPromise) {
            setContextIdentifierProvider(undefined)(editorView.state, editorView.dispatch);
          } else {
            providerPromise.then(provider => {
              setContextIdentifierProvider(provider)(editorView.state, editorView.dispatch);
            });
          }
        }
      };

      providerFactory.subscribe('contextIdentifierProvider', providerHandler);
      return {};
    },

    key: stateKey,

    /*
     * After each transaction, we search through the document for any decisionList/Item & taskList/Item nodes
     * that do not have the localId attribute set and generate a random UUID to use. This is to replace a previous
     * Prosemirror capabibility where node attributes could be generated dynamically.
     * See https://discuss.prosemirror.net/t/release-0-23-0-possibly-to-be-1-0-0/959/17 for a discussion of this approach.
     *
     * Note: we currently do not handle the edge case where two nodes may have the same localId
     */
    appendTransaction: (transactions, _oldState, newState) => {
      const tr = newState.tr;
      let modified = false;
      transactions.forEach(transaction => {
        if (!transaction.docChanged) {
          return;
        } // Adds a unique id to a node


        nodesBetweenChanged(transaction, (node, pos) => {
          const {
            decisionList,
            decisionItem,
            taskList,
            taskItem
          } = newState.schema.nodes;

          if (!!node.type && (node.type === decisionList || node.type === decisionItem || node.type === taskList || node.type === taskItem)) {
            const {
              localId,
              ...rest
            } = node.attrs;

            if (localId === undefined || localId === null || localId === '') {
              tr.step(new SetAttrsStep(pos, {
                localId: uuid.generate(),
                ...rest
              }));
              modified = true;
            }
          }
        });
      });

      if (modified) {
        return tr.setMeta('addToHistory', false);
      }

      return;
    }
  });
}