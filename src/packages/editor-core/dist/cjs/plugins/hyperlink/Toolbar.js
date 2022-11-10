"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToolbarConfig = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _main = require("./pm-plugins/main");

var _commands = require("./commands");

var _HyperlinkAddToolbar = _interopRequireDefault(require("./ui/HyperlinkAddToolbar"));

var _unlink = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/unlink"));

var _settings = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/settings"));

var _shortcut = _interopRequireDefault(require("@atlaskit/icon/glyph/shortcut"));

var _utils = require("./utils");

var _messages = require("../../messages");

var _adfSchema = require("@atlaskit/adf-schema");

var _ToolbarComponents = require("../../ui/LinkSearch/ToolbarComponents");

var _HyperlinkToolbarAppearance = require("./HyperlinkToolbarAppearance");

var _analytics = require("../analytics");

var _linkingUtils = require("../../utils/linking-utils");

var _featureFlagsContext = require("../feature-flags-context");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* type guard for edit links */
function isEditLink(linkMark) {
  return linkMark.pos !== undefined;
}

var dispatchAnalytics = function dispatchAnalytics(dispatch, state, analyticsBuilder) {
  if (dispatch) {
    dispatch((0, _analytics.addAnalytics)(state, state.tr, analyticsBuilder(_analytics.ACTION_SUBJECT_ID.HYPERLINK)));
  }
};

var visitHyperlink = function visitHyperlink() {
  return function (state, dispatch) {
    dispatchAnalytics(dispatch, state, _linkingUtils.buildVisitedLinkPayload);
    return true;
  };
};

var openLinkSettings = function openLinkSettings() {
  return function (state, dispatch) {
    dispatchAnalytics(dispatch, state, _linkingUtils.buildOpenedSettingsPayload);
    return true;
  };
};

function getLinkText(activeLinkMark, state) {
  if (!activeLinkMark.node) {
    return undefined;
  }

  var textToUrl = (0, _utils.normalizeUrl)(activeLinkMark.node.text);
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
  var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(state),
      floatingToolbarLinkSettingsButton = _getFeatureFlags.floatingToolbarLinkSettingsButton;

  return floatingToolbarLinkSettingsButton === 'true' ? [{
    type: 'separator'
  }, {
    id: 'editor.link.settings',
    type: 'button',
    icon: _settings.default,
    title: intl.formatMessage(_messages.linkToolbarMessages.settingsLink),
    onClick: openLinkSettings(),
    href: 'https://id.atlassian.com/manage-profile/link-preferences',
    target: '_blank'
  }] : [];
};

var getToolbarConfig = function getToolbarConfig(options) {
  return function (state, intl, providerFactory) {
    var formatMessage = intl.formatMessage;

    var linkState = _main.stateKey.getState(state);

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
            var isValidUrl = (0, _adfSchema.isSafeUrl)(link);
            var labelOpenLink = formatMessage(isValidUrl ? _messages.linkMessages.openLink : _messages.linkToolbarMessages.unableToOpenLink); // TODO: ED-14403 investigate why these are not translating?

            var labelUnlink = formatMessage(_messages.linkToolbarMessages.unlink);
            var editLink = formatMessage(_messages.linkToolbarMessages.editLink);
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
                  return /*#__PURE__*/_react.default.createElement(_HyperlinkToolbarAppearance.HyperlinkToolbarAppearance, {
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
                onClick: (0, _commands.editInsertedLink)(),
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
                icon: _shortcut.default,
                className: 'hyperlink-open-link',
                metadata: metadata,
                tabIndex: null
              }, {
                type: 'separator'
              }, {
                id: 'editor.link.unlink',
                type: 'button',
                onClick: (0, _commands.removeLink)(pos),
                selected: false,
                title: labelUnlink,
                icon: _unlink.default,
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
              }].concat((0, _toConsumableArray2.default)(getSettingsButtonGroup(state, intl))),
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
              height: _ToolbarComponents.RECENT_SEARCH_HEIGHT_IN_PX,
              width: _ToolbarComponents.RECENT_SEARCH_WIDTH_IN_PX,
              items: [{
                type: 'custom',
                fallback: [],
                disableArrowNavigation: true,
                render: function render(view, idx) {
                  if (!view) {
                    return null;
                  }

                  return /*#__PURE__*/_react.default.createElement(_HyperlinkAddToolbar.default, {
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
                      isEditLink(activeLinkMark) ? (0, _commands.updateLink)(href, displayText || title, activeLinkMark.pos)(view.state, view.dispatch) : (0, _commands.insertLinkWithAnalytics)(inputMethod, activeLinkMark.from, activeLinkMark.to, href, title, displayText, !!(options !== null && options !== void 0 && (_options$cardOptions = options.cardOptions) !== null && _options$cardOptions !== void 0 && _options$cardOptions.provider))(view.state, view.dispatch);
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

exports.getToolbarConfig = getToolbarConfig;