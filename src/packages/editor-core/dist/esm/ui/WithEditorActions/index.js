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

var WithEditorActions = /*#__PURE__*/function (_React$Component) {
  _inherits(WithEditorActions, _React$Component);

  var _super = _createSuper(WithEditorActions);

  function WithEditorActions() {
    var _this;

    _classCallCheck(this, WithEditorActions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onContextUpdate", function () {
      // Re-render actions when editorActions changes...
      _this.forceUpdate();
    });

    return _this;
  }

  _createClass(WithEditorActions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.editorActions._privateSubscribe(this.onContextUpdate);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.editorActions._privateUnsubscribe(this.onContextUpdate);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.render(this.context.editorActions);
    }
  }]);

  return WithEditorActions;
}(React.Component);

_defineProperty(WithEditorActions, "contextTypes", {
  editorActions: PropTypes.object.isRequired
});

export { WithEditorActions as default };