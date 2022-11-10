import { findSelectedNodeOfType, findParentNodeOfType } from 'prosemirror-utils';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
export const findPanel = (state, selection) => {
  const {
    panel
  } = state.schema.nodes;
  return findSelectedNodeOfType(panel)(selection || state.selection) || findParentNodeOfType(panel)(selection || state.selection);
};
export const panelAttrsToDom = (attrs, allowCustomPanel) => {
  const {
    panelColor,
    panelType,
    panelIcon,
    panelIconId,
    panelIconText
  } = attrs;
  const isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;
  const hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;
  const style = [`${panelColor && isCustomPanel ? `background-color: ${panelColor};` : ''}`, `${hasIcon ? '' : 'padding: 12px;'}`].join('');
  let panelAttrs = {
    class: PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || PanelType.INFO,
    style
  };

  if (panelColor && isCustomPanel) {
    panelAttrs = { ...panelAttrs,
      'data-panel-color': panelColor,
      'data-panel-icon-id': panelIconId,
      'data-panel-icon-text': panelIconText
    };
  }

  const iconDiv = ['div', {
    class: PanelSharedCssClassName.icon
  }];
  const contentDiv = ['div', {
    class: PanelSharedCssClassName.content
  }, 0];

  if (hasIcon) {
    return ['div', panelAttrs, iconDiv, contentDiv];
  } else {
    return ['div', panelAttrs, contentDiv];
  }
};