import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import React from 'react';
import ReactDOM from 'react-dom';
import { DOMSerializer } from 'prosemirror-model';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { Emoji } from '@atlaskit/editor-common/emoji';
import { panelAttrsToDom } from '../utils';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { PanelInfoIcon, PanelSuccessIcon, PanelNoteIcon, PanelWarningIcon, PanelErrorIcon } from '@atlaskit/editor-common/icons';
export var panelIcons = {
  info: PanelInfoIcon,
  success: PanelSuccessIcon,
  note: PanelNoteIcon,
  tip: TipIcon,
  warning: PanelWarningIcon,
  error: PanelErrorIcon,
  custom: PanelInfoIcon
};
export var PanelIcon = function PanelIcon(props) {
  var allowCustomPanel = props.allowCustomPanel,
      providerFactory = props.providerFactory,
      _props$panelAttribute = props.panelAttributes,
      panelType = _props$panelAttribute.panelType,
      panelIcon = _props$panelAttribute.panelIcon,
      panelIconId = _props$panelAttribute.panelIconId,
      panelIconText = _props$panelAttribute.panelIconText;

  if (allowCustomPanel && panelIcon && panelType === PanelType.CUSTOM) {
    return /*#__PURE__*/React.createElement(Emoji, {
      providers: providerFactory,
      shortName: panelIcon,
      id: panelIconId,
      fallback: panelIconText,
      showTooltip: false,
      allowTextFallback: false,
      fitToHeight: akEditorCustomIconSize
    });
  }

  var Icon = panelIcons[panelType];
  return /*#__PURE__*/React.createElement(Icon, {
    label: "Panel ".concat(panelType)
  });
};

var PanelNodeView = /*#__PURE__*/function () {
  function PanelNodeView(node, view, getPos, pluginOptions, providerFactory) {
    _classCallCheck(this, PanelNodeView);

    this.providerFactory = providerFactory;
    this.pluginOptions = pluginOptions;
    this.view = view;
    this.node = node;

    var _DOMSerializer$render = DOMSerializer.renderSpec(document, panelAttrsToDom(node.attrs, pluginOptions.allowCustomPanel || false)),
        dom = _DOMSerializer$render.dom,
        contentDOM = _DOMSerializer$render.contentDOM;

    this.getPos = getPos;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.icon = this.dom.querySelector(".".concat(PanelSharedCssClassName.icon));

    if (!this.icon) {
      return;
    } // set contentEditable as false to be able to select the custom panels with keyboard


    this.icon.contentEditable = 'false';
    ReactDOM.render( /*#__PURE__*/React.createElement(PanelIcon, {
      allowCustomPanel: pluginOptions.allowCustomPanel,
      panelAttributes: node.attrs,
      providerFactory: this.providerFactory
    }), this.icon);
  }

  _createClass(PanelNodeView, [{
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

export var getPanelNodeView = function getPanelNodeView(pluginOptions, providerFactory) {
  return function (node, view, getPos) {
    return new PanelNodeView(node, view, getPos, pluginOptions, providerFactory);
  };
};