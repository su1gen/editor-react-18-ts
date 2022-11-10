import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';

var imageUpload = function imageUpload() {
  return {
    name: 'imageUpload',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'imageUpload',
        plugin: createPlugin
      }, {
        name: 'imageUploadInputRule',
        plugin: function plugin(_ref) {
          var schema = _ref.schema,
              featureFlags = _ref.featureFlags;
          return inputRulePlugin(schema, featureFlags);
        }
      }];
    }
  };
};

export default imageUpload;