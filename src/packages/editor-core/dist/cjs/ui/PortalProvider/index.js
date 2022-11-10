"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortalRenderer = exports.PortalProviderWithThemeProviders = exports.PortalProviderAPI = exports.PortalProvider = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _analyticsNextStableReactContext = _interopRequireDefault(require("@atlaskit/analytics-next-stable-react-context"));

var _eventDispatcher = require("../../event-dispatcher");

var _enums = require("../../plugins/analytics/types/enums");

var _reactIntlNext = require("react-intl-next");

var _components = require("@atlaskit/theme/components");

var _PortalProviderThemesProvider = require("./PortalProviderThemesProvider");

var _ui = require("@atlaskit/editor-common/ui");

var _class;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PortalProviderAPI = /*#__PURE__*/function (_EventDispatcher) {
  (0, _inherits2.default)(PortalProviderAPI, _EventDispatcher);

  var _super = _createSuper(PortalProviderAPI);

  function PortalProviderAPI(intl, onAnalyticsEvent, analyticsContext, themeMode) {
    var _this;

    (0, _classCallCheck2.default)(this, PortalProviderAPI);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "portals", new Map());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setContext", function (context) {
      _this.context = context;
    });
    _this.intl = intl;
    _this.onAnalyticsEvent = onAnalyticsEvent;
    _this.useAnalyticsContext = analyticsContext;
    _this.themeMode = themeMode;
    return _this;
  }

  (0, _createClass2.default)(PortalProviderAPI, [{
    key: "render",
    value: function render(children, container) {
      var hasAnalyticsContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var hasIntlContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.portals.set(container, {
        children: children,
        hasAnalyticsContext: hasAnalyticsContext,
        hasIntlContext: hasIntlContext
      });

      var childrenWithThemeProviders = /*#__PURE__*/_react.default.createElement(_PortalProviderThemesProvider.PortalProviderThemeProviders, {
        mode: this.themeMode
      }, children());

      var wrappedChildren = this.useAnalyticsContext ? /*#__PURE__*/_react.default.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders) : childrenWithThemeProviders;

      if (hasIntlContext) {
        wrappedChildren = /*#__PURE__*/_react.default.createElement(_reactIntlNext.RawIntlProvider, {
          value: this.intl
        }, wrappedChildren);
      }

      (0, _reactDom.unstable_renderSubtreeIntoContainer)(this.context, wrappedChildren, container);
    } // TODO: until https://product-fabric.atlassian.net/browse/ED-5013
    // we (unfortunately) need to re-render to pass down any updated context.
    // selectively do this for nodeviews that opt-in via `hasAnalyticsContext`

  }, {
    key: "forceUpdate",
    value: function forceUpdate(_ref) {
      var _this2 = this;

      var intl = _ref.intl,
          themeMode = _ref.themeMode;
      this.intl = intl;
      this.themeMode = themeMode;
      this.portals.forEach(function (portal, container) {
        if (!portal.hasAnalyticsContext && !_this2.useAnalyticsContext && !portal.hasIntlContext) {
          return;
        }

        var wrappedChildren = portal.children();

        var childrenWithThemeProviders = /*#__PURE__*/_react.default.createElement(_PortalProviderThemesProvider.PortalProviderThemeProviders, {
          mode: themeMode
        }, wrappedChildren);

        if (portal.hasAnalyticsContext && _this2.useAnalyticsContext) {
          wrappedChildren = /*#__PURE__*/_react.default.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders);
        }

        if (portal.hasIntlContext) {
          wrappedChildren = /*#__PURE__*/_react.default.createElement(_reactIntlNext.RawIntlProvider, {
            value: _this2.intl
          }, childrenWithThemeProviders);
        }

        (0, _reactDom.unstable_renderSubtreeIntoContainer)(_this2.context, wrappedChildren, container);
      });
    }
  }, {
    key: "remove",
    value: function remove(container) {
      this.portals.delete(container); // There is a race condition that can happen caused by Prosemirror vs React,
      // where Prosemirror removes the container from the DOM before React gets
      // around to removing the child from the container
      // This will throw a NotFoundError: The node to be removed is not a child of this node
      // Both Prosemirror and React remove the elements asynchronously, and in edge
      // cases Prosemirror beats React

      try {
        (0, _reactDom.unmountComponentAtNode)(container);
      } catch (error) {
        if (this.onAnalyticsEvent) {
          this.onAnalyticsEvent({
            payload: {
              action: _enums.ACTION.FAILED_TO_UNMOUNT,
              actionSubject: _enums.ACTION_SUBJECT.EDITOR,
              actionSubjectId: _enums.ACTION_SUBJECT_ID.REACT_NODE_VIEW,
              attributes: {
                error: error,
                domNodes: {
                  container: container ? container.className : undefined,
                  child: container.firstElementChild ? container.firstElementChild.className : undefined
                }
              },
              eventType: _enums.EVENT_TYPE.OPERATIONAL
            }
          });
        }
      }
    }
  }]);
  return PortalProviderAPI;
}(_eventDispatcher.EventDispatcher);

exports.PortalProviderAPI = PortalProviderAPI;

var BasePortalProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(BasePortalProvider, _React$Component);

  var _super2 = _createSuper(BasePortalProvider);

  function BasePortalProvider(props) {
    var _this3;

    (0, _classCallCheck2.default)(this, BasePortalProvider);
    _this3 = _super2.call(this, props);
    _this3.portalProviderAPI = new PortalProviderAPI(props.intl, props.onAnalyticsEvent, props.useAnalyticsContext, props.themeMode);
    return _this3;
  }

  (0, _createClass2.default)(BasePortalProvider, [{
    key: "render",
    value: function render() {
      return this.props.render(this.portalProviderAPI);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.portalProviderAPI.forceUpdate({
        intl: this.props.intl,
        themeMode: this.props.themeMode
      });
    }
  }]);
  return BasePortalProvider;
}(_react.default.Component);

(0, _defineProperty2.default)(BasePortalProvider, "displayName", 'PortalProvider');
var PortalProvider = (0, _reactIntlNext.injectIntl)(BasePortalProvider);
exports.PortalProvider = PortalProvider;

var PortalProviderWithThemeProviders = function PortalProviderWithThemeProviders(_ref2) {
  var onAnalyticsEvent = _ref2.onAnalyticsEvent,
      useAnalyticsContext = _ref2.useAnalyticsContext,
      render = _ref2.render;
  return /*#__PURE__*/_react.default.createElement(_ui.IntlProviderIfMissingWrapper, null, /*#__PURE__*/_react.default.createElement(PortalProviderWithThemeAndIntlProviders, {
    onAnalyticsEvent: onAnalyticsEvent,
    useAnalyticsContext: useAnalyticsContext,
    render: render
  }));
};

exports.PortalProviderWithThemeProviders = PortalProviderWithThemeProviders;

var PortalProviderWithThemeAndIntlProviders = function PortalProviderWithThemeAndIntlProviders(_ref3) {
  var onAnalyticsEvent = _ref3.onAnalyticsEvent,
      useAnalyticsContext = _ref3.useAnalyticsContext,
      render = _ref3.render;
  var intl = (0, _reactIntlNext.useIntl)();
  var globalTheme = (0, _components.useGlobalTheme)();
  return /*#__PURE__*/_react.default.createElement(BasePortalProvider, {
    intl: intl,
    themeMode: globalTheme.mode,
    onAnalyticsEvent: onAnalyticsEvent,
    useAnalyticsContext: useAnalyticsContext,
    render: render
  });
};

var PortalRenderer = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2.default)(PortalRenderer, _React$Component2);

  var _super3 = _createSuper(PortalRenderer);

  function PortalRenderer(props) {
    var _this4;

    (0, _classCallCheck2.default)(this, PortalRenderer);
    _this4 = _super3.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "handleUpdate", function (portals) {
      return _this4.setState({
        portals: portals
      });
    });
    props.portalProviderAPI.setContext((0, _assertThisInitialized2.default)(_this4));
    props.portalProviderAPI.on('update', _this4.handleUpdate);
    _this4.state = {
      portals: new Map()
    };
    return _this4;
  }

  (0, _createClass2.default)(PortalRenderer, [{
    key: "render",
    value: function render() {
      var portals = this.state.portals;
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Array.from(portals.entries()).map(function (_ref4) {
        var _ref5 = (0, _slicedToArray2.default)(_ref4, 2),
            container = _ref5[0],
            children = _ref5[1];

        return /*#__PURE__*/(0, _reactDom.createPortal)(children, container);
      }));
    }
  }]);
  return PortalRenderer;
}(_react.default.Component);
/**
 * Wrapper to re-provide modern analytics context to ReactNodeViews.
 */


exports.PortalRenderer = PortalRenderer;
var dummyAnalyticsContext = {
  getAtlaskitAnalyticsContext: function getAtlaskitAnalyticsContext() {},
  getAtlaskitAnalyticsEventHandlers: function getAtlaskitAnalyticsEventHandlers() {}
};
var AnalyticsContextWrapper = (_class = /*#__PURE__*/function (_React$Component3) {
  (0, _inherits2.default)(AnalyticsContextWrapper, _React$Component3);

  var _super4 = _createSuper(AnalyticsContextWrapper);

  function AnalyticsContextWrapper() {
    (0, _classCallCheck2.default)(this, AnalyticsContextWrapper);
    return _super4.apply(this, arguments);
  }

  (0, _createClass2.default)(AnalyticsContextWrapper, [{
    key: "render",
    value: function render() {
      var _ref6 = this.context.contextAdapter.analytics || {
        value: dummyAnalyticsContext
      },
          value = _ref6.value;

      return /*#__PURE__*/_react.default.createElement(_analyticsNextStableReactContext.default.Provider, {
        value: value
      }, this.props.children);
    }
  }]);
  return AnalyticsContextWrapper;
}(_react.default.Component), (0, _defineProperty2.default)(_class, "contextTypes", {
  contextAdapter: _propTypes.default.object
}), _class);