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
import EditorActions from '../../actions';
var EditorContext = /*#__PURE__*/React.createContext({});
export var useEditorContext = function useEditorContext() {
  return React.useContext(EditorContext);
};

var LegacyEditorContext = /*#__PURE__*/function (_React$Component) {
  _inherits(LegacyEditorContext, _React$Component);

  var _super = _createSuper(LegacyEditorContext);

  function LegacyEditorContext(props) {
    var _this;

    _classCallCheck(this, LegacyEditorContext);

    _this = _super.call(this, props);
    _this.editorActions = props.editorActions || new EditorActions();
    return _this;
  }

  _createClass(LegacyEditorContext, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        editorActions: this.editorActions
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(EditorContext.Provider, {
        value: this.getChildContext()
      }, this.props.children);
    }
  }]);

  return LegacyEditorContext;
}(React.Component);

_defineProperty(LegacyEditorContext, "childContextTypes", {
  editorActions: PropTypes.object
});

export { LegacyEditorContext as default };