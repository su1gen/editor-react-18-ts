"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelIcons = exports.getPanelNodeView = exports.PanelIcon = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _prosemirrorModel = require("prosemirror-model");

var _hint = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/hint"));

var _adfSchema = require("@atlaskit/adf-schema");

var _panel = require("@atlaskit/editor-common/panel");

var _emoji = require("@atlaskit/editor-common/emoji");

var _utils = require("../utils");

var _consts = require("@atlaskit/editor-shared-styles/consts");

var _icons = require("@atlaskit/editor-common/icons");

var panelIcons = {
  info: _icons.PanelInfoIcon,
  success: _icons.PanelSuccessIcon,
  note: _icons.PanelNoteIcon,
  tip: _hint.default,
  warning: _icons.PanelWarningIcon,
  error: _icons.PanelErrorIcon,
  custom: _icons.PanelInfoIcon
};
exports.panelIcons = panelIcons;

var PanelIcon = function PanelIcon(props) {
  var allowCustomPanel = props.allowCustomPanel,
      providerFactory = props.providerFactory,
      _props$panelAttribute = props.panelAttributes,
      panelType = _props$panelAttribute.panelType,
      panelIcon = _props$panelAttribute.panelIcon,
      panelIconId = _props$panelAttribute.panelIconId,
      panelIconText = _props$panelAttribute.panelIconText;

  if (allowCustomPanel && panelIcon && panelType === _adfSchema.PanelType.CUSTOM) {
    return /*#__PURE__*/_react.default.createElement(_emoji.Emoji, {
      providers: providerFactory,
      shortName: panelIcon,
      id: panelIconId,
      fallback: panelIconText,
      showTooltip: false,
      allowTextFallback: false,
      fitToHeight: _consts.akEditorCustomIconSize
    });
  }

  var Icon = panelIcons[panelType];
  return /*#__PURE__*/_react.default.createElement(Icon, {
    label: "Panel ".concat(panelType)
  });
};

exports.PanelIcon = PanelIcon;

var PanelNodeView = /*#__PURE__*/function () {
  function PanelNodeView(node, view, getPos, pluginOptions, providerFactory) {
    (0, _classCallCheck2.default)(this, PanelNodeView);
    this.providerFactory = providerFactory;
    this.pluginOptions = pluginOptions;
    this.view = view;
    this.node = node;

    var _DOMSerializer$render = _prosemirrorModel.DOMSerializer.renderSpec(document, (0, _utils.panelAttrsToDom)(node.attrs, pluginOptions.allowCustomPanel || false)),
        dom = _DOMSerializer$render.dom,
        contentDOM = _DOMSerializer$render.contentDOM;

    this.getPos = getPos;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.icon = this.dom.querySelector(".".concat(_panel.PanelSharedCssClassName.icon));

    if (!this.icon) {
      return;
    } // set contentEditable as false to be able to select the custom panels with keyboard


    this.icon.contentEditable = 'false';

    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(PanelIcon, {
      allowCustomPanel: pluginOptions.allowCustomPanel,
      panelAttributes: node.attrs,
      providerFactory: this.providerFactory
    }), this.icon);
  }

  (0, _createClass2.default)(PanelNodeView, [{
    key: "ignoreMutation",
    value: function ignoreMutation(mutation) {
      // ignore mutation if it caused by the icon.
      var isIcon = mutation.target === this.icon || mutation.target.parentNode === this.icon; // ignore mutation if it caused by the lazy load emoji inside icon.

      var isInsideIcon = this.icon.contains(mutation.target);
      return isIcon || isInsideIcon;
    }
  }]);
  return PanelNodeView;
}();

var getPanelNodeView = function getPanelNodeView(pluginOptions, providerFactory) {
  return function (node, view, getPos) {
    return new PanelNodeView(node, view, getPos, pluginOptions, providerFactory);
  };
};

exports.getPanelNodeView = getPanelNodeView;