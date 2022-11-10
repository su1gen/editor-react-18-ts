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
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { Popup } from '@atlaskit/editor-common/ui';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status/picker';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N0 } from '@atlaskit/theme/colors';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { DEFAULT_STATUS } from '../actions';
import { analyticsState, createStatusAnalyticsAndFire } from '../analytics';
import { token } from '@atlaskit/tokens';
var PopupWithListeners = withOuterListeners(Popup);
export var InputMethod;

(function (InputMethod) {
  InputMethod["blur"] = "blur";
  InputMethod["escKey"] = "escKey";
  InputMethod["enterKey"] = "enterKey";
})(InputMethod || (InputMethod = {}));

var pickerContainer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: ", ";\n  padding: ", "px 0;\n  border-radius: ", "px;\n  box-shadow: ", ";\n  input {\n    text-transform: uppercase;\n  }\n"])), token('elevation.surface.overlay', N0), gridSize(), borderRadius(), token('elevation.shadow.overlay', '0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)'));
export var StatusPickerWithoutAnalytcs = /*#__PURE__*/function (_React$Component) {
  _inherits(StatusPickerWithoutAnalytcs, _React$Component);

  var _super = _createSuper(StatusPickerWithoutAnalytcs);

  function StatusPickerWithoutAnalytcs(props) {
    var _this;

    _classCallCheck(this, StatusPickerWithoutAnalytcs);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleClickOutside", function (event) {
      event.preventDefault();
      _this.inputMethod = InputMethod.blur;
      var selectedText = window.getSelection();

      if (!selectedText) {
        _this.props.closeStatusPicker();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleEscapeKeydown", function (event) {
      event.preventDefault();
      _this.inputMethod = InputMethod.escKey;

      _this.props.onEnter(_this.state);
    });

    _defineProperty(_assertThisInitialized(_this), "onColorHover", function (color) {
      _this.createStatusAnalyticsAndFireFunc({
        action: 'hovered',
        actionSubject: 'statusColorPicker',
        attributes: {
          color: color,
          localId: _this.state.localId,
          state: analyticsState(_this.props.isNew)
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onColorClick", function (color) {
      var _this$state = _this.state,
          text = _this$state.text,
          localId = _this$state.localId;

      if (color === _this.state.color) {
        _this.createStatusAnalyticsAndFireFunc({
          action: 'clicked',
          actionSubject: 'statusColorPicker',
          attributes: {
            color: color,
            localId: localId,
            state: analyticsState(_this.props.isNew)
          }
        }); // closes status box and commits colour


        _this.onEnter();
      } else {
        _this.setState({
          color: color
        });

        _this.props.onSelect({
          text: text,
          color: color,
          localId: localId
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onTextChanged", function (text) {
      var _this$state2 = _this.state,
          color = _this$state2.color,
          localId = _this$state2.localId;

      _this.setState({
        text: text
      });

      _this.props.onTextChanged({
        text: text,
        color: color,
        localId: localId
      }, !!_this.props.isNew);
    });

    _defineProperty(_assertThisInitialized(_this), "onEnter", function () {
      _this.inputMethod = InputMethod.enterKey;

      _this.props.onEnter(_this.state);
    });

    _defineProperty(_assertThisInitialized(_this), "handlePopupClick", function (event) {
      return event.nativeEvent.stopImmediatePropagation();
    });

    _this.state = _this.extractStateFromProps(props);
    _this.createStatusAnalyticsAndFireFunc = createStatusAnalyticsAndFire(props.createAnalyticsEvent);
    return _this;
  }

  _createClass(StatusPickerWithoutAnalytcs, [{
    key: "fireStatusPopupOpenedAnalytics",
    value: function fireStatusPopupOpenedAnalytics(state) {
      var color = state.color,
          text = state.text,
          localId = state.localId,
          isNew = state.isNew;
      this.startTime = Date.now();
      this.createStatusAnalyticsAndFireFunc({
        action: 'opened',
        actionSubject: 'statusPopup',
        attributes: {
          textLength: text ? text.length : 0,
          selectedColor: color,
          localId: localId,
          state: analyticsState(isNew)
        }
      });
    }
  }, {
    key: "fireStatusPopupClosedAnalytics",
    value: function fireStatusPopupClosedAnalytics(state) {
      var color = state.color,
          text = state.text,
          localId = state.localId,
          isNew = state.isNew;
      this.createStatusAnalyticsAndFireFunc({
        action: 'closed',
        actionSubject: 'statusPopup',
        attributes: {
          inputMethod: this.inputMethod,
          duration: Date.now() - this.startTime,
          textLength: text ? text.length : 0,
          selectedColor: color,
          localId: localId,
          state: analyticsState(isNew)
        }
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.startTime = Date.now();
      this.inputMethod = InputMethod.blur;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.reset();
      this.fireStatusPopupOpenedAnalytics(this.state);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.fireStatusPopupClosedAnalytics(this.state);
      this.startTime = 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, _snapshot) {
      var element = this.props.target;

      if (prevProps.target !== element) {
        var newState = this.extractStateFromProps(this.props);
        this.setState(newState);
        this.fireStatusPopupClosedAnalytics(prevState);
        this.reset();
        this.fireStatusPopupOpenedAnalytics(newState);
      }
    }
  }, {
    key: "extractStateFromProps",
    value: function extractStateFromProps(props) {
      var defaultColor = props.defaultColor,
          defaultText = props.defaultText,
          defaultLocalId = props.defaultLocalId,
          isNew = props.isNew;
      return {
        color: defaultColor || DEFAULT_STATUS.color,
        text: defaultText || DEFAULT_STATUS.text,
        localId: defaultLocalId,
        isNew: isNew
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isNew = _this$props.isNew,
          target = _this$props.target;
      var _this$state3 = this.state,
          color = _this$state3.color,
          text = _this$state3.text;
      return target && jsx(PopupWithListeners, {
        target: target,
        offset: [0, 8],
        handleClickOutside: this.handleClickOutside,
        handleEscapeKeydown: this.handleEscapeKeydown,
        zIndex: akEditorFloatingDialogZIndex,
        fitHeight: 40
      }, jsx("div", {
        css: pickerContainer,
        onClick: this.handlePopupClick
      }, jsx(AkStatusPicker, {
        autoFocus: isNew,
        selectedColor: color,
        text: text,
        onColorClick: this.onColorClick,
        onColorHover: this.onColorHover,
        onTextChanged: this.onTextChanged,
        onEnter: this.onEnter
      })));
    }
  }]);

  return StatusPickerWithoutAnalytcs;
}(React.Component);
export default withAnalyticsEvents()(StatusPickerWithoutAnalytcs);