import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import PropTypes from 'prop-types';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import rafSchedule from 'raf-schd';
import { Card } from './genericCard';
import { registerCard } from '../pm-plugins/actions';
export var InlineCardComponent = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(InlineCardComponent, _React$PureComponent);

  var _super = _createSuper(InlineCardComponent);

  function InlineCardComponent() {
    var _this;

    _classCallCheck(this, InlineCardComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {});

    _defineProperty(_assertThisInitialized(_this), "onResolve", function (data) {
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          view = _this$props.view;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      var title = data.title,
          url = data.url; // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview

      rafSchedule(function () {
        return view.dispatch(registerCard({
          title: title,
          url: url,
          pos: getPos()
        })(view.state.tr));
      })();
    });

    _defineProperty(_assertThisInitialized(_this), "onError", function (data) {
      var url = data.url;

      _this.onResolve({
        url: url
      });
    });

    return _this;
  }

  _createClass(InlineCardComponent, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var view = this.props.view;
      var scrollContainer = findOverflowScrollParent(view.dom);
      this.scrollContainer = scrollContainer || undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          node = _this$props2.node,
          cardContext = _this$props2.cardContext,
          useAlternativePreloader = _this$props2.useAlternativePreloader;
      var _node$attrs = node.attrs,
          url = _node$attrs.url,
          data = _node$attrs.data;
      var card = /*#__PURE__*/React.createElement("span", {
        className: "card"
      }, /*#__PURE__*/React.createElement(SmartCard, {
        key: url,
        url: url,
        data: data,
        appearance: "inline",
        onClick: this.onClick,
        container: this.scrollContainer,
        onResolve: this.onResolve,
        onError: this.onError,
        inlinePreloaderStyle: useAlternativePreloader ? 'on-right-without-skeleton' : undefined
      })); // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
      // otherwise if we got data, we can render the card directly since it doesn't need the Provider

      return cardContext && cardContext.value ? /*#__PURE__*/React.createElement(cardContext.Provider, {
        value: cardContext.value
      }, card) : data ? card : null;
    }
  }]);

  return InlineCardComponent;
}(React.PureComponent);

_defineProperty(InlineCardComponent, "contextTypes", {
  contextAdapter: PropTypes.object
});

var WrappedInlineCard = Card(InlineCardComponent, UnsupportedInline);
export function InlineCardNodeView(props) {
  var useAlternativePreloader = props.useAlternativePreloader,
      node = props.node,
      view = props.view,
      getPos = props.getPos;
  return /*#__PURE__*/React.createElement(WrappedInlineCard, {
    node: node,
    view: view,
    getPos: getPos,
    useAlternativePreloader: useAlternativePreloader
  });
}