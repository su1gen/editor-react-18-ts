/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { injectIntl } from 'react-intl-next';
import { IconMap } from '../../plugins/alignment/ui/ToolbarAlignment/icon-map';
import AlignmentButton from './AlignmentButton';
import { alignmentMessages } from './messages';
import { alignmentWrapper } from './styles';
import { alignLeft, alignRight } from '../../keymaps';
const alignmentOptions = [{
  title: alignmentMessages.alignLeft,
  shortcut: alignLeft,
  value: 'start'
}, {
  title: alignmentMessages.alignCenter,
  value: 'center'
}, {
  title: alignmentMessages.alignRight,
  shortcut: alignRight,
  value: 'end'
}];

class Alignment extends PureComponent {
  render() {
    const {
      onClick,
      selectedAlignment,
      className,
      intl
    } = this.props;
    return jsx("div", {
      css: alignmentWrapper,
      className: className
    }, alignmentOptions.map(alignment => {
      const {
        value,
        title,
        shortcut
      } = alignment;
      const message = intl.formatMessage(title);
      return jsx(AlignmentButton, {
        content: jsx(IconMap, {
          alignment: value
        }),
        key: value,
        value: value,
        label: message,
        shortcut: shortcut,
        onClick: onClick,
        isSelected: value === selectedAlignment
      });
    }));
  }

}

export default injectIntl(Alignment);