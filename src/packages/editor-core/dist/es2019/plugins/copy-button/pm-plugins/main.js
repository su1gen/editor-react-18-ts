import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DecorationSet } from 'prosemirror-view';
import { copyButtonPluginKey } from './plugin-key';

function getMarkSelectionDecorationStartAndEnd({
  markType,
  transaction
}) {
  const headHesolvedPos = transaction.selection.$head;
  const textNodeIndex = transaction.selection.$head.index();
  const textNode = headHesolvedPos.parent.maybeChild(textNodeIndex);
  let textNodeOffset = 0;
  headHesolvedPos.parent.forEach((_node, nodeOffset, index) => {
    if (index === textNodeIndex) {
      textNodeOffset = nodeOffset;
    }
  });
  const start = headHesolvedPos.start(headHesolvedPos.depth) + textNodeOffset;
  const end = start + textNode.text.length;
  return {
    start,
    end,
    markType
  };
}

export function copyButtonPlugin() {
  return new SafePlugin({
    key: copyButtonPluginKey,
    state: {
      init() {
        return {
          copied: false,
          markSelection: undefined
        };
      },

      apply(tr, currentPluginState) {
        const meta = tr.getMeta(copyButtonPluginKey);

        if ((meta === null || meta === void 0 ? void 0 : meta.copied) !== undefined) {
          return {
            copied: meta.copied,
            markSelection: undefined
          };
        }

        if (meta !== null && meta !== void 0 && meta.showSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: getMarkSelectionDecorationStartAndEnd({
              markType: meta.markType,
              transaction: tr
            })
          };
        }

        if (meta !== null && meta !== void 0 && meta.removeSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: undefined
          };
        }

        if (currentPluginState.markSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: getMarkSelectionDecorationStartAndEnd({
              markType: currentPluginState.markSelection.markType,
              transaction: tr
            })
          };
        }

        return currentPluginState;
      }

    },
    props: {
      decorations(_state) {
        // Showing visual hints for the hyperlink copy button has been disabled
        // due to an issue where invalid hyperlink marks cause the floating toolbar
        // to jump around when the copy button is hovered.
        // See the following bug for details -- once that is resolved -- the visual
        // hints can be re enabled.
        // https://product-fabric.atlassian.net/browse/DTR-722
        // const copyButtonPluginState = copyButtonPluginKey.getState(
        //   state,
        // ) as CopyButtonPluginState;
        // if (copyButtonPluginState.markSelection) {
        //   const { start, end } = copyButtonPluginState.markSelection;
        //   return DecorationSet.create(state.doc, [
        //     Decoration.inline(start, end, {
        //       class: 'ProseMirror-fake-text-selection',
        //     }),
        //   ]);
        // }
        return DecorationSet.empty;
      }

    }
  });
}
export default copyButtonPlugin;