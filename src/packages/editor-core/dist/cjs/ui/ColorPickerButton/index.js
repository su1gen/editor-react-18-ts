"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _ui = require("@atlaskit/editor-common/ui");

var _button = _interopRequireDefault(require("@atlaskit/button"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _colors = require("@atlaskit/theme/colors");

var _constants = require("@atlaskit/theme/constants");

var _ColorPalette = _interopRequireDefault(require("../ColorPalette"));

var _common = require("../ColorPalette/Palettes/common");

var _analyticsNext = require("@atlaskit/analytics-next");

var _consts = require("../../plugins/analytics/consts");

var _types = require("../../plugins/analytics/types");

var _templateObject, _templateObject2;

// helps adjusts position of popup
var colorPickerButtonWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n"]))); // Control the size of color picker buttons and preview

var colorPickerWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  border-radius: ", "px;\n  background-color: white;\n  box-shadow: 0 4px 8px -2px ", ", 0 0 1px ", ";\n  padding: 8px 0px;\n"])), (0, _constants.borderRadius)(), _colors.N60A, _colors.N60A);

var ColorPickerButton = function ColorPickerButton(props) {
  var _props$size, _props$size2;

  var buttonRef = _react.default.useRef(null);

  var _React$useState = _react.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      isPopupOpen = _React$useState2[0],
      setIsPopupOpen = _React$useState2[1];

  var togglePopup = function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  };

  _react.default.useEffect(function () {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [isPopupOpen]);

  var ColorPaletteWithListeners = (0, _ui.withOuterListeners)(_ColorPalette.default);

  var onColorSelected = function onColorSelected(color, label) {
    setIsPopupOpen(false);

    if (props.onChange) {
      if (props.createAnalyticsEvent) {
        // fire analytics
        var payload = {
          action: _types.ACTION.UPDATED,
          actionSubject: _types.ACTION_SUBJECT.PICKER,
          actionSubjectId: _types.ACTION_SUBJECT_ID.PICKER_COLOR,
          attributes: {
            color: color,
            label: label,
            placement: props.placement
          },
          eventType: _types.EVENT_TYPE.TRACK
        };
        props.createAnalyticsEvent(payload).fire(_consts.editorAnalyticsChannel);
      }

      var newPalette = props.colorPalette.find(function (colorPalette) {
        return colorPalette.value === color;
      });
      newPalette && props.onChange(newPalette);
    }
  };

  var renderPopup = function renderPopup() {
    if (!isPopupOpen || !buttonRef.current) {
      return;
    }

    return (0, _react2.jsx)(_ui.Popup, {
      target: buttonRef.current,
      fitHeight: 350,
      fitWidth: 350,
      offset: [0, 10],
      alignX: props.alignX,
      mountTo: props.setDisableParentScroll ? props.mountPoint : undefined // Confluence inline comment editor has z-index: 500
      // if the toolbar is scrollable, this will be mounted in the root editor
      // we need an index of > 500 to display over it
      ,
      zIndex: props.setDisableParentScroll ? 600 : undefined,
      ariaLabel: "Color picker popup"
    }, (0, _react2.jsx)("div", {
      css: colorPickerWrapper
    }, (0, _react2.jsx)(ColorPaletteWithListeners, {
      palette: props.colorPalette,
      cols: props.cols,
      selectedColor: props.currentColor || null,
      onClick: onColorSelected,
      handleClickOutside: togglePopup
    })));
  };

  var title = props.title || '';
  return (0, _react2.jsx)("div", {
    css: colorPickerButtonWrapper
  }, (0, _react2.jsx)(_tooltip.default, {
    content: title,
    position: "top"
  }, (0, _react2.jsx)(_button.default, {
    ref: buttonRef,
    "aria-label": title,
    spacing: "compact",
    onClick: togglePopup,
    style: {
      backgroundColor: props.currentColor || 'transparent',
      border: "1px solid ".concat(_common.DEFAULT_BORDER_COLOR),
      width: "".concat(((_props$size = props.size) === null || _props$size === void 0 ? void 0 : _props$size.width) || 20, "px"),
      height: "".concat(((_props$size2 = props.size) === null || _props$size2 === void 0 ? void 0 : _props$size2.height) || 20, "px"),
      padding: 0
    }
  })), renderPopup());
};

var _default = (0, _analyticsNext.withAnalyticsContext)({
  source: 'ConfigPanel'
})((0, _analyticsNext.withAnalyticsEvents)()(ColorPickerButton));

exports.default = _default;