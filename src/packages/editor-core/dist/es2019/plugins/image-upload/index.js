import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';

const imageUpload = () => ({
  name: 'imageUpload',

  pmPlugins() {
    return [{
      name: 'imageUpload',
      plugin: createPlugin
    }, {
      name: 'imageUploadInputRule',
      plugin: ({
        schema,
        featureFlags
      }) => inputRulePlugin(schema, featureFlags)
    }];
  }

});

export default imageUpload;