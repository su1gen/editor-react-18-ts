"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelAttrsToDom = exports.findPanel = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorUtils = require("prosemirror-utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _panel = require("@atlaskit/editor-common/panel");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var findPanel = function findPanel(state, selection) {
  var panel = state.schema.nodes.panel;
  return (0, _prosemirrorUtils.findSelectedNodeOfType)(panel)(selection || state.selection) || (0, _prosemirrorUtils.findParentNodeOfType)(panel)(selection || state.selection);
};

exports.findPanel = findPanel;

var panelAttrsToDom = function panelAttrsToDom(attrs, allowCustomPanel) {
  var panelColor = attrs.panelColor,
      panelType = attrs.panelType,
      panelIcon = attrs.panelIcon,
      panelIconId = attrs.panelIconId,
      panelIconText = attrs.panelIconText;
  var isCustomPanel = panelType === _adfSchema.PanelType.CUSTOM && allowCustomPanel;
  var hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;
  var style = ["".concat(panelColor && isCustomPanel ? "background-color: ".concat(panelColor, ";") : ''), "".concat(hasIcon ? '' : 'padding: 12px;')].join('');
  var panelAttrs = {
    class: _panel.PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || _adfSchema.PanelType.INFO,
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
    class: _panel.PanelSharedCssClassName.icon
  }];
  var contentDiv = ['div', {
    class: _panel.PanelSharedCssClassName.content
  }, 0];

  if (hasIcon) {
    return ['div', panelAttrs, iconDiv, contentDiv];
  } else {
    return ['div', panelAttrs, contentDiv];
  }
};

exports.panelAttrsToDom = panelAttrsToDom;