import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { reducer } from '../reducer';
export const pluginKey = new PluginKey('pastePlugin');
export const {
  createPluginState,
  createCommand,
  getPluginState
} = pluginFactory(pluginKey, reducer, {
  mapping: (tr, pluginState) => {
    if (tr.docChanged) {
      let atLeastOnePositionChanged = false;
      const positionsMappedThroughChanges = Object.entries(pluginState.pastedMacroPositions).reduce((acc, [key, position]) => {
        const mappedPosition = tr.mapping.map(position);

        if (position !== mappedPosition) {
          atLeastOnePositionChanged = true;
        }

        acc[key] = tr.mapping.map(position);
        return acc;
      }, {});

      if (atLeastOnePositionChanged) {
        return { ...pluginState,
          pastedMacroPositions: positionsMappedThroughChanges
        };
      }
    }

    return pluginState;
  }
});