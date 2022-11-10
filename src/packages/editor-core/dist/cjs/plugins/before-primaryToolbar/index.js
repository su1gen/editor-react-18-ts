"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _BeforePrimaryToolbarWrapper = require("./ui/BeforePrimaryToolbarWrapper");

var beforePrimaryToolbar = function beforePrimaryToolbar(props) {
  return {
    name: 'beforePrimaryToolbar',
    primaryToolbarComponent: function primaryToolbarComponent() {
      return /*#__PURE__*/_react.default.createElement(_BeforePrimaryToolbarWrapper.BeforePrimaryToolbarWrapper, {
        beforePrimaryToolbarComponents: props.beforePrimaryToolbarComponents
      });
    }
  };
};

var _default = beforePrimaryToolbar;
exports.default = _default;