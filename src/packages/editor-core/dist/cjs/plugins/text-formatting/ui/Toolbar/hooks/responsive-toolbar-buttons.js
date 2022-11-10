"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useResponsiveToolbarButtons = exports.useResponsiveIconTypeMenu = exports.useResponsiveIconTypeButtons = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = require("react");

var _constants = require("../constants");

var useResponsiveIconTypeButtons = function useResponsiveIconTypeButtons(_ref) {
  var toolbarSize = _ref.toolbarSize,
      responsivenessEnabled = _ref.responsivenessEnabled;
  var iconTypeList = (0, _react.useMemo)(function () {
    return _constants.ResponsiveCustomButtonToolbar[toolbarSize];
  }, [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : _constants.DefaultButtonsToolbar;
};

exports.useResponsiveIconTypeButtons = useResponsiveIconTypeButtons;

var useResponsiveIconTypeMenu = function useResponsiveIconTypeMenu(_ref2) {
  var toolbarSize = _ref2.toolbarSize,
      responsivenessEnabled = _ref2.responsivenessEnabled;
  var iconTypeList = (0, _react.useMemo)(function () {
    return _constants.ResponsiveCustomMenu[toolbarSize];
  }, [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : _constants.DefaultButtonsMenu;
};

exports.useResponsiveIconTypeMenu = useResponsiveIconTypeMenu;

var useResponsiveToolbarButtons = function useResponsiveToolbarButtons(_ref3) {
  var icons = _ref3.icons,
      toolbarSize = _ref3.toolbarSize,
      responsivenessEnabled = _ref3.responsivenessEnabled;
  var iconTypeList = useResponsiveIconTypeButtons({
    toolbarSize: toolbarSize,
    responsivenessEnabled: responsivenessEnabled
  });
  var iconsPosition = (0, _react.useMemo)(function () {
    return icons.reduce(function (acc, icon) {
      if (!icon || !icon.iconMark) {
        return acc;
      }

      var isIconSingleButton = iconTypeList.includes(icon.iconMark);

      if (isIconSingleButton) {
        return {
          dropdownItems: acc.dropdownItems,
          singleItems: [].concat((0, _toConsumableArray2.default)(acc.singleItems), [icon])
        };
      }

      return {
        dropdownItems: [].concat((0, _toConsumableArray2.default)(acc.dropdownItems), [icon]),
        singleItems: acc.singleItems
      };
    }, {
      dropdownItems: [],
      singleItems: []
    });
  }, [icons, iconTypeList]);
  return iconsPosition;
};

exports.useResponsiveToolbarButtons = useResponsiveToolbarButtons;