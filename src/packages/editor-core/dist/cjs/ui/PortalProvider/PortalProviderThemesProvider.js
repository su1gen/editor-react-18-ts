"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortalProviderThemeProviders = PortalProviderThemeProviders;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _components = _interopRequireDefault(require("@atlaskit/theme/components"));

var _constants = require("@atlaskit/theme/constants");

var _react2 = require("@emotion/react");

function PortalProviderThemeProviders(props) {
  var children = props.children,
      mode = props.mode;

  var styledComponentsAndEmotionTheme = _react.default.useMemo( // This return value should only be one of the following
  // - { [CHANNEL]: { mode },
  // - { theme: { [CHANNEL]: { mode } }
  // However, it appears that consumers have inconsistent expectations
  // regarding the shape.
  // This can be revisited in future work, and for the purposes of
  // fixing https://product-fabric.atlassian.net/browse/ED-14956
  // we are merging the two shapes consumers expect.
  function () {
    var _ref;

    return _ref = {}, (0, _defineProperty2.default)(_ref, _constants.CHANNEL, {
      mode: mode
    }), (0, _defineProperty2.default)(_ref, "theme", (0, _defineProperty2.default)({}, _constants.CHANNEL, {
      mode: mode
    })), _ref;
  }, [mode]);

  var atlaskitTheme = _react.default.useCallback(function () {
    return {
      mode: mode
    };
  }, [mode]);

  return /*#__PURE__*/_react.default.createElement(_react2.ThemeProvider, {
    theme: styledComponentsAndEmotionTheme
  }, /*#__PURE__*/_react.default.createElement(_components.default.Provider, {
    value: atlaskitTheme
  }, children));
}