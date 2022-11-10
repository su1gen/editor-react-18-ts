"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _tabs = _interopRequireWildcard(require("@atlaskit/tabs"));

var _templateObject, _templateObject2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var tabWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  // increase specificity to make sure the tab style is overridden\n  &&& [role='tabpanel'][tabindex] {\n    padding: 0;\n  }\n\n  &&& [role='tablist']::before {\n    left: 0;\n    right: 0;\n  }\n"])));
var panelWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-grow: 1;\n  max-width: 100%;\n"])));

var TabGroupImpl = function TabGroupImpl(props) {
  var field = props.field,
      renderPanel = props.renderPanel;
  var fields = field.fields;

  var _useState = (0, _react.useState)(function () {
    var activeTabName = field.defaultTab || fields[0].name;
    var index = fields.findIndex(function (f) {
      return f.name === activeTabName;
    });
    return Math.max(index, 0);
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      activeTab = _useState2[0],
      setActiveTab = _useState2[1];

  var onChange = _react.default.useCallback(function (index) {
    setActiveTab(index);
  }, [setActiveTab]);

  return (0, _react2.jsx)("div", {
    css: tabWrapper
  }, (0, _react2.jsx)(_tabs.default, {
    id: "configPanelTabs-".concat(field.name),
    onChange: onChange,
    selected: activeTab
  }, (0, _react2.jsx)(_tabs.TabList, null, fields.map(function (_ref) {
    var name = _ref.name,
        label = _ref.label;
    return (0, _react2.jsx)(_tabs.Tab, {
      key: "tab-".concat(name)
    }, label);
  })), fields.map(function (field) {
    return (0, _react2.jsx)(_tabs.TabPanel, {
      key: "panel-".concat(field.name)
    }, (0, _react2.jsx)("div", {
      css: panelWrapper
    }, renderPanel(field)));
  })));
};

TabGroupImpl.displayName = 'TabGroup';
var TabGroup = (0, _reactIntlNext.injectIntl)(TabGroupImpl);
var _default = TabGroup;
exports.default = _default;