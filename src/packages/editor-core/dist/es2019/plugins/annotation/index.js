import React from 'react';
import { annotation } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';
import { keymapPlugin } from './pm-plugins/keymap';
import { inlineCommentPlugin } from './pm-plugins/inline-comment';
import { AnnotationUpdateEmitter } from './update-provider';
import { getPluginState, inlineCommentPluginKey } from './utils';
import { buildToolbar } from './toolbar';
import { InlineCommentView } from './ui/InlineCommentView';

const annotationPlugin = annotationProviders => {
  return {
    name: 'annotation',

    marks() {
      return [{
        name: 'annotation',
        mark: annotation
      }];
    },

    pmPlugins: () => [{
      name: 'annotation',
      plugin: ({
        dispatch,
        portalProviderAPI,
        eventDispatcher
      }) => {
        if (annotationProviders) {
          return inlineCommentPlugin({
            dispatch,
            portalProviderAPI,
            eventDispatcher,
            provider: annotationProviders.inlineComment
          });
        }

        return;
      }
    }, {
      name: 'annotationKeymap',
      plugin: () => {
        if (annotationProviders) {
          return keymapPlugin();
        }

        return;
      }
    }],
    pluginsOptions: {
      floatingToolbar(state, intl) {
        if (!annotationProviders) {
          return;
        }

        const pluginState = getPluginState(state);

        if (pluginState && pluginState.isVisible && !pluginState.bookmark && !pluginState.mouseData.isSelecting) {
          const {
            isToolbarAbove
          } = annotationProviders.inlineComment;
          return buildToolbar(state, intl, isToolbarAbove);
        }
      }

    },

    contentComponent({
      editorView,
      dispatchAnalyticsEvent
    }) {
      if (!annotationProviders) {
        return null;
      }

      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          selectionState: reactPluginKey,
          inlineCommentState: inlineCommentPluginKey
        },
        render: ({
          inlineCommentState
        }) => {
          if (inlineCommentState && !inlineCommentState.isVisible) {
            return null;
          }

          return /*#__PURE__*/React.createElement(InlineCommentView, {
            providers: annotationProviders,
            editorView: editorView,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          });
        }
      });
    }

  };
};

export default annotationPlugin;
export { AnnotationUpdateEmitter };