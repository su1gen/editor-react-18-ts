"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textColorIconWrapper = exports.textColorIconBar = exports.backgroundDisabled = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var colors = _interopRequireWildcard(require("@atlaskit/theme/colors"));

var _templateObject, _templateObject2, _templateObject3;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var createSteppedRainbow = function createSteppedRainbow(colors) {
  return "\n    linear-gradient(\n      to right,\n      ".concat(colors.map(function (color, i) {
    var inc = 100 / colors.length;
    var pos = i + 1;

    if (i === 0) {
      return "".concat(color, " ").concat(pos * inc, "%,");
    }

    if (i === colors.length - 1) {
      return "".concat(color, " ").concat((pos - 1) * inc, "%");
    }

    return "\n            ".concat(color, " ").concat((pos - 1) * inc, "%,\n            ").concat(color, " ").concat(pos * inc, "%,\n          ");
  }).join('\n'), "\n    );\n    ");
};

var rainbow = createSteppedRainbow([colors.P300, colors.T300, colors.Y400, colors.R400]);
var disabledRainbow = createSteppedRainbow([colors.N80, colors.N60, colors.N40, colors.N60]);
var textColorIconWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n"])));
exports.textColorIconWrapper = textColorIconWrapper;
var textColorIconBar = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 16px;\n  margin: auto;\n  width: 12px;\n  height: 3px;\n  border-radius: ", ";\n  background: ", ";\n"])), (0, _constants.borderRadius)() + 'px', rainbow);
exports.textColorIconBar = textColorIconBar;
var backgroundDisabled = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n"])), disabledRainbow);
exports.backgroundDisabled = backgroundDisabled;