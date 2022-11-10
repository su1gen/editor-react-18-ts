import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { findSelectedNodeOfType, findParentNodeOfType } from 'prosemirror-utils';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
export var findPanel = function findPanel(state, selection) {
  var panel = state.schema.nodes.panel;
  return findSelectedNodeOfType(panel)(selection || state.selection) || findParentNodeOfType(panel)(selection || state.selection);
};
export var panelAttrsToDom = function panelAttrsToDom(attrs, allowCustomPanel) {
  var panelColor = attrs.panelColor,
      panelType = attrs.panelType,
      panelIcon = attrs.panelIcon,
      panelIconId = attrs.panelIconId,
      panelIconText = attrs.panelIconText;
  var isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;
  var hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;
  var style = ["".concat(panelColor && isCustomPanel ? "background-color: ".concat(panelColor, ";") : ''), "".concat(hasIcon ? '' : 'padding: 12px;')].join('');
  var panelAttrs = {
    class: PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || PanelType.INFO,
    style: style
  };

  if (panelColor && isCustomPanel) {
    panelAttrs = _objectSpread(_objectSpread({}, panelAttrs), {}, {
      'data-panel-color': panelColor,
      'data-panel-icon-id': panelIconId,
      'data-panel-icon-text': panelIconText
    });
  }

  var iconDiv = ['div', {
    class: PanelSharedCssClassName.icon
  }];
  var contentDiv = ['div', {
    class: PanelSharedCssClassName.content
  }, 0];

  if (hasIcon) {
    return ['div', panelAttrs, iconDiv, contentDiv];
  } else {
    return ['div', panelAttrs, contentDiv];
  }
};