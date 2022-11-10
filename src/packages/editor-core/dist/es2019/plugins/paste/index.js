import { createPlugin } from './pm-plugins/main';

const pastePlugin = ({
  cardOptions,
  sanitizePrivateContent,
  plainTextPasteLinkification
}) => ({
  name: 'paste',

  pmPlugins() {
    return [{
      name: 'paste',
      plugin: ({
        schema,
        providerFactory,
        dispatchAnalyticsEvent,
        dispatch
      }) => createPlugin(schema, dispatchAnalyticsEvent, dispatch, plainTextPasteLinkification, cardOptions, sanitizePrivateContent, providerFactory)
    }];
  }

});

export default pastePlugin;