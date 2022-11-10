/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
const tabWrapper = css`
  // increase specificity to make sure the tab style is overridden
  &&& [role='tabpanel'][tabindex] {
    padding: 0;
  }

  &&& [role='tablist']::before {
    left: 0;
    right: 0;
  }
`;
const panelWrapper = css`
  flex-grow: 1;
  max-width: 100%;
`;

const TabGroupImpl = props => {
  const {
    field,
    renderPanel
  } = props;
  const {
    fields
  } = field;
  const [activeTab, setActiveTab] = useState(() => {
    const activeTabName = field.defaultTab || fields[0].name;
    const index = fields.findIndex(f => f.name === activeTabName);
    return Math.max(index, 0);
  });
  const onChange = React.useCallback(index => {
    setActiveTab(index);
  }, [setActiveTab]);
  return jsx("div", {
    css: tabWrapper
  }, jsx(Tabs, {
    id: `configPanelTabs-${field.name}`,
    onChange: onChange,
    selected: activeTab
  }, jsx(TabList, null, fields.map(({
    name,
    label
  }) => jsx(Tab, {
    key: `tab-${name}`
  }, label))), fields.map(field => jsx(TabPanel, {
    key: `panel-${field.name}`
  }, jsx("div", {
    css: panelWrapper
  }, renderPanel(field))))));
};

TabGroupImpl.displayName = 'TabGroup';
const TabGroup = injectIntl(TabGroupImpl);
export default TabGroup;