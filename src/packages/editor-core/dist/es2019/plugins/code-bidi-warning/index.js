import { createPlugin } from './pm-plugins/main';

const codeBidiWarning = ({
  appearance
}) => ({
  name: 'codeBidiWarning',

  pmPlugins() {
    return [{
      name: 'codeBidiWarning',
      plugin: options => {
        return createPlugin(options, {
          appearance
        });
      }
    }];
  }

});

export default codeBidiWarning;