import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import Loadable from 'react-loadable';
import { date } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { insertDate, closeDatePicker as _closeDatePicker, closeDatePickerWithAnalytics as _closeDatePickerWithAnalytics, createDate, deleteDate } from './actions';
import createDatePlugin from './pm-plugins/main';
import keymap from './pm-plugins/keymap';
import { getFeatureFlags } from '../feature-flags-context';
import { pluginKey as editorDisabledPluginKey } from '../editor-disabled';
import { IconDate } from '../quick-insert/assets';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { pluginKey as datePluginKey } from './pm-plugins/plugin-key';
var DatePicker = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-datepicker" */
    './ui/DatePicker').then(function (mod) {
      return mod.default;
    });
  },
  loading: function loading() {
    return null;
  }
});

var datePlugin = function datePlugin() {
  return {
    name: 'date',
    nodes: function nodes() {
      return [{
        name: 'date',
        node: date
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'date',
        plugin: function plugin(options) {
          DatePicker.preload();
          return createDatePlugin(options);
        }
      }, {
        name: 'dateKeymap',
        plugin: function plugin() {
          DatePicker.preload();
          return keymap();
        }
      }];
    },
    contentComponent: function contentComponent(_ref) {
      var editorView = _ref.editorView,
          dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
          popupsMountPoint = _ref.popupsMountPoint,
          popupsBoundariesElement = _ref.popupsBoundariesElement,
          popupsScrollableElement = _ref.popupsScrollableElement;
      var state = editorView.state,
          dispatch = editorView.dispatch;
      var domAtPos = editorView.domAtPos.bind(editorView);
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          datePlugin: datePluginKey,
          editorDisabledPlugin: editorDisabledPluginKey
        },
        render: function render(_ref2) {
          var editorDisabledPlugin = _ref2.editorDisabledPlugin,
              datePlugin = _ref2.datePlugin;

          if (!(datePlugin !== null && datePlugin !== void 0 && datePlugin.showDatePickerAt) || editorDisabledPlugin !== null && editorDisabledPlugin !== void 0 && editorDisabledPlugin.editorDisabled) {
            return null;
          }

          var showDatePickerAt = datePlugin.showDatePickerAt,
              isNew = datePlugin.isNew,
              focusDateInput = datePlugin.focusDateInput;
          var element = findDomRefAtPos(showDatePickerAt, domAtPos);
          var allFlags = getFeatureFlags(state);
          var keyboardAccessibleDatepicker = allFlags.keyboardAccessibleDatepicker;
          return /*#__PURE__*/React.createElement(DatePicker, {
            mountTo: popupsMountPoint,
            boundariesElement: popupsBoundariesElement,
            scrollableElement: popupsScrollableElement,
            key: showDatePickerAt,
            showTextField: keyboardAccessibleDatepicker,
            element: element,
            isNew: isNew,
            autoFocus: focusDateInput,
            onDelete: function onDelete() {
              deleteDate()(editorView.state, dispatch);
              editorView.focus();
              return;
            },
            onSelect: function onSelect(date, commitMethod) {
              // Undefined means couldn't parse date, null means invalid (out of bounds) date
              if (date === undefined || date === null) {
                return;
              }

              insertDate(date, undefined, commitMethod)(editorView.state, dispatch);
              editorView.focus();
            },
            onTextChanged: function onTextChanged(date) {
              insertDate(date, undefined, undefined, false)(editorView.state, dispatch);
            },
            closeDatePicker: function closeDatePicker() {
              _closeDatePicker()(editorView.state, dispatch);

              editorView.focus();
            },
            closeDatePickerWithAnalytics: function closeDatePickerWithAnalytics(_ref3) {
              var date = _ref3.date;

              _closeDatePickerWithAnalytics({
                date: date
              })(editorView.state, dispatch);

              editorView.focus();
            },
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref4) {
        var formatMessage = _ref4.formatMessage;
        return [{
          id: 'date',
          title: formatMessage(messages.date),
          description: formatMessage(messages.dateDescription),
          priority: 800,
          keywords: ['calendar', 'day', 'time', 'today', '/'],
          keyshortcut: '//',
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconDate, null);
          },
          action: function action(insert, state) {
            var tr = createDate(true)(insert, state);
            addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.DATE,
              eventType: EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              }
            });
            return tr;
          }
        }];
      }
    }
  };
};

export default datePlugin;