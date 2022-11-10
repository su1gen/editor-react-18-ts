import { createPlugin } from './pm-plugins/main';

var clipboard = function clipboard() {
  return {
    name: 'clipboard',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'clipboard',
        plugin: function plugin(options) {
          return createPlugin(options);
        }
      }];
    }
  };
};

export default clipboard;