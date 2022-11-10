import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

var dispatchAnalytics = function dispatchAnalytics(dispatch, state, analyticsBuilder) {
  if (dispatch) {
    dispatch(addAnalytics(state, state.tr, analyticsBuilder(ACTION_SUBJECT_ID.HYPERLINK)));
  }
};

var visitHyperlink = function visitHyperlink() {
  return function (state, dispatch) {
    dispatchAnalytics(dispatch, state, buildVisitedLinkPayload);
    return true;
  };
};

var openLinkSettings = function openLinkSettings() {
  return function (state, dispatch) {
    dispatchAnalytics(dispatch, state, buildOpenedSettingsPayload);
    return true;
  };
};

function getLinkText(activeLinkMark, state) {
  if (!activeLinkMark.node) {
    return undefined;
  }

  var textToUrl = normalizeUrl(activeLinkMark.node.text);
  var linkMark = activeLinkMark.node.marks.find(function (mark) {
    return mark.type === state.schema.marks.link;
  });
  var linkHref = linkMark && linkMark.attrs.href;

  if (textToUrl === linkHref) {
    return undefined;
  }

  return activeLinkMark.node.text;
}

var getSettingsButtonGroup = function getSettingsButtonGroup(state, intl) {
  var _getFeatureFlags = getFeatureFlags(state),
      floatingToolbarLinkSettingsButton = _getFeatureFlags.floatingToolbarLinkSettingsButton;

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

export var getToolbarConfig = function getToolbarConfig(options) {
  return function (state, intl, providerFactory) {
    var formatMessage = intl.formatMessage;
    var linkState = stateKey.getState(state);

    if (linkState && linkState.activeLinkMark) {
      var activeLinkMark = linkState.activeLinkMark;
      var hyperLinkToolbar = {
        title: 'Hyperlink floating controls',
        nodeType: [state.schema.nodes.text, state.schema.nodes.paragraph, state.schema.nodes.heading, state.schema.nodes.taskItem, state.schema.nodes.decisionItem, state.schema.nodes.caption].filter(function (nodeType) {
          return !!nodeType;
        }),
        // Use only the node types existing in the schema ED-6745
        align: 'left',
        className: activeLinkMark.type.match('INSERT|EDIT_INSERTED') ? 'hyperlink-floating-toolbar' : ''
      };

      switch (activeLinkMark.type) {
        case 'EDIT':
          {
            var pos = activeLinkMark.pos,
                node = activeLinkMark.node;
            var linkMark = node.marks.filter(function (mark) {
              return mark.type === state.schema.marks.link;
            });
            var link = linkMark[0] && linkMark[0].attrs.href;
            var isValidUrl = isSafeUrl(link);
            var labelOpenLink = formatMessage(isValidUrl ? linkMessages.openLink : linkToolbarCommonMessages.unableToOpenLink); // TODO: ED-14403 investigate why these are not translating?

            var labelUnlink = formatMessage(linkToolbarCommonMessages.unlink);
            var editLink = formatMessage(linkToolbarCommonMessages.editLink);
            var metadata = {
              url: link,
              title: ''
            };

            if (activeLinkMark.node.text) {
              metadata.title = activeLinkMark.node.text;
            }

            return _objectSpread(_objectSpread({}, hyperLinkToolbar), {}, {
              height: 32,
              width: 250,
              items: [{
                type: 'custom',
                fallback: [],
                render: function render(editorView) {
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
                  state: state,
                  formatMessage: formatMessage,
                  markType: state.schema.marks.link
                }]
              }].concat(_toConsumableArray(getSettingsButtonGroup(state, intl))),
              scrollable: true
            });
          }

        case 'EDIT_INSERTED':
        case 'INSERT':
          {
            var _link;

            if (isEditLink(activeLinkMark) && activeLinkMark.node) {
              var _linkMark = activeLinkMark.node.marks.filter(function (mark) {
                return mark.type === state.schema.marks.link;
              });

              _link = _linkMark[0] && _linkMark[0].attrs.href;
            }

            var displayText = isEditLink(activeLinkMark) ? getLinkText(activeLinkMark, state) : linkState.activeText;
            return _objectSpread(_objectSpread({}, hyperLinkToolbar), {}, {
              height: RECENT_SEARCH_HEIGHT_IN_PX,
              width: RECENT_SEARCH_WIDTH_IN_PX,
              items: [{
                type: 'custom',
                fallback: [],
                disableArrowNavigation: true,
                render: function render(view, idx) {
                  if (!view) {
                    return null;
                  }

                  return /*#__PURE__*/React.createElement(HyperlinkAddToolbar, {
                    view: view,
                    key: idx,
                    linkPickerOptions: options === null || options === void 0 ? void 0 : options.linkPicker,
                    displayUrl: _link,
                    displayText: displayText || '',
                    providerFactory: providerFactory,
                    onSubmit: function onSubmit(href) {
                      var _options$cardOptions;

                      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                      var displayText = arguments.length > 2 ? arguments[2] : undefined;
                      var inputMethod = arguments.length > 3 ? arguments[3] : undefined;
                      isEditLink(activeLinkMark) ? updateLink(href, displayText || title, activeLinkMark.pos)(view.state, view.dispatch) : insertLinkWithAnalytics(inputMethod, activeLinkMark.from, activeLinkMark.to, href, title, displayText, !!(options !== null && options !== void 0 && (_options$cardOptions = options.cardOptions) !== null && _options$cardOptions !== void 0 && _options$cardOptions.provider))(view.state, view.dispatch);
                      view.focus();
                    }
                  });
                }
              }]
            });
          }
      }
    }

    return;
  };
};