import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { ACTION_SUBJECT } from '../../plugins/analytics';
import { whichTransitionEvent } from '../../utils';
import { ErrorBoundary } from '../ErrorBoundary';
var pluginsComponentsWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n"])));

var PluginSlot = /*#__PURE__*/function (_React$Component) {
  _inherits(PluginSlot, _React$Component);

  var _super = _createSuper(PluginSlot);

  function PluginSlot() {
    var _this;

    _classCallCheck(this, PluginSlot);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "transitionEvent", whichTransitionEvent());

    _defineProperty(_assertThisInitialized(_this), "forceComponentUpdate", function (event) {
      // Only trigger an update if the transition is on a property containing `width`
      // This will cater for media and the content area itself currently.
      if (event.propertyName.includes('width')) {
        _this.forceUpdate();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "removeModeChangeListener", function (contentArea) {
      if (contentArea && _this.transitionEvent) {
        contentArea.removeEventListener(_this.transitionEvent, _this.forceComponentUpdate);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addModeChangeListener", function (contentArea) {
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

  _createClass(PluginSlot, [{
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

      return jsx(ErrorBoundary, {
        component: ACTION_SUBJECT.PLUGIN_SLOT,
        fallbackComponent: null
      }, jsx("div", {
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
        return element && /*#__PURE__*/React.cloneElement(element, props);
      })));
    }
  }]);

  return PluginSlot;
}(React.Component);

_defineProperty(PluginSlot, "displayName", 'PluginSlot');

export { PluginSlot as default };