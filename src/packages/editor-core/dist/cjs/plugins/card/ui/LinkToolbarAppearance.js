"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkToolbarAppearance = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _prosemirrorModel = require("prosemirror-model");

var _doc = require("../pm-plugins/doc");

var _nodes = require("../../../utils/nodes");

var _Dropdown = _interopRequireDefault(require("../../floating-toolbar/ui/Dropdown"));

var _messages = require("../messages");

var _messages2 = _interopRequireDefault(require("../../../messages"));

var _featureFlagsContext = require("../../../plugins/feature-flags-context");

var _LinkToolbarIconDropdown = require("./LinkToolbarIconDropdown");

var _LinkToolbarButtonGroup = require("./LinkToolbarButtonGroup");

var _linkToolbarButtonGroupOptions = require("./link-toolbar-button-group-options");

var _linkToolbarIconDropdownOptions = require("./link-toolbar-icon-dropdown-options");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var LinkToolbarAppearance = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(LinkToolbarAppearance, _React$Component);

  var _super = _createSuper(LinkToolbarAppearance);

  function LinkToolbarAppearance() {
    var _this;

    (0, _classCallCheck2.default)(this, LinkToolbarAppearance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderDropdown", function (view, cardContext) {
      var _this$props = _this.props,
          url = _this$props.url,
          intl = _this$props.intl,
          currentAppearance = _this$props.currentAppearance,
          editorState = _this$props.editorState,
          allowEmbeds = _this$props.allowEmbeds,
          platform = _this$props.platform;
      var preview = allowEmbeds && cardContext && url && cardContext.extractors.getPreview(url, platform);

      if (url) {
        var _cardContext$store, _urlState$error;

        var urlState = cardContext === null || cardContext === void 0 ? void 0 : (_cardContext$store = cardContext.store) === null || _cardContext$store === void 0 ? void 0 : _cardContext$store.getState()[url];

        if ((urlState === null || urlState === void 0 ? void 0 : (_urlState$error = urlState.error) === null || _urlState$error === void 0 ? void 0 : _urlState$error.kind) === 'fatal') {
          return null;
        }
      }

      var isBlockCardLinkSupportedInParent = (0, _nodes.isSupportedInParent)(editorState, _prosemirrorModel.Fragment.from(editorState.schema.nodes.blockCard.createChecked({})), currentAppearance);
      var isEmbedCardLinkSupportedInParent = allowEmbeds ? (0, _nodes.isSupportedInParent)(editorState, _prosemirrorModel.Fragment.from(editorState.schema.nodes.embedCard.createChecked({})), currentAppearance) : false;
      var embedOption = allowEmbeds && preview && {
        appearance: 'embed',
        title: intl.formatMessage(_messages.messages.embed),
        onClick: (0, _doc.setSelectedCardAppearance)('embed'),
        selected: currentAppearance === 'embed',
        hidden: false,
        testId: 'embed-appearance',
        disabled: !isEmbedCardLinkSupportedInParent,
        tooltip: isEmbedCardLinkSupportedInParent ? undefined : getUnavailableMessage(editorState, intl)
      };
      var options = [{
        title: intl.formatMessage(_messages.messages.url),
        onClick: function onClick() {
          return (0, _doc.changeSelectedCardToLink)(url, url, true)(editorState, view === null || view === void 0 ? void 0 : view.dispatch);
        },
        selected: !currentAppearance,
        testId: 'url-appearance'
      }, {
        appearance: 'inline',
        title: intl.formatMessage(_messages.messages.inline),
        onClick: (0, _doc.setSelectedCardAppearance)('inline'),
        selected: currentAppearance === 'inline',
        testId: 'inline-appearance'
      }, {
        appearance: 'block',
        title: intl.formatMessage(_messages.messages.block),
        onClick: (0, _doc.setSelectedCardAppearance)('block'),
        selected: currentAppearance === 'block',
        testId: 'block-appearance',
        disabled: !isBlockCardLinkSupportedInParent,
        tooltip: isBlockCardLinkSupportedInParent ? undefined : getUnavailableMessage(editorState, intl)
      }];

      var dispatchCommand = function dispatchCommand(fn) {
        fn && fn(editorState, view && view.dispatch); // Refocus the view to ensure the editor has focus

        if (view && !view.hasFocus()) {
          view.focus();
        }
      };

      if (embedOption) {
        options.push(embedOption);
      }

      var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(editorState),
          viewChangingExperimentToolbarStyle = _getFeatureFlags.viewChangingExperimentToolbarStyle;

      if (viewChangingExperimentToolbarStyle === 'toolbarIcons') {
        return /*#__PURE__*/_react.default.createElement(_LinkToolbarButtonGroup.LinkToolbarButtonGroup, {
          key: "link-toolbar-button-group",
          options: options.map(function (option) {
            return (0, _linkToolbarButtonGroupOptions.getButtonGroupOption)(intl, dispatchCommand, option);
          })
        });
      }

      if (viewChangingExperimentToolbarStyle === 'newDropdown') {
        return /*#__PURE__*/_react.default.createElement(_LinkToolbarIconDropdown.LinkToolbarIconDropdown, {
          key: "link-toolbar-icon-dropdown",
          title: "Change view",
          buttonTestId: "link-toolbar-appearance-button",
          dispatchCommand: dispatchCommand,
          options: options.map(function (option) {
            return (0, _linkToolbarIconDropdownOptions.getIconDropdownOption)(intl, dispatchCommand, option);
          })
        });
      }

      var title = intl.formatMessage(currentAppearance ? _messages.messages[currentAppearance] : _messages.messages.url);
      return /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
        key: "link-toolbar",
        buttonTestId: "link-toolbar-appearance-button",
        title: title,
        dispatchCommand: dispatchCommand,
        options: options
      });
    });
    return _this;
  }

  (0, _createClass2.default)(LinkToolbarAppearance, [{
    key: "render",
    value: function render() {
      var cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
      var editorView = this.props.editorView;
      return this.renderDropdown(editorView, cardContext && cardContext.value);
    }
  }]);
  return LinkToolbarAppearance;
}(_react.default.Component);

exports.LinkToolbarAppearance = LinkToolbarAppearance;
(0, _defineProperty2.default)(LinkToolbarAppearance, "contextTypes", {
  contextAdapter: _propTypes.default.object
});

var getUnavailableMessage = function getUnavailableMessage(state, intl) {
  try {
    var parentNode = state.selection.$from.node(1);
    var parentName = intl.formatMessage(_messages2.default[parentNode.type.name]);
    var tooltip = intl.formatMessage(_messages.messages.displayOptionUnavailableInParentNode, {
      node: parentName
    });
    return tooltip;
  } catch (e) {
    return intl.formatMessage(_messages.messages.displayOptionUnavailableInParentNode, {
      node: intl.formatMessage(_messages2.default.defaultBlockNode)
    });
  }
};