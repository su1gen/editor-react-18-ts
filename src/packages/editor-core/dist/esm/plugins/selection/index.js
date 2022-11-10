import { createPlugin } from './pm-plugins/selection-main';
import selectionKeymapPlugin from './pm-plugins/keymap';
import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';
export var selectionPlugin = function selectionPlugin(options) {
  return {
    name: 'selection',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'selection',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
          return createPlugin(dispatch, dispatchAnalyticsEvent, options);
        }
      }, {
        name: 'selectionKeymap',
        plugin: selectionKeymapPlugin
      }, {
        name: 'gapCursorKeymap',
        plugin: function plugin() {
          return gapCursorKeymapPlugin();
        }
      }, {
        name: 'gapCursor',
        plugin: function plugin() {
          return gapCursorPlugin;
        }
      }];
    }
  };
};
export default selectionPlugin;