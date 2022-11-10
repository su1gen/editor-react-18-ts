import React from 'react';
import { panel, PanelType } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import keymap from './pm-plugins/keymaps';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD, EVENT_TYPE } from '../analytics';
import { IconPanel, IconPanelNote, IconPanelSuccess, IconPanelWarning, IconPanelError } from '../quick-insert/assets';
import { messages } from '../block-type/messages';
import IconCustomPanel from '../quick-insert/assets/custom-panel';
import { T50 } from '@atlaskit/theme/colors';

var insertPanelTypeWithAnalytics = function insertPanelTypeWithAnalytics(panelAttributes, state, insert) {
  var tr = insert(insertPanelType(panelAttributes, state));

  if (tr) {
    addAnalytics(state, tr, {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.PANEL,
      attributes: {
        inputMethod: INPUT_METHOD.QUICK_INSERT,
        panelType: panelAttributes.panelType
      },
      eventType: EVENT_TYPE.TRACK
    });
  }

  return tr;
};

var insertPanelType = function insertPanelType(panelAttributes, state) {
  return state.schema.nodes.panel.createChecked(panelAttributes, state.schema.nodes.paragraph.createChecked());
};

var panelPlugin = function panelPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'panel',
    nodes: function nodes() {
      var panelNode = panel(!!options.allowCustomPanel);
      return [{
        name: 'panel',
        node: panelNode
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'panel',
        plugin: function plugin(_ref) {
          var providerFactory = _ref.providerFactory,
              dispatch = _ref.dispatch;
          return createPlugin(dispatch, providerFactory, options);
        }
      }, {
        name: 'panelKeyMap',
        plugin: function plugin() {
          return keymap();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        var quickInsertOptions = [{
          id: 'infopanel',
          title: formatMessage(messages.infoPanel),
          keywords: ['panel'],
          description: formatMessage(messages.infoPanelDescription),
          priority: 800,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconPanel, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: PanelType.INFO
            }, state, insert);
          }
        }, {
          id: 'notepanel',
          title: formatMessage(messages.notePanel),
          description: formatMessage(messages.notePanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconPanelNote, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: PanelType.NOTE
            }, state, insert);
          }
        }, {
          id: 'successpanel',
          title: formatMessage(messages.successPanel),
          description: formatMessage(messages.successPanelDescription),
          keywords: ['tip'],
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconPanelSuccess, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: PanelType.SUCCESS
            }, state, insert);
          }
        }, {
          id: 'warningpanel',
          title: formatMessage(messages.warningPanel),
          description: formatMessage(messages.warningPanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconPanelWarning, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: PanelType.WARNING
            }, state, insert);
          }
        }, {
          id: 'errorpanel',
          title: formatMessage(messages.errorPanel),
          description: formatMessage(messages.errorPanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconPanelError, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: PanelType.ERROR
            }, state, insert);
          }
        }];

        if (options.allowCustomPanel && options.allowCustomPanelEdit) {
          quickInsertOptions.push({
            id: 'custompanel',
            title: formatMessage(messages.customPanel),
            description: formatMessage(messages.customPanelDescription),
            priority: 1000,
            icon: function icon() {
              return /*#__PURE__*/React.createElement(IconCustomPanel, null);
            },
            action: function action(insert, state) {
              return insertPanelTypeWithAnalytics({
                panelType: PanelType.CUSTOM,
                panelIcon: ':rainbow:',
                panelIconId: '1f308',
                panelIconText: '🌈',
                // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
                panelColor: T50
              }, state, insert);
            }
          });
        }

        return quickInsertOptions;
      },
      floatingToolbar: function floatingToolbar(state, intl, providerFactory) {
        return getToolbarConfig(state, intl, options, providerFactory);
      }
    }
  };
};

export default panelPlugin;