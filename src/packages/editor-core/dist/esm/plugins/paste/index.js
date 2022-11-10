import { createPlugin } from './pm-plugins/main';

var pastePlugin = function pastePlugin(_ref) {
  var cardOptions = _ref.cardOptions,
      sanitizePrivateContent = _ref.sanitizePrivateContent,
      plainTextPasteLinkification = _ref.plainTextPasteLinkification;
  return {
    name: 'paste',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'paste',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              providerFactory = _ref2.providerFactory,
              dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent,
              dispatch = _ref2.dispatch;
          return createPlugin(schema, dispatchAnalyticsEvent, dispatch, plainTextPasteLinkification, cardOptions, sanitizePrivateContent, providerFactory);
        }
      }];
    }
  };
};

export default pastePlugin;