import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _class;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { createPortal, unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';
import { EventDispatcher } from '../../event-dispatcher';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../plugins/analytics/types/enums';
import { useIntl, RawIntlProvider, injectIntl } from 'react-intl-next';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { PortalProviderThemeProviders } from './PortalProviderThemesProvider';
import { IntlProviderIfMissingWrapper } from '@atlaskit/editor-common/ui';
export var PortalProviderAPI = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(PortalProviderAPI, _EventDispatcher);

  var _super = _createSuper(PortalProviderAPI);

  function PortalProviderAPI(intl, onAnalyticsEvent, analyticsContext, themeMode) {
    var _this;

    _classCallCheck(this, PortalProviderAPI);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "portals", new Map());

    _defineProperty(_assertThisInitialized(_this), "setContext", function (context) {
      _this.context = context;
    });

    _this.intl = intl;
    _this.onAnalyticsEvent = onAnalyticsEvent;
    _this.useAnalyticsContext = analyticsContext;
    _this.themeMode = themeMode;
    return _this;
  }

  _createClass(PortalProviderAPI, [{
    key: "render",
    value: function render(children, container) {
      var hasAnalyticsContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var hasIntlContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.portals.set(container, {
        children: children,
        hasAnalyticsContext: hasAnalyticsContext,
        hasIntlContext: hasIntlContext
      });
      var childrenWithThemeProviders = /*#__PURE__*/React.createElement(PortalProviderThemeProviders, {
        mode: this.themeMode
      }, children());
      var wrappedChildren = this.useAnalyticsContext ? /*#__PURE__*/React.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders) : childrenWithThemeProviders;

      if (hasIntlContext) {
        wrappedChildren = /*#__PURE__*/React.createElement(RawIntlProvider, {
          value: this.intl
        }, wrappedChildren);
      }

      unstable_renderSubtreeIntoContainer(this.context, wrappedChildren, container);
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
        var childrenWithThemeProviders = /*#__PURE__*/React.createElement(PortalProviderThemeProviders, {
          mode: themeMode
        }, wrappedChildren);

        if (portal.hasAnalyticsContext && _this2.useAnalyticsContext) {
          wrappedChildren = /*#__PURE__*/React.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders);
        }

        if (portal.hasIntlContext) {
          wrappedChildren = /*#__PURE__*/React.createElement(RawIntlProvider, {
            value: _this2.intl
          }, childrenWithThemeProviders);
        }

        unstable_renderSubtreeIntoContainer(_this2.context, wrappedChildren, container);
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
        unmountComponentAtNode(container);
      } catch (error) {
        if (this.onAnalyticsEvent) {
          this.onAnalyticsEvent({
            payload: {
              action: ACTION.FAILED_TO_UNMOUNT,
              actionSubject: ACTION_SUBJECT.EDITOR,
              actionSubjectId: ACTION_SUBJECT_ID.REACT_NODE_VIEW,
              attributes: {
                error: error,
                domNodes: {
                  container: container ? container.className : undefined,
                  child: container.firstElementChild ? container.firstElementChild.className : undefined
                }
              },
              eventType: EVENT_TYPE.OPERATIONAL
            }
          });
        }
      }
    }
  }]);

  return PortalProviderAPI;
}(EventDispatcher);

var BasePortalProvider = /*#__PURE__*/function (_React$Component) {
  _inherits(BasePortalProvider, _React$Component);

  var _super2 = _createSuper(BasePortalProvider);

  function BasePortalProvider(props) {
    var _this3;

    _classCallCheck(this, BasePortalProvider);

    _this3 = _super2.call(this, props);
    _this3.portalProviderAPI = new PortalProviderAPI(props.intl, props.onAnalyticsEvent, props.useAnalyticsContext, props.themeMode);
    return _this3;
  }

  _createClass(BasePortalProvider, [{
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
}(React.Component);

_defineProperty(BasePortalProvider, "displayName", 'PortalProvider');

export var PortalProvider = injectIntl(BasePortalProvider);
export var PortalProviderWithThemeProviders = function PortalProviderWithThemeProviders(_ref2) {
  var onAnalyticsEvent = _ref2.onAnalyticsEvent,
      useAnalyticsContext = _ref2.useAnalyticsContext,
      render = _ref2.render;
  return /*#__PURE__*/React.createElement(IntlProviderIfMissingWrapper, null, /*#__PURE__*/React.createElement(PortalProviderWithThemeAndIntlProviders, {
    onAnalyticsEvent: onAnalyticsEvent,
    useAnalyticsContext: useAnalyticsContext,
    render: render
  }));
};

var PortalProviderWithThemeAndIntlProviders = function PortalProviderWithThemeAndIntlProviders(_ref3) {
  var onAnalyticsEvent = _ref3.onAnalyticsEvent,
      useAnalyticsContext = _ref3.useAnalyticsContext,
      render = _ref3.render;
  var intl = useIntl();
  var globalTheme = useGlobalTheme();
  return /*#__PURE__*/React.createElement(BasePortalProvider, {
    intl: intl,
    themeMode: globalTheme.mode,
    onAnalyticsEvent: onAnalyticsEvent,
    useAnalyticsContext: useAnalyticsContext,
    render: render
  });
};

export var PortalRenderer = /*#__PURE__*/function (_React$Component2) {
  _inherits(PortalRenderer, _React$Component2);

  var _super3 = _createSuper(PortalRenderer);

  function PortalRenderer(props) {
    var _this4;

    _classCallCheck(this, PortalRenderer);

    _this4 = _super3.call(this, props);

    _defineProperty(_assertThisInitialized(_this4), "handleUpdate", function (portals) {
      return _this4.setState({
        portals: portals
      });
    });

    props.portalProviderAPI.setContext(_assertThisInitialized(_this4));
    props.portalProviderAPI.on('update', _this4.handleUpdate);
    _this4.state = {
      portals: new Map()
    };
    return _this4;
  }

  _createClass(PortalRenderer, [{
    key: "render",
    value: function render() {
      var portals = this.state.portals;
      return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from(portals.entries()).map(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            container = _ref5[0],
            children = _ref5[1];

        return /*#__PURE__*/createPortal(children, container);
      }));
    }
  }]);

  return PortalRenderer;
}(React.Component);
/**
 * Wrapper to re-provide modern analytics context to ReactNodeViews.
 */

var dummyAnalyticsContext = {
  getAtlaskitAnalyticsContext: function getAtlaskitAnalyticsContext() {},
  getAtlaskitAnalyticsEventHandlers: function getAtlaskitAnalyticsEventHandlers() {}
};
var AnalyticsContextWrapper = (_class = /*#__PURE__*/function (_React$Component3) {
  _inherits(AnalyticsContextWrapper, _React$Component3);

  var _super4 = _createSuper(AnalyticsContextWrapper);

  function AnalyticsContextWrapper() {
    _classCallCheck(this, AnalyticsContextWrapper);

    return _super4.apply(this, arguments);
  }

  _createClass(AnalyticsContextWrapper, [{
    key: "render",
    value: function render() {
      var _ref6 = this.context.contextAdapter.analytics || {
        value: dummyAnalyticsContext
      },
          value = _ref6.value;

      return /*#__PURE__*/React.createElement(AnalyticsReactContext.Provider, {
        value: value
      }, this.props.children);
    }
  }]);

  return AnalyticsContextWrapper;
}(React.Component), _defineProperty(_class, "contextTypes", {
  contextAdapter: PropTypes.object
}), _class);