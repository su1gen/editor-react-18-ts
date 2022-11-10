import createPlugin from './pm-plugins/main';

const copyButtonPlugin = () => ({
  name: 'copyButton',

  pmPlugins() {
    return [{
      name: 'copyButton',
      plugin: () => createPlugin()
    }];
  }

});

export default copyButtonPlugin;