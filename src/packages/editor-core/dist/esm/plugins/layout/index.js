import React from 'react';
import { layoutColumn, layoutSection } from '@atlaskit/adf-schema';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { buildToolbar } from './toolbar';
import { createDefaultLayoutSection } from './actions';
import { IconLayout } from '../quick-insert/assets';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { pluginKey } from './pm-plugins/plugin-key';
export { pluginKey };

var layoutPlugin = function layoutPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'layout',
    nodes: function nodes() {
      return [{
        name: 'layoutSection',
        node: layoutSection
      }, {
        name: 'layoutColumn',
        node: layoutColumn
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'layout',
        plugin: function plugin() {
          return createLayoutPlugin(options);
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: function floatingToolbar(state, intl) {
        var _ref = pluginKey.getState(state),
            pos = _ref.pos,
            allowBreakout = _ref.allowBreakout,
            addSidebarLayouts = _ref.addSidebarLayouts,
            allowSingleColumnLayout = _ref.allowSingleColumnLayout;

        if (pos !== null) {
          return buildToolbar(state, intl, pos, allowBreakout, addSidebarLayouts, allowSingleColumnLayout);
        }

        return undefined;
      },
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'layout',
          title: formatMessage(messages.columns),
          description: formatMessage(messages.columnsDescription),
          keywords: ['column', 'section'],
          priority: 1100,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconLayout, null);
          },
          action: function action(insert, state) {
            var tr = insert(createDefaultLayoutSection(state));
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.TRACK
            });
          }
        }];
      }
    }
  };
};

export default layoutPlugin;