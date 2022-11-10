import { indentation } from '@atlaskit/adf-schema';
import { keymapPlugin } from './pm-plugins/keymap';

var indentationPlugin = function indentationPlugin() {
  return {
    name: 'indentation',
    marks: function marks() {
      return [{
        name: 'indentation',
        mark: indentation
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'indentationKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    }
  };
};

export default indentationPlugin;