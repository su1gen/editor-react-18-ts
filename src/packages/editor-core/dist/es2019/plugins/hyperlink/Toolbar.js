import React from 'react';
import { stateKey } from './pm-plugins/main';
import { removeLink, editInsertedLink, updateLink, insertLinkWithAnalytics } from './commands';
import HyperlinkAddToolbar from './ui/HyperlinkAddToolbar';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { normalizeUrl } from './utils';
import { linkToolbarMessages as linkToolbarCommonMessages, linkMessages } from '../../messages';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '../../ui/LinkSearch/ToolbarComponents';
import { HyperlinkToolbarAppearance } from './HyperlinkToolbarAppearance';
import { addAnalytics, ACTION_SUBJECT_ID } from '../analytics';
import { buildVisitedLinkPayload, buildOpenedSettingsPayload } from '../../utils/linking-utils';
import { getFeatureFlags } from '../feature-flags-context';
/* type guard for edit links */

function isEditLink(linkMark) {
  return linkMark.pos !== undefined;
}

const dispatchAnalytics = (dispatch, state, analyticsBuilder) => {
  if (dispatch) {
    dispatch(addAnalytics(state, state.tr, analyticsBuilder(ACTION_SUBJECT_ID.HYPERLINK)));
  }
};

const visitHyperlink = () => (state, dispatch) => {
  dispatchAnalytics(dispatch, state, buildVisitedLinkPayload);
  return true;
};

const openLinkSettings = () => (state, dispatch) => {
  dispatchAnalytics(dispatch, state, buildOpenedSettingsPayload);
  return true;
};

function getLinkText(activeLinkMark, state) {
  if (!activeLinkMark.node) {
    return undefined;
  }

  const textToUrl = normalizeUrl(activeLinkMark.node.text);
  const linkMark = activeLinkMark.node.marks.find(mark => mark.type === state.schema.marks.link);
  const linkHref = linkMark && linkMark.attrs.href;

  if (textToUrl === linkHref) {
    return undefined;
  }

  return activeLinkMark.node.text;
}

const getSettingsButtonGroup = (state, intl) => {
  const {
    floatingToolbarLinkSettingsButton
  } = getFeatureFlags(state);
  return floatingToolbarLinkSettingsButton === 'true' ? [{
    type: 'separator'
  }, {
    id: 'editor.link.settings',
    type: 'button',
    icon: CogIcon,
    title: intl.formatMessage(linkToolbarCommonMessages.settingsLink),
    onClick: openLinkSettings(),
    href: 'https://id.atlassian.com/manage-profile/link-preferences',
    target: '_blank'
  }] : [];
};

export const getToolbarConfig = options => (state, intl, providerFactory) => {
  const {
    formatMessage
  } = intl;
  const linkState = stateKey.getState(state);

  if (linkState && linkState.activeLinkMark) {
    const {
      activeLinkMark
    } = linkState;
    const hyperLinkToolbar = {
      title: 'Hyperlink floating controls',
      nodeType: [state.schema.nodes.text, state.schema.nodes.paragraph, state.schema.nodes.heading, state.schema.nodes.taskItem, state.schema.nodes.decisionItem, state.schema.nodes.caption].filter(nodeType => !!nodeType),
      // Use only the node types existing in the schema ED-6745
      align: 'left',
      className: activeLinkMark.type.match('INSERT|EDIT_INSERTED') ? 'hyperlink-floating-toolbar' : ''
    };

    switch (activeLinkMark.type) {
      case 'EDIT':
        {
          const {
            pos,
            node
          } = activeLinkMark;
          const linkMark = node.marks.filter(mark => mark.type === state.schema.marks.link);
          const link = linkMark[0] && linkMark[0].attrs.href;
          const isValidUrl = isSafeUrl(link);
          const labelOpenLink = formatMessage(isValidUrl ? linkMessages.openLink : linkToolbarCommonMessages.unableToOpenLink); // TODO: ED-14403 investigate why these are not translating?

          const labelUnlink = formatMessage(linkToolbarCommonMessages.unlink);
          const editLink = formatMessage(linkToolbarCommonMessages.editLink);
          let metadata = {
            url: link,
            title: ''
          };

          if (activeLinkMark.node.text) {
            metadata.title = activeLinkMark.node.text;
          }

          return { ...hyperLinkToolbar,
            height: 32,
            width: 250,
            items: [{
              type: 'custom',
              fallback: [],
              render: editorView => {
                return /*#__PURE__*/React.createElement(HyperlinkToolbarAppearance, {
                  key: "link-appearance",
                  url: link,
                  intl: intl,
                  editorView: editorView,
                  editorState: state,
                  cardOptions: options === null || options === void 0 ? void 0 : options.cardOptions,
                  providerFactory: providerFactory,
                  platform: options === null || options === void 0 ? void 0 : options.platform
                });
              }
            }, {
              id: 'editor.link.edit',
              type: 'button',
              onClick: editInsertedLink(),
              selected: false,
              title: editLink,
              showTitle: true,
              metadata: metadata
            }, {
              type: 'separator'
            }, {
              id: 'editor.link.openLink',
              type: 'button',
              disabled: !isValidUrl,
              target: '_blank',
              href: isValidUrl ? link : undefined,
              onClick: visitHyperlink(),
              selected: false,
              title: labelOpenLink,
              icon: OpenIcon,
              className: 'hyperlink-open-link',
              metadata: metadata,
              tabIndex: null
            }, {
              type: 'separator'
            }, {
              id: 'editor.link.unlink',
              type: 'button',
              onClick: removeLink(pos),
              selected: false,
              title: labelUnlink,
              icon: UnlinkIcon,
              tabIndex: null
            }, {
              type: 'copy-button',
              items: [{
                type: 'separator'
              }, {
                state,
                formatMessage: formatMessage,
                markType: state.schema.marks.link
              }]
            }, ...getSettingsButtonGroup(state, intl)],
            scrollable: true
          };
        }

      case 'EDIT_INSERTED':
      case 'INSERT':
        {
          let link;

          if (isEditLink(activeLinkMark) && activeLinkMark.node) {
            const linkMark = activeLinkMark.node.marks.filter(mark => mark.type === state.schema.marks.link);
            link = linkMark[0] && linkMark[0].attrs.href;
          }

          const displayText = isEditLink(activeLinkMark) ? getLinkText(activeLinkMark, state) : linkState.activeText;
          return { ...hyperLinkToolbar,
            height: RECENT_SEARCH_HEIGHT_IN_PX,
            width: RECENT_SEARCH_WIDTH_IN_PX,
            items: [{
              type: 'custom',
              fallback: [],
              disableArrowNavigation: true,
              render: (view, idx) => {
                if (!view) {
                  return null;
                }

                return /*#__PURE__*/React.createElement(HyperlinkAddToolbar, {
                  view: view,
                  key: idx,
                  linkPickerOptions: options === null || options === void 0 ? void 0 : options.linkPicker,
                  displayUrl: link,
                  displayText: displayText || '',
                  providerFactory: providerFactory,
                  onSubmit: (href, title = '', displayText, inputMethod) => {
                    var _options$cardOptions;

                    isEditLink(activeLinkMark) ? updateLink(href, displayText || title, activeLinkMark.pos)(view.state, view.dispatch) : insertLinkWithAnalytics(inputMethod, activeLinkMark.from, activeLinkMark.to, href, title, displayText, !!(options !== null && options !== void 0 && (_options$cardOptions = options.cardOptions) !== null && _options$cardOptions !== void 0 && _options$cardOptions.provider))(view.state, view.dispatch);
                    view.focus();
                  }
                });
              }
            }]
          };
        }
    }
  }

  return;
};