"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visitCardLink = exports.removeCard = exports.openLinkSettings = exports.floatingToolbar = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _unlink = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/unlink"));

var _settings = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/settings"));

var _shortcut = _interopRequireDefault(require("@atlaskit/icon/glyph/shortcut"));

var _analytics = require("../analytics");

var _messages = _interopRequireWildcard(require("../../messages"));

var _decoration = require("../base/pm-plugins/decoration");

var _doc = require("./pm-plugins/doc");

var _main = require("./pm-plugins/main");

var _styles = require("@atlaskit/editor-common/styles");

var _EditLinkToolbar = require("./ui/EditLinkToolbar");

var _utils = require("./utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _LinkToolbarAppearance = require("./ui/LinkToolbarAppearance");

var _messages2 = require("./messages");

var _MediaAndEmbedsToolbar = _interopRequireDefault(require("../../ui/MediaAndEmbedsToolbar"));

var _linkingUtils = require("../../utils/linking-utils");

var _styles2 = require("./styles");

var _featureFlagsContext = require("../feature-flags-context");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var removeCard = function removeCard(state, dispatch) {
  if (!(state.selection instanceof _prosemirrorState.NodeSelection)) {
    return false;
  }

  var type = state.selection.node.type.name;
  var payload = {
    action: _analytics.ACTION.DELETED,
    actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.TOOLBAR,
      displayMode: type
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };

  if (dispatch) {
    dispatch((0, _analytics.addAnalytics)(state, (0, _prosemirrorUtils.removeSelectedNode)(state.tr), payload));
  }

  return true;
};

exports.removeCard = removeCard;

var visitCardLink = function visitCardLink(state, dispatch) {
  if (!(state.selection instanceof _prosemirrorState.NodeSelection)) {
    return false;
  }

  var type = state.selection.node.type;

  var _titleUrlPairFromNode = (0, _utils.titleUrlPairFromNode)(state.selection.node),
      url = _titleUrlPairFromNode.url; // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
  // We are in edit mode here, open the smart card URL in a new window.


  window.open(url);

  if (dispatch) {
    dispatch((0, _analytics.addAnalytics)(state, state.tr, (0, _linkingUtils.buildVisitedLinkPayload)(type.name)));
  }

  return true;
};

exports.visitCardLink = visitCardLink;

var openLinkSettings = function openLinkSettings(state, dispatch) {
  if (!(state.selection instanceof _prosemirrorState.NodeSelection)) {
    return false;
  }

  window.open('https://id.atlassian.com/manage-profile/link-preferences');

  if (dispatch) {
    var type = state.selection.node.type;
    dispatch((0, _analytics.addAnalytics)(state, state.tr, (0, _linkingUtils.buildOpenedSettingsPayload)(type.name)));
  }

  return true;
};

exports.openLinkSettings = openLinkSettings;

var floatingToolbar = function floatingToolbar(cardOptions, platform, linkPickerOptions) {
  return function (state, intl, providerFactory) {
    var _state$schema$nodes = state.schema.nodes,
        inlineCard = _state$schema$nodes.inlineCard,
        blockCard = _state$schema$nodes.blockCard,
        embedCard = _state$schema$nodes.embedCard;
    var nodeType = [inlineCard, blockCard, embedCard];

    var pluginState = _main.pluginKey.getState(state);

    if (!(state.selection instanceof _prosemirrorState.NodeSelection)) {
      return;
    }

    var selectedNode = state.selection.node;

    if (!selectedNode) {
      return;
    }

    var isEmbedCard = (0, _utils.appearanceForNodeType)(selectedNode.type) === 'embed';
    /* add an offset to embeds due to extra padding */

    var toolbarOffset = isEmbedCard ? {
      offset: [0, 24]
    } : {}; // Applies padding override for when link picker is currently displayed

    var className = pluginState.showLinkingToolbar ? _styles2.FLOATING_TOOLBAR_LINKPICKER_CLASSNAME : undefined;
    return _objectSpread(_objectSpread(_objectSpread({
      title: intl.formatMessage(_messages2.messages.card),
      className: className,
      nodeType: nodeType
    }, toolbarOffset), {}, {
      getDomRef: function getDomRef(view) {
        var element = (0, _prosemirrorUtils.findDomRefAtPos)(view.state.selection.from, view.domAtPos.bind(view));

        if (!element) {
          return undefined;
        }

        if (isEmbedCard) {
          return element.querySelector(".".concat(_styles.richMediaClassName));
        }

        return element;
      },
      items: generateToolbarItems(state, intl, providerFactory, cardOptions, platform, linkPickerOptions)
    }, pluginState.showLinkingToolbar ? _EditLinkToolbar.editLinkToolbarConfig : {}), {}, {
      scrollable: pluginState.showLinkingToolbar ? false : true
    });
  };
};

exports.floatingToolbar = floatingToolbar;

var unlinkCard = function unlinkCard(node, state) {
  var displayInfo = (0, _utils.displayInfoForCard)(node, (0, _utils.findCardInfo)(state));
  var text = displayInfo.title || displayInfo.url;

  if (text) {
    return (0, _doc.changeSelectedCardToText)(text);
  }

  return function () {
    return false;
  };
};

var buildAlignmentOptions = function buildAlignmentOptions(state, intl) {
  return (0, _MediaAndEmbedsToolbar.default)(state, intl, state.schema.nodes.embedCard, true, true);
};

var generateToolbarItems = function generateToolbarItems(state, intl, providerFactory, cardOptions, platform, linkPicker) {
  return function (node) {
    var _titleUrlPairFromNode2 = (0, _utils.titleUrlPairFromNode)(node),
        url = _titleUrlPairFromNode2.url;

    var metadata = {};

    if (url && !(0, _adfSchema.isSafeUrl)(url)) {
      return [];
    } else {
      var _displayInfoForCard = (0, _utils.displayInfoForCard)(node, (0, _utils.findCardInfo)(state)),
          title = _displayInfoForCard.title;

      metadata = {
        url: url,
        title: title
      };
    }

    var pluginState = _main.pluginKey.getState(state);

    var currentAppearance = (0, _utils.appearanceForNodeType)(node.type);
    /* mobile builds toolbar natively using toolbarItems */

    if (pluginState.showLinkingToolbar && platform !== 'mobile') {
      return [(0, _EditLinkToolbar.buildEditLinkToolbar)({
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
        title: intl.formatMessage(_messages.linkToolbarMessages.editLink),
        showTitle: true,
        testId: 'link-toolbar-edit-link-button',
        onClick: _EditLinkToolbar.editLink
      }, {
        type: 'separator'
      }, {
        id: 'editor.link.openLink',
        type: 'button',
        icon: _shortcut.default,
        metadata: metadata,
        className: 'hyperlink-open-link',
        title: intl.formatMessage(_messages.linkMessages.openLink),
        onClick: visitCardLink
      }, {
        type: 'separator'
      }].concat((0, _toConsumableArray2.default)(getUnlinkButtonGroup(state, intl, node, inlineCard)), [{
        type: 'copy-button',
        items: [{
          state: state,
          formatMessage: intl.formatMessage,
          nodeType: node.type
        }, {
          type: 'separator'
        }]
      }], (0, _toConsumableArray2.default)(getSettingsButtonGroup(state, intl)), [{
        id: 'editor.link.delete',
        type: 'button',
        appearance: 'danger',
        icon: _remove.default,
        onMouseEnter: (0, _decoration.hoverDecoration)(node.type, true),
        onMouseLeave: (0, _decoration.hoverDecoration)(node.type, false),
        onFocus: (0, _decoration.hoverDecoration)(node.type, true),
        onBlur: (0, _decoration.hoverDecoration)(node.type, false),
        title: intl.formatMessage(_messages.default.remove),
        onClick: removeCard
      }]);

      if (currentAppearance === 'embed') {
        var alignmentOptions = buildAlignmentOptions(state, intl);

        if (alignmentOptions.length) {
          alignmentOptions.push({
            type: 'separator'
          });
        }

        toolbarItems.unshift.apply(toolbarItems, (0, _toConsumableArray2.default)(alignmentOptions));
      }

      var allowBlockCards = cardOptions.allowBlockCards,
          allowEmbeds = cardOptions.allowEmbeds;

      if ((allowBlockCards || allowEmbeds) && currentAppearance) {
        toolbarItems.unshift({
          type: 'custom',
          fallback: [],
          render: function render(editorView) {
            return /*#__PURE__*/_react.default.createElement(_LinkToolbarAppearance.LinkToolbarAppearance, {
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
    title: intl.formatMessage(_messages.linkToolbarMessages.unlink),
    icon: _unlink.default,
    onClick: unlinkCard(node, state)
  }, {
    type: 'separator'
  }] : [];
};

var getSettingsButtonGroup = function getSettingsButtonGroup(state, intl) {
  var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(state),
      floatingToolbarLinkSettingsButton = _getFeatureFlags.floatingToolbarLinkSettingsButton;

  return floatingToolbarLinkSettingsButton === 'true' ? [{
    id: 'editor.link.settings',
    type: 'button',
    icon: _settings.default,
    title: intl.formatMessage(_messages.linkToolbarMessages.settingsLink),
    onClick: openLinkSettings
  }, {
    type: 'separator'
  }] : [];
};