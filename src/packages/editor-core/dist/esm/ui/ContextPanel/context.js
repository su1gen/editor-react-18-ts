import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react'; // React context to communicate the active context panel width up and down the tree.
//
// We need the width prop from the ContextPanel component.
//
// However, the actual <ContextPanel /> component might be deeply nested inside the contextPanel.
// For example, in the template context panel storybook, we wrap it in 2 higher order components.
//
// Changing the max-width on the main editor container happens above where the <ContextPanel /> gets rendered.
//
// To subtract the context panel width from the available real estate, we use the Provider and Consumer.
//
// positionedOverEditor is used to determine whether the context panel is positioned over the Editor so we are
// able to position and add margins to handle certain elements like inline comment dialogues overlapping the context
// panel

var _React$createContext = /*#__PURE__*/React.createContext({
  width: 0,
  positionedOverEditor: false,
  broadcastWidth: function broadcastWidth() {},
  broadcastPosition: function broadcastPosition() {}
}),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

export var ContextPanelWidthProvider = /*#__PURE__*/function (_React$Component) {
  _inherits(ContextPanelWidthProvider, _React$Component);

  var _super = _createSuper(ContextPanelWidthProvider);

  function ContextPanelWidthProvider(props) {
    var _this;

    _classCallCheck(this, ContextPanelWidthProvider);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      width: 0,
      positionedOverEditor: false
    });

    _defineProperty(_assertThisInitialized(_this), "broadcastSidebarWidth", function (width) {
      if (width !== _this.state.width) {
        _this.setState({
          width: width
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "broadcastPosition", function (positionedOverEditor) {
      if (positionedOverEditor !== _this.state.positionedOverEditor) {
        _this.setState({
          positionedOverEditor: positionedOverEditor
        });
      }
    });

    return _this;
  }

  _createClass(ContextPanelWidthProvider, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          width = _this$state.width,
          positionedOverEditor = _this$state.positionedOverEditor;
      return /*#__PURE__*/React.createElement(Provider, {
        value: {
          width: width,
          positionedOverEditor: positionedOverEditor,
          broadcastWidth: this.broadcastSidebarWidth,
          broadcastPosition: this.broadcastPosition
        }
      }, this.props.children);
    }
  }]);

  return ContextPanelWidthProvider;
}(React.Component);
export { Provider as ContextPanelProvider, Consumer as ContextPanelConsumer };