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

var annotationPlugin = function annotationPlugin(annotationProviders) {
  return {
    name: 'annotation',
    marks: function marks() {
      return [{
        name: 'annotation',
        mark: annotation
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'annotation',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              portalProviderAPI = _ref.portalProviderAPI,
              eventDispatcher = _ref.eventDispatcher;

          if (annotationProviders) {
            return inlineCommentPlugin({
              dispatch: dispatch,
              portalProviderAPI: portalProviderAPI,
              eventDispatcher: eventDispatcher,
              provider: annotationProviders.inlineComment
            });
          }

          return;
        }
      }, {
        name: 'annotationKeymap',
        plugin: function plugin() {
          if (annotationProviders) {
            return keymapPlugin();
          }

          return;
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: function floatingToolbar(state, intl) {
        if (!annotationProviders) {
          return;
        }

        var pluginState = getPluginState(state);

        if (pluginState && pluginState.isVisible && !pluginState.bookmark && !pluginState.mouseData.isSelecting) {
          var isToolbarAbove = annotationProviders.inlineComment.isToolbarAbove;
          return buildToolbar(state, intl, isToolbarAbove);
        }
      }
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent;

      if (!annotationProviders) {
        return null;
      }

      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          selectionState: reactPluginKey,
          inlineCommentState: inlineCommentPluginKey
        },
        render: function render(_ref3) {
          var inlineCommentState = _ref3.inlineCommentState;

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