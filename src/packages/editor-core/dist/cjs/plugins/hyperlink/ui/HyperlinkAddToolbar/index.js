"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _HyperlinkAddToolbar = _interopRequireDefault(require("./HyperlinkAddToolbar"));

var _analytics = require("../../../analytics");

var _main = require("../../pm-plugins/main");

var _WithPluginState = _interopRequireDefault(require("../../../../ui/WithPluginState"));

var _featureFlagsContext = require("../../../feature-flags-context");

var _EditorLinkPicker = require("../EditorLinkPicker");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Wraps around the editor's onSubmit handler so that the plugin can interface with the link picker
 */
var onSubmitInterface = function onSubmitInterface(onSubmit) {
  return function (_ref) {
    var url = _ref.url,
        title = _ref.title,
        displayText = _ref.displayText,
        rawUrl = _ref.rawUrl,
        meta = _ref.meta;
    onSubmit(url, title !== null && title !== void 0 ? title : rawUrl, displayText || undefined, meta.inputMethod === 'manual' ? _analytics.INPUT_METHOD.MANUAL : _analytics.INPUT_METHOD.TYPEAHEAD);
  };
};

var HyperlinkAddToolbar = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(HyperlinkAddToolbar, _React$PureComponent);

  var _super = _createSuper(HyperlinkAddToolbar);

  function HyperlinkAddToolbar() {
    (0, _classCallCheck2.default)(this, HyperlinkAddToolbar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(HyperlinkAddToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$linkPicke = _this$props.linkPickerOptions,
          linkPickerOptions = _this$props$linkPicke === void 0 ? {} : _this$props$linkPicke,
          onSubmit = _this$props.onSubmit,
          displayText = _this$props.displayText,
          displayUrl = _this$props.displayUrl,
          providerFactory = _this$props.providerFactory,
          view = _this$props.view;
      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providers: ['activityProvider', 'searchProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref2) {
          var activityProvider = _ref2.activityProvider,
              searchProvider = _ref2.searchProvider;
          return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
            editorView: view,
            plugins: {
              hyperlinkPluginState: _main.stateKey
            },
            render: function render(_ref3) {
              var _linkPickerOptions$pl;

              var hyperlinkPluginState = _ref3.hyperlinkPluginState;

              var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(view.state),
                  lpLinkPicker = _getFeatureFlags.lpLinkPicker;
              /**
               * If activityProvider or searchProvider are present then only enable if there are plugins supplied to
               * faciliate providing link search capabilities
               */


              if (lpLinkPicker && (!activityProvider && !searchProvider || Boolean(linkPickerOptions === null || linkPickerOptions === void 0 ? void 0 : (_linkPickerOptions$pl = linkPickerOptions.plugins) === null || _linkPickerOptions$pl === void 0 ? void 0 : _linkPickerOptions$pl.length))) {
                return /*#__PURE__*/_react.default.createElement(_EditorLinkPicker.EditorLinkPicker, (0, _extends2.default)({
                  view: view
                }, linkPickerOptions, {
                  url: displayUrl,
                  displayText: displayText,
                  onSubmit: onSubmitInterface(onSubmit)
                }));
              }

              return /*#__PURE__*/_react.default.createElement(_HyperlinkAddToolbar.default, {
                activityProvider: activityProvider,
                searchProvider: searchProvider,
                onSubmit: onSubmit,
                displayText: displayText,
                displayUrl: displayUrl,
                pluginState: hyperlinkPluginState,
                view: view
              });
            }
          });
        }
      });
    }
  }]);
  return HyperlinkAddToolbar;
}(_react.default.PureComponent);

exports.default = HyperlinkAddToolbar;