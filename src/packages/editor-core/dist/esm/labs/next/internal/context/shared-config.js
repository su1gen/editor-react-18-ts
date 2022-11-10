import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import PropTypes from 'prop-types';
var EditorSharedConfigContext = /*#__PURE__*/React.createContext(null);
export var EditorSharedConfigProvider = /*#__PURE__*/function (_React$Component) {
  _inherits(EditorSharedConfigProvider, _React$Component);

  var _super = _createSuper(EditorSharedConfigProvider);

  function EditorSharedConfigProvider() {
    _classCallCheck(this, EditorSharedConfigProvider);

    return _super.apply(this, arguments);
  }

  _createClass(EditorSharedConfigProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        editorSharedConfig: this.props.value
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(EditorSharedConfigContext.Provider, {
        value: this.props.value
      }, this.props.children);
    }
  }]);

  return EditorSharedConfigProvider;
}(React.Component);

_defineProperty(EditorSharedConfigProvider, "childContextTypes", {
  editorSharedConfig: PropTypes.object
});

export var EditorSharedConfigConsumer = /*#__PURE__*/function (_React$Component2) {
  _inherits(EditorSharedConfigConsumer, _React$Component2);

  var _super2 = _createSuper(EditorSharedConfigConsumer);

  function EditorSharedConfigConsumer() {
    _classCallCheck(this, EditorSharedConfigConsumer);

    return _super2.apply(this, arguments);
  }

  _createClass(EditorSharedConfigConsumer, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/React.createElement(EditorSharedConfigContext.Consumer, null, function (value) {
        return _this.props.children(_this.context.editorSharedConfig || value);
      });
    }
  }]);

  return EditorSharedConfigConsumer;
}(React.Component);

_defineProperty(EditorSharedConfigConsumer, "contextTypes", {
  editorSharedConfig: PropTypes.object
});

export var useEditorSharedConfig = function useEditorSharedConfig() {
  return React.useContext(EditorSharedConfigContext);
};