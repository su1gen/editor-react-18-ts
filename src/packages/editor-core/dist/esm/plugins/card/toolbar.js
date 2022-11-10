import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
export var removeCard = function removeCard(state, dispatch) {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  var type = state.selection.node.type.name;
  var payload = {
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
export var visitCardLink = function visitCardLink(state, dispatch) {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  var type = state.selection.node.type;

  var _titleUrlPairFromNode = titleUrlPairFromNode(state.selection.node),
      url = _titleUrlPairFromNode.url; // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
  // We are in edit mode here, open the smart card URL in a new window.


  window.open(url);

  if (dispatch) {
    dispatch(addAnalytics(state, state.tr, buildVisitedLinkPayload(type.name)));
  }

  return true;
};
export var openLinkSettings = function openLinkSettings(state, dispatch) {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  window.open('https://id.atlassian.com/manage-profile/link-preferences');

  if (dispatch) {
    var type = state.selection.node.type;
    dispatch(addAnalytics(state, state.tr, buildOpenedSettingsPayload(type.name)));
  }

  return true;
};
export var floatingToolbar = function floatingToolbar(cardOptions, platform, linkPickerOptions) {
  return function (state, intl, providerFactory) {
    var _state$schema$nodes = state.schema.nodes,
        inlineCard = _state$schema$nodes.inlineCard,
        blockCard = _state$schema$nodes.blockCard,
        embedCard = _state$schema$nodes.embedCard;
    var nodeType = [inlineCard, blockCard, embedCard];
    var pluginState = pluginKey.getState(state);

    if (!(state.selection instanceof NodeSelection)) {
      return;
    }

    var selectedNode = state.selection.node;

    if (!selectedNode) {
      return;
    }

    var isEmbedCard = appearanceForNodeType(selectedNode.type) === 'embed';
    /* add an offset to embeds due to extra padding */

    var toolbarOffset = isEmbedCard ? {
      offset: [0, 24]
    } : {}; // Applies padding override for when link picker is currently displayed

    var className = pluginState.showLinkingToolbar ? FLOATING_TOOLBAR_LINKPICKER_CLASSNAME : undefined;
    return _objectSpread(_objectSpread(_objectSpread({
      title: intl.formatMessage(messages.card),
      className: className,
      nodeType: nodeType
    }, toolbarOffset), {}, {
      getDomRef: function getDomRef(view) {
        var element = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));

        if (!element) {
          return undefined;
        }

        if (isEmbedCard) {
          return element.querySelector(".".concat(richMediaClassName));
        }

        return element;
      },
      items: generateToolbarItems(state, intl, providerFactory, cardOptions, platform, linkPickerOptions)
    }, pluginState.showLinkingToolbar ? editLinkToolbarConfig : {}), {}, {
      scrollable: pluginState.showLinkingToolbar ? false : true
    });
  };
};

var unlinkCard = function unlinkCard(node, state) {
  var displayInfo = displayInfoForCard(node, findCardInfo(state));
  var text = displayInfo.title || displayInfo.url;

  if (text) {
    return changeSelectedCardToText(text);
  }

  return function () {
    return false;
  };
};

var buildAlignmentOptions = function buildAlignmentOptions(state, intl) {
  return buildLayoutButtons(state, intl, state.schema.nodes.embedCard, true, true);
};

var generateToolbarItems = function generateToolbarItems(state, intl, providerFactory, cardOptions, platform, linkPicker) {
  return function (node) {
    var _titleUrlPairFromNode2 = titleUrlPairFromNode(node),
        url = _titleUrlPairFromNode2.url;

    var metadata = {};

    if (url && !isSafeUrl(url)) {
      return [];
    } else {
      var _displayInfoForCard = displayInfoForCard(node, findCardInfo(state)),
          title = _displayInfoForCard.title;

      metadata = {
        url: url,
        title: title
      };
    }

    var pluginState = pluginKey.getState(state);
    var currentAppearance = appearanceForNodeType(node.type);
    /* mobile builds toolbar natively using toolbarItems */

    if (pluginState.showLinkingToolbar && platform !== 'mobile') {
      return [buildEditLinkToolbar({
        providerFactory: providerFactory,
        linkPicker: linkPicker,
        node: node
      })];
    } else {
      var inlineCard = state.schema.nodes.inlineCard;
      var toolbarItems = [{
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
      }].concat(_toConsumableArray(getUnlinkButtonGroup(state, intl, node, inlineCard)), [{
        type: 'copy-button',
        items: [{
          state: state,
          formatMessage: intl.formatMessage,
          nodeType: node.type
        }, {
          type: 'separator'
        }]
      }], _toConsumableArray(getSettingsButtonGroup(state, intl)), [{
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
      }]);

      if (currentAppearance === 'embed') {
        var alignmentOptions = buildAlignmentOptions(state, intl);

        if (alignmentOptions.length) {
          alignmentOptions.push({
            type: 'separator'
          });
        }

        toolbarItems.unshift.apply(toolbarItems, _toConsumableArray(alignmentOptions));
      }

      var allowBlockCards = cardOptions.allowBlockCards,
          allowEmbeds = cardOptions.allowEmbeds;

      if ((allowBlockCards || allowEmbeds) && currentAppearance) {
        toolbarItems.unshift({
          type: 'custom',
          fallback: [],
          render: function render(editorView) {
            return /*#__PURE__*/React.createElement(LinkToolbarAppearance, {
              key: "link-appearance",
              url: url,
              intl: intl,
              currentAppearance: currentAppearance,
              editorView: editorView,
              editorState: state,
              allowEmbeds: allowEmbeds,
              platform: platform
            });
          }
        }, {
          type: 'separator'
        });
      }

      return toolbarItems;
    }
  };
};

var getUnlinkButtonGroup = function getUnlinkButtonGroup(state, intl, node, inlineCard) {
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

var getSettingsButtonGroup = function getSettingsButtonGroup(state, intl) {
  var _getFeatureFlags = getFeatureFlags(state),
      floatingToolbarLinkSettingsButton = _getFeatureFlags.floatingToolbarLinkSettingsButton;

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