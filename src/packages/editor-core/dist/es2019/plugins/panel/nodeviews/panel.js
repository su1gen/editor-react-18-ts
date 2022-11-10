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
export const panelIcons = {
  info: PanelInfoIcon,
  success: PanelSuccessIcon,
  note: PanelNoteIcon,
  tip: TipIcon,
  warning: PanelWarningIcon,
  error: PanelErrorIcon,
  custom: PanelInfoIcon
};
export const PanelIcon = props => {
  const {
    allowCustomPanel,
    providerFactory,
    panelAttributes: {
      panelType,
      panelIcon,
      panelIconId,
      panelIconText
    }
  } = props;

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

  const Icon = panelIcons[panelType];
  return /*#__PURE__*/React.createElement(Icon, {
    label: `Panel ${panelType}`
  });
};

class PanelNodeView {
  constructor(node, view, getPos, pluginOptions, providerFactory) {
    this.providerFactory = providerFactory;
    this.pluginOptions = pluginOptions;
    this.view = view;
    this.node = node;
    const {
      dom,
      contentDOM
    } = DOMSerializer.renderSpec(document, panelAttrsToDom(node.attrs, pluginOptions.allowCustomPanel || false));
    this.getPos = getPos;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.icon = this.dom.querySelector(`.${PanelSharedCssClassName.icon}`);

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

  ignoreMutation(mutation) {
    // ignore mutation if it caused by the icon.
    const isIcon = mutation.target === this.icon || mutation.target.parentNode === this.icon; // ignore mutation if it caused by the lazy load emoji inside icon.

    const isInsideIcon = this.icon.contains(mutation.target);
    return isIcon || isInsideIcon;
  }

}

export const getPanelNodeView = (pluginOptions, providerFactory) => (node, view, getPos) => {
  return new PanelNodeView(node, view, getPos, pluginOptions, providerFactory);
};