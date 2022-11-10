import React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

const tooltipHelpTrigger = ({
  title = 'Open help dialog',
  titlePosition = 'left',
  intl
}) => {
  // to have translation for the default tooltip helper
  let displayTitle = title;

  if (title === 'Open help dialog') {
    displayTitle = intl.formatMessage(messages.toolbarHelpTitle);
  }

  return /*#__PURE__*/React.createElement(WithHelpTrigger, {
    render: showHelp => /*#__PURE__*/React.createElement(ToolbarButton, {
      onClick: showHelp,
      title: displayTitle,
      titlePosition: titlePosition,
      iconBefore: /*#__PURE__*/React.createElement(QuestionIcon, {
        label: displayTitle
      })
    })
  });
};

export default injectIntl(tooltipHelpTrigger);