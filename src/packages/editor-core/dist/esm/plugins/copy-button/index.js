import createPlugin from './pm-plugins/main';

var copyButtonPlugin = function copyButtonPlugin() {
  return {
    name: 'copyButton',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'copyButton',
        plugin: function plugin() {
          return createPlugin();
        }
      }];
    }
  };
};

export default copyButtonPlugin;