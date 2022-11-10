import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { cardKeymap } from './pm-plugins/keymap';

var cardPlugin = function cardPlugin(options) {
  return {
    name: 'card',
    nodes: function nodes() {
      var nodes = [{
        name: 'inlineCard',
        node: inlineCard
      }, {
        name: 'blockCard',
        node: blockCard
      }];

      if (options.allowEmbeds) {
        nodes.push({
          name: 'embedCard',
          node: embedCard
        });
      }

      return nodes;
    },
    pmPlugins: function pmPlugins() {
      var _options$allowBlockCa, _options$allowResizin, _options$useAlternati;

      var allowBlockCards = (_options$allowBlockCa = options.allowBlockCards) !== null && _options$allowBlockCa !== void 0 ? _options$allowBlockCa : true;
      var allowResizing = (_options$allowResizin = options.allowResizing) !== null && _options$allowResizin !== void 0 ? _options$allowResizin : true;
      var useAlternativePreloader = (_options$useAlternati = options.useAlternativePreloader) !== null && _options$useAlternati !== void 0 ? _options$useAlternati : true;
      var plugins = [{
        name: 'card',
        plugin: createPlugin(_objectSpread(_objectSpread({}, options), {}, {
          allowBlockCards: allowBlockCards,
          allowResizing: allowResizing,
          useAlternativePreloader: useAlternativePreloader
        }))
      }];
      plugins.push({
        name: 'cardKeymap',
        plugin: function plugin(_ref) {
          var featureFlags = _ref.featureFlags;
          return cardKeymap(featureFlags);
        }
      });
      return plugins;
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView;
      return /*#__PURE__*/React.createElement(EditorSmartCardEvents, {
        editorView: editorView
      });
    },
    pluginsOptions: {
      floatingToolbar: floatingToolbar(options, options.platform, options.linkPicker)
    }
  };
};

export default cardPlugin;