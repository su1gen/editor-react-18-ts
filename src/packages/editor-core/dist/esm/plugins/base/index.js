import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { browser } from '@atlaskit/editor-common/utils';
import { doc, paragraph, text } from '@atlaskit/adf-schema';
import filterStepsPlugin from './pm-plugins/filter-steps';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import fixChrome88SelectionPlugin from './pm-plugins/fix-chrome-88-selection';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import contextIdentifierPlugin from './pm-plugins/context-identifier';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import betterTypeHistoryPlugin from './pm-plugins/better-type-history';
import { plugin as reactNodeView } from './pm-plugins/react-nodeview';
import decorationPlugin from './pm-plugins/decoration';
import scrollGutter from './pm-plugins/scroll-gutter';
import { keymap } from '../../utils/keymap';
import frozenEditor from './pm-plugins/frozen-editor';
import compositionPlugin from './pm-plugins/composition';
// Chrome >= 88
export var isChromeWithSelectionBug = browser.chrome && browser.chrome_version >= 88;

var basePlugin = function basePlugin(options) {
  return {
    name: 'base',
    pmPlugins: function pmPlugins() {
      var plugins = [{
        name: 'filterStepsPlugin',
        plugin: function plugin(_ref) {
          var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
          return filterStepsPlugin(dispatchAnalyticsEvent);
        }
      }]; // In Chrome, when the selection is placed between adjacent nodes which are not contenteditatble
      // the cursor appears at the right most point of the parent container.
      // In Firefox, when the selection is placed between adjacent nodes which are not contenteditatble
      // no cursor is presented to users.
      // In Safari, when the selection is placed between adjacent nodes which are not contenteditatble
      // it is not possible to navigate with arrow keys.
      // This plugin works around the issues by inserting decorations between
      // inline nodes which are set as contenteditable, and have a zero width space.

      plugins.push({
        name: 'inlineCursorTargetPlugin',
        plugin: function plugin() {
          return options && options.allowInlineCursorTarget ? inlineCursorTargetPlugin() : undefined;
        }
      });
      plugins.push({
        name: 'focusHandlerPlugin',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return focusHandlerPlugin(dispatch);
        }
      }, {
        name: 'newlinePreserveMarksPlugin',
        plugin: newlinePreserveMarksPlugin
      }, {
        name: 'reactNodeView',
        plugin: function plugin() {
          return reactNodeView;
        }
      }, {
        name: 'frozenEditor',
        plugin: function plugin(_ref3) {
          var _options$inputTrackin;

          var dispatchAnalyticsEvent = _ref3.dispatchAnalyticsEvent;
          return options !== null && options !== void 0 && (_options$inputTrackin = options.inputTracking) !== null && _options$inputTrackin !== void 0 && _options$inputTrackin.enabled || options !== null && options !== void 0 && options.ufo ? frozenEditor(dispatchAnalyticsEvent, options.inputTracking, options.browserFreezeTracking, options.ufo) : undefined;
        }
      }, {
        name: 'decorationPlugin',
        plugin: function plugin() {
          return decorationPlugin();
        }
      }, {
        name: 'history',
        plugin: function plugin() {
          return history();
        }
      }, // should be last :(
      {
        name: 'codeBlockIndent',
        plugin: function plugin() {
          return keymap(_objectSpread(_objectSpread({}, baseKeymap), {}, {
            'Mod-[': function Mod() {
              return true;
            },
            'Mod-]': function Mod() {
              return true;
            }
          }));
        }
      }, {
        name: 'contextIdentifier',
        plugin: function plugin(_ref4) {
          var dispatch = _ref4.dispatch,
              providerFactory = _ref4.providerFactory;
          return contextIdentifierPlugin(dispatch, providerFactory);
        }
      }, {
        name: 'betterTypeHistory',
        plugin: function plugin(_ref5) {
          var dispatch = _ref5.dispatch,
              providerFactory = _ref5.providerFactory;
          return betterTypeHistoryPlugin();
        }
      });

      if (options && options.allowScrollGutter) {
        plugins.push({
          name: 'scrollGutterPlugin',
          plugin: function plugin() {
            return scrollGutter(options.allowScrollGutter);
          }
        });
      }

      if (isChromeWithSelectionBug) {
        plugins.push({
          name: 'fixChrome88SelectionPlugin',
          plugin: function plugin() {
            return fixChrome88SelectionPlugin();
          }
        });
      }

      plugins.push({
        name: 'disableSpellcheckingPlugin',
        plugin: function plugin() {
          return disableSpellcheckingPlugin();
        }
      });
      plugins.push({
        name: 'compositionPlugin',
        plugin: function plugin() {
          return compositionPlugin();
        }
      });
      return plugins;
    },
    nodes: function nodes() {
      return [{
        name: 'doc',
        node: doc
      }, {
        name: 'paragraph',
        node: paragraph
      }, {
        name: 'text',
        node: text
      }];
    }
  };
};

export default basePlugin;