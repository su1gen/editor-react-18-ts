"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _analytics = require("../../plugins/analytics");

var _utils = require("../../utils");

var _ErrorBoundary = require("../ErrorBoundary");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var pluginsComponentsWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));

var PluginSlot = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(PluginSlot, _React$Component);

  var _super = _createSuper(PluginSlot);

  function PluginSlot() {
    var _this;

    (0, _classCallCheck2.default)(this, PluginSlot);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "transitionEvent", (0, _utils.whichTransitionEvent)());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "forceComponentUpdate", function (event) {
      // Only trigger an update if the transition is on a property containing `width`
      // This will cater for media and the content area itself currently.
      if (event.propertyName.includes('width')) {
        _this.forceUpdate();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "removeModeChangeListener", function (contentArea) {
      if (contentArea && _this.transitionEvent) {
        contentArea.removeEventListener(_this.transitionEvent, _this.forceComponentUpdate);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addModeChangeListener", function (contentArea) {
      if (contentArea && _this.transitionEvent) {
        /**
         * Update the plugin components once the transition
         * to full width / default mode completes
         */
        contentArea.addEventListener(_this.transitionEvent, _this.forceComponentUpdate);
      }
    });
    return _this;
  }

  (0, _createClass2.default)(PluginSlot, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this$props = this.props,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          items = _this$props.items,
          providerFactory = _this$props.providerFactory,
          eventDispatcher = _this$props.eventDispatcher,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          containerElement = _this$props.containerElement,
          disabled = _this$props.disabled,
          wrapperElement = _this$props.wrapperElement;
      return !(nextProps.editorView === editorView && nextProps.editorActions === editorActions && nextProps.items === items && nextProps.providerFactory === providerFactory && nextProps.eventDispatcher === eventDispatcher && nextProps.popupsMountPoint === popupsMountPoint && nextProps.popupsBoundariesElement === popupsBoundariesElement && nextProps.popupsScrollableElement === popupsScrollableElement && nextProps.containerElement === containerElement && nextProps.disabled === disabled && nextProps.wrapperElement === wrapperElement);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.addModeChangeListener(this.props.contentArea);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.contentArea !== nextProps.contentArea) {
        this.removeModeChangeListener(this.props.contentArea);
        this.addModeChangeListener(nextProps.contentArea);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeModeChangeListener(this.props.contentArea);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          items = _this$props2.items,
          editorView = _this$props2.editorView,
          editorActions = _this$props2.editorActions,
          eventDispatcher = _this$props2.eventDispatcher,
          providerFactory = _this$props2.providerFactory,
          appearance = _this$props2.appearance,
          popupsMountPoint = _this$props2.popupsMountPoint,
          popupsBoundariesElement = _this$props2.popupsBoundariesElement,
          popupsScrollableElement = _this$props2.popupsScrollableElement,
          containerElement = _this$props2.containerElement,
          disabled = _this$props2.disabled,
          dispatchAnalyticsEvent = _this$props2.dispatchAnalyticsEvent,
          wrapperElement = _this$props2.wrapperElement;

      if (!items || !editorView) {
        return null;
      }

      return (0, _react2.jsx)(_ErrorBoundary.ErrorBoundary, {
        component: _analytics.ACTION_SUBJECT.PLUGIN_SLOT,
        fallbackComponent: null
      }, (0, _react2.jsx)("div", {
        css: pluginsComponentsWrapper
      }, items.map(function (component, key) {
        var props = {
          key: key
        };
        var element = component({
          editorView: editorView,
          editorActions: editorActions,
          eventDispatcher: eventDispatcher,
          providerFactory: providerFactory,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          appearance: appearance,
          popupsMountPoint: popupsMountPoint,
          popupsBoundariesElement: popupsBoundariesElement,
          popupsScrollableElement: popupsScrollableElement,
          containerElement: containerElement,
          disabled: disabled,
          wrapperElement: wrapperElement
        });
        return element && /*#__PURE__*/_react.default.cloneElement(element, props);
      })));
    }
  }]);
  return PluginSlot;
}(_react.default.Component);

exports.default = PluginSlot;
(0, _defineProperty2.default)(PluginSlot, "displayName", 'PluginSlot');