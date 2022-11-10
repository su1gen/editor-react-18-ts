import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
var tabWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  // increase specificity to make sure the tab style is overridden\n  &&& [role='tabpanel'][tabindex] {\n    padding: 0;\n  }\n\n  &&& [role='tablist']::before {\n    left: 0;\n    right: 0;\n  }\n"])));
var panelWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-grow: 1;\n  max-width: 100%;\n"])));

var TabGroupImpl = function TabGroupImpl(props) {
  var field = props.field,
      renderPanel = props.renderPanel;
  var fields = field.fields;

  var _useState = useState(function () {
    var activeTabName = field.defaultTab || fields[0].name;
    var index = fields.findIndex(function (f) {
      return f.name === activeTabName;
    });
    return Math.max(index, 0);
  }),
      _useState2 = _slicedToArray(_useState, 2),
      activeTab = _useState2[0],
      setActiveTab = _useState2[1];

  var onChange = React.useCallback(function (index) {
    setActiveTab(index);
  }, [setActiveTab]);
  return jsx("div", {
    css: tabWrapper
  }, jsx(Tabs, {
    id: "configPanelTabs-".concat(field.name),
    onChange: onChange,
    selected: activeTab
  }, jsx(TabList, null, fields.map(function (_ref) {
    var name = _ref.name,
        label = _ref.label;
    return jsx(Tab, {
      key: "tab-".concat(name)
    }, label);
  })), fields.map(function (field) {
    return jsx(TabPanel, {
      key: "panel-".concat(field.name)
    }, jsx("div", {
      css: panelWrapper
    }, renderPanel(field)));
  })));
};

TabGroupImpl.displayName = 'TabGroup';
var TabGroup = injectIntl(TabGroupImpl);
export default TabGroup;