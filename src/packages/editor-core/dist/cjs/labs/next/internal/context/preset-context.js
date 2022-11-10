"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePresetContext = exports.PresetProvider = void 0;

var _react = _interopRequireDefault(require("react"));

var PresetContext = /*#__PURE__*/_react.default.createContext([]);

var PresetProvider = PresetContext.Provider;
exports.PresetProvider = PresetProvider;

var usePresetContext = function usePresetContext() {
  return _react.default.useContext(PresetContext);
};

exports.usePresetContext = usePresetContext;