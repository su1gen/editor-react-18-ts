import React from 'react';
import { NodeSelection } from 'prosemirror-state';
import { removeSelectedNode, findDomRefAtPos } from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics } from '../analytics';
import { linkToolbarMessages, linkMessages } from '../../messages';
import commonMessages from '../../messages';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { changeSelectedCardToText } from './pm-plugins/doc';
import { pluginKey } from './pm-plugins/main';
import { richMediaClassName } from '@atlaskit/editor-common/styles';
import { buildEditLinkToolbar, editLink, editLinkToolbarConfig } from './ui/EditLinkToolbar';
import { displayInfoForCard, findCardInfo, titleUrlPairFromNode, appearanceForNodeType } from './utils';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { LinkToolbarAppearance } from './ui/LinkToolbarAppearance';
import { messages } from './messages';
import buildLayoutButtons from '../../ui/MediaAndEmbedsToolbar';
import { buildOpenedSettingsPayload, buildVisitedLinkPayload } from '../../utils/linking-utils';
import { FLOATING_TOOLBAR_LINKPICKER_CLASSNAME } from './styles';
import { getFeatureFlags } from '../feature-flags-context';
export const removeCard = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  const type = state.selection.node.type.name;
  const payload = {
    action: ACTION.DELETED,
    actionSubject: ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR,
      displayMode: type
    },
    eventType: EVENT_TYPE.TRACK
  };

  if (dispatch) {
    dispatch(addAnalytics(state, removeSelectedNode(state.tr), payload));
  }

  return true;
};
export const visitCardLink = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  const {
    type
  } = state.selection.node;
  const {
    url
  } = titleUrlPairFromNode(state.selection.node); // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
  // We are in edit mode here, open the smart card URL in a new window.

  window.open(url);

  if (dispatch) {
    dispatch(addAnalytics(state, state.tr, buildVisitedLinkPayload(type.name)));
  }

  return true;
};
export const openLinkSettings = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  window.open('https://id.atlassian.com/manage-profile/link-preferences');

  if (dispatch) {
    const {
      type
    } = state.selection.node;
    dispatch(addAnalytics(state, state.tr, buildOpenedSettingsPayload(type.name)));
  }

  return true;
};
export const floatingToolbar = (cardOptions, platform, linkPickerOptions) => {
  return (state, intl, providerFactory) => {
    const {
      inlineCard,
      blockCard,
      embedCard
    } = state.schema.nodes;
    const nodeType = [inlineCard, blockCard, embedCard];
    const pluginState = pluginKey.getState(state);

    if (!(state.selection instanceof NodeSelection)) {
      return;
    }

    const selectedNode = state.selection.node;

    if (!selectedNode) {
      return;
    }

    const isEmbedCard = appearanceForNodeType(selectedNode.type) === 'embed';
    /* add an offset to embeds due to extra padding */

    const toolbarOffset = isEmbedCard ? {
      offset: [0, 24]
    } : {}; // Applies padding override for when link picker is currently displayed

    const className = pluginState.showLinkingToolbar ? FLOATING_TOOLBAR_LINKPICKER_CLASSNAME : undefined;
    return {
      title: intl.formatMessage(messages.card),
      className,
      nodeType,
      ...toolbarOffset,
      getDomRef: view => {
        const element = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));

        if (!element) {
          return undefined;
        }

        if (isEmbedCard) {
          return element.querySelector(`.${richMediaClassName}`);
        }

        return element;
      },
      items: generateToolbarItems(state, intl, providerFactory, cardOptions, platform, linkPickerOptions),
      ...(pluginState.showLinkingToolbar ? editLinkToolbarConfig : {}),
      scrollable: pluginState.showLinkingToolbar ? false : true
    };
  };
};

const unlinkCard = (node, state) => {
  const displayInfo = displayInfoForCard(node, findCardInfo(state));
  const text = displayInfo.title || displayInfo.url;

  if (text) {
    return changeSelectedCardToText(text);
  }

  return () => false;
};

const buildAlignmentOptions = (state, intl) => {
  return buildLayoutButtons(state, intl, state.schema.nodes.embedCard, true, true);
};

const generateToolbarItems = (state, intl, providerFactory, cardOptions, platform, linkPicker) => node => {
  const {
    url
  } = titleUrlPairFromNode(node);
  let metadata = {};

  if (url && !isSafeUrl(url)) {
    return [];
  } else {
    const {
      title
    } = displayInfoForCard(node, findCardInfo(state));
    metadata = {
      url: url,
      title: title
    };
  }

  const pluginState = pluginKey.getState(state);
  const currentAppearance = appearanceForNodeType(node.type);
  /* mobile builds toolbar natively using toolbarItems */

  if (pluginState.showLinkingToolbar && platform !== 'mobile') {
    return [buildEditLinkToolbar({
      providerFactory,
      linkPicker,
      node
    })];
  } else {
    const {
      inlineCard
    } = state.schema.nodes;
    const toolbarItems = [{
      id: 'editor.link.edit',
      type: 'button',
      selected: false,
      metadata: metadata,
      title: intl.formatMessage(linkToolbarMessages.editLink),
      showTitle: true,
      testId: 'link-toolbar-edit-link-button',
      onClick: editLink
    }, {
      type: 'separator'
    }, {
      id: 'editor.link.openLink',
      type: 'button',
      icon: OpenIcon,
      metadata: metadata,
      className: 'hyperlink-open-link',
      title: intl.formatMessage(linkMessages.openLink),
      onClick: visitCardLink
    }, {
      type: 'separator'
    }, ...getUnlinkButtonGroup(state, intl, node, inlineCard), {
      type: 'copy-button',
      items: [{
        state,
        formatMessage: intl.formatMessage,
        nodeType: node.type
      }, {
        type: 'separator'
      }]
    }, ...getSettingsButtonGroup(state, intl), {
      id: 'editor.link.delete',
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onMouseEnter: hoverDecoration(node.type, true),
      onMouseLeave: hoverDecoration(node.type, false),
      onFocus: hoverDecoration(node.type, true),
      onBlur: hoverDecoration(node.type, false),
      title: intl.formatMessage(commonMessages.remove),
      onClick: removeCard
    }];

    if (currentAppearance === 'embed') {
      const alignmentOptions = buildAlignmentOptions(state, intl);

      if (alignmentOptions.length) {
        alignmentOptions.push({
          type: 'separator'
        });
      }

      toolbarItems.unshift(...alignmentOptions);
    }

    const {
      allowBlockCards,
      allowEmbeds
    } = cardOptions;

    if ((allowBlockCards || allowEmbeds) && currentAppearance) {
      toolbarItems.unshift({
        type: 'custom',
        fallback: [],
        render: editorView => /*#__PURE__*/React.createElement(LinkToolbarAppearance, {
          key: "link-appearance",
          url: url,
          intl: intl,
          currentAppearance: currentAppearance,
          editorView: editorView,
          editorState: state,
          allowEmbeds: allowEmbeds,
          platform: platform
        })
      }, {
        type: 'separator'
      });
    }

    return toolbarItems;
  }
};

const getUnlinkButtonGroup = (state, intl, node, inlineCard) => {
  return node.type === inlineCard ? [{
    id: 'editor.link.unlink',
    type: 'button',
    title: intl.formatMessage(linkToolbarMessages.unlink),
    icon: UnlinkIcon,
    onClick: unlinkCard(node, state)
  }, {
    type: 'separator'
  }] : [];
};

const getSettingsButtonGroup = (state, intl) => {
  const {
    floatingToolbarLinkSettingsButton
  } = getFeatureFlags(state);
  return floatingToolbarLinkSettingsButton === 'true' ? [{
    id: 'editor.link.settings',
    type: 'button',
    icon: CogIcon,
    title: intl.formatMessage(linkToolbarMessages.settingsLink),
    onClick: openLinkSettings
  }, {
    type: 'separator'
  }] : [];
};