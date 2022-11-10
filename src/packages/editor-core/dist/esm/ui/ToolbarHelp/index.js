import React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

var tooltipHelpTrigger = function tooltipHelpTrigger(_ref) {
  var _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Open help dialog' : _ref$title,
      _ref$titlePosition = _ref.titlePosition,
      titlePosition = _ref$titlePosition === void 0 ? 'left' : _ref$titlePosition,
      intl = _ref.intl;
  // to have translation for the default tooltip helper
  var displayTitle = title;

  if (title === 'Open help dialog') {
    displayTitle = intl.formatMessage(messages.toolbarHelpTitle);
  }

  return /*#__PURE__*/React.createElement(WithHelpTrigger, {
    render: function render(showHelp) {
      return /*#__PURE__*/React.createElement(ToolbarButton, {
        onClick: showHelp,
        title: displayTitle,
        titlePosition: titlePosition,
        iconBefore: /*#__PURE__*/React.createElement(QuestionIcon, {
          label: displayTitle
        })
      });
    }
  });
};

export default injectIntl(tooltipHelpTrigger);