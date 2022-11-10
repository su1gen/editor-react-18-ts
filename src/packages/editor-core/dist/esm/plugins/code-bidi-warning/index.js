import { createPlugin } from './pm-plugins/main';

var codeBidiWarning = function codeBidiWarning(_ref) {
  var appearance = _ref.appearance;
  return {
    name: 'codeBidiWarning',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'codeBidiWarning',
        plugin: function plugin(options) {
          return createPlugin(options, {
            appearance: appearance
          });
        }
      }];
    }
  };
};

export default codeBidiWarning;