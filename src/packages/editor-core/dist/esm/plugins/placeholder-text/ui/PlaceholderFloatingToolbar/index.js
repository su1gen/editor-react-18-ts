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
import { defineMessages, injectIntl } from 'react-intl-next';
import PanelTextInput from '../../../../ui/PanelTextInput';
import FloatingToolbar, { handlePositionCalculatedWith, getOffsetParent, getNearestNonTextNode } from '../../../../ui/FloatingToolbar';
export var messages = defineMessages({
  placeholderTextPlaceholder: {
    id: 'fabric.editor.placeholderTextPlaceholder',
    defaultMessage: 'Add placeholder text',
    description: ''
  }
});

var PlaceholderFloatingToolbar = /*#__PURE__*/function (_React$Component) {
  _inherits(PlaceholderFloatingToolbar, _React$Component);

  var _super = _createSuper(PlaceholderFloatingToolbar);

  function PlaceholderFloatingToolbar() {
    var _this;

    _classCallCheck(this, PlaceholderFloatingToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", function (value) {
      if (value) {
        _this.props.insertPlaceholder(value);

        _this.props.setFocusInEditor();
      } else {
        _this.props.hidePlaceholderFloatingToolbar();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleBlur", function () {
      _this.props.hidePlaceholderFloatingToolbar();
    });

    return _this;
  }

  _createClass(PlaceholderFloatingToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          getNodeFromPos = _this$props.getNodeFromPos,
          showInsertPanelAt = _this$props.showInsertPanelAt,
          editorViewDOM = _this$props.editorViewDOM,
          popupsMountPoint = _this$props.popupsMountPoint,
          getFixedCoordinatesFromPos = _this$props.getFixedCoordinatesFromPos,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          formatMessage = _this$props.intl.formatMessage;
      var target = getNodeFromPos(showInsertPanelAt);
      var offsetParent = getOffsetParent(editorViewDOM, popupsMountPoint);

      var getFixedCoordinates = function getFixedCoordinates() {
        return getFixedCoordinatesFromPos(showInsertPanelAt);
      };

      var handlePositionCalculated = handlePositionCalculatedWith(offsetParent, target, getFixedCoordinates);
      return /*#__PURE__*/React.createElement(FloatingToolbar, {
        target: getNearestNonTextNode(target),
        onPositionCalculated: handlePositionCalculated,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        fitHeight: 32,
        offset: [0, 12]
      }, /*#__PURE__*/React.createElement(PanelTextInput, {
        placeholder: formatMessage(messages.placeholderTextPlaceholder),
        onSubmit: this.handleSubmit,
        onBlur: this.handleBlur,
        autoFocus: true,
        width: 300
      }));
    }
  }]);

  return PlaceholderFloatingToolbar;
}(React.Component);

export default injectIntl(PlaceholderFloatingToolbar);