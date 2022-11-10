import React from 'react';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { cardKeymap } from './pm-plugins/keymap';

const cardPlugin = options => {
  return {
    name: 'card',

    nodes() {
      const nodes = [{
        name: 'inlineCard',
        node: inlineCard
      }, {
        name: 'blockCard',
        node: blockCard
      }];

      if (options.allowEmbeds) {
        nodes.push({
          name: 'embedCard',
          node: embedCard
        });
      }

      return nodes;
    },

    pmPlugins() {
      var _options$allowBlockCa, _options$allowResizin, _options$useAlternati;

      const allowBlockCards = (_options$allowBlockCa = options.allowBlockCards) !== null && _options$allowBlockCa !== void 0 ? _options$allowBlockCa : true;
      const allowResizing = (_options$allowResizin = options.allowResizing) !== null && _options$allowResizin !== void 0 ? _options$allowResizin : true;
      const useAlternativePreloader = (_options$useAlternati = options.useAlternativePreloader) !== null && _options$useAlternati !== void 0 ? _options$useAlternati : true;
      const plugins = [{
        name: 'card',
        plugin: createPlugin({ ...options,
          allowBlockCards,
          allowResizing,
          useAlternativePreloader
        })
      }];
      plugins.push({
        name: 'cardKeymap',
        plugin: ({
          featureFlags
        }) => {
          return cardKeymap(featureFlags);
        }
      });
      return plugins;
    },

    contentComponent({
      editorView
    }) {
      return /*#__PURE__*/React.createElement(EditorSmartCardEvents, {
        editorView: editorView
      });
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(options, options.platform, options.linkPicker)
    }
  };
};

export default cardPlugin;