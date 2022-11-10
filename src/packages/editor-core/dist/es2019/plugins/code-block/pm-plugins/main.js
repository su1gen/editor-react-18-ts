import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { NodeSelection } from 'prosemirror-state';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { createSelectionClickHandler } from '../../selection/utils';
import { pluginKey } from '../plugin-key';
import { ACTIONS } from './actions';
import { ignoreFollowingMutations, resetShouldIgnoreFollowingMutations } from '../actions';
import { findCodeBlock } from '../utils';
import { codeBlockClassNames } from '../ui/class-names';
export const createPlugin = ({
  useLongPressSelection = false,
  getIntl,
  appearance,
  allowCompositionInputOverride = false
}) => {
  const handleDOMEvents = {}; // ME-1599: Composition on mobile was causing the DOM observer to mutate the code block
  // incorrecly and lose content when pressing enter in the middle of a code block line.

  if (allowCompositionInputOverride) {
    handleDOMEvents.beforeinput = (view, event) => {
      const keyEvent = event;
      const eventInputType = keyEvent.inputType;
      const eventText = keyEvent.data;

      if (browser.ios && event.composed && // insertParagraph will be the input type when the enter key is pressed.
      eventInputType === 'insertParagraph' && findCodeBlock(view.state, view.state.selection)) {
        event.preventDefault();
        return true;
      } else if (browser.android && event.composed && eventInputType === 'insertCompositionText' && eventText[(eventText === null || eventText === void 0 ? void 0 : eventText.length) - 1] === '\n' && findCodeBlock(view.state, view.state.selection)) {
        const resultingText = event.target.outerText + '\n';

        if (resultingText.endsWith(eventText)) {
          // End of paragraph
          setTimeout(() => {
            view.someProp('handleKeyDown', f => f(view, new KeyboardEvent('keydown', {
              bubbles: true,
              cancelable: true,
              key: 'Enter',
              code: 'Enter'
            })));
          }, 0);
        } else {
          // Middle of paragraph, end of line
          ignoreFollowingMutations(view.state, view.dispatch);
        }

        return true;
      }

      if (browser.android) {
        resetShouldIgnoreFollowingMutations(view.state, view.dispatch);
      }

      return false;
    };
  }

  return new SafePlugin({
    state: {
      init(_, state) {
        const node = findCodeBlock(state, state.selection);
        return {
          pos: node ? node.pos : null,
          contentCopied: false,
          isNodeSelected: false,
          shouldIgnoreFollowingMutations: false
        };
      },

      apply(tr, pluginState, _oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          const node = findCodeBlock(newState, tr.selection);
          const newPluginState = { ...pluginState,
            pos: node ? node.pos : null,
            isNodeSelected: tr.selection instanceof NodeSelection
          };
          return newPluginState;
        }

        const meta = tr.getMeta(pluginKey);

        if ((meta === null || meta === void 0 ? void 0 : meta.type) === ACTIONS.SET_COPIED_TO_CLIPBOARD) {
          return { ...pluginState,
            contentCopied: meta.data
          };
        } else if ((meta === null || meta === void 0 ? void 0 : meta.type) === ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS) {
          return { ...pluginState,
            shouldIgnoreFollowingMutations: meta.data
          };
        }

        return pluginState;
      }

    },
    key: pluginKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView
      },
      handleClickOn: createSelectionClickHandler(['codeBlock'], target => !!(target.closest(`.${codeBlockClassNames.gutter}`) || target.classList.contains(codeBlockClassNames.content)), {
        useLongPressSelection
      }),
      handleDOMEvents
    }
  });
};