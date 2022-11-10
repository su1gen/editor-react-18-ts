/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { B400 } from '@atlaskit/theme/colors';
import { ButtonItem } from '@atlaskit/menu';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl } from 'react-intl-next';
import messages from './messages';
import { token } from '@atlaskit/tokens';
export const menuItemDimensions = {
  width: 175,
  height: 32
};
const spacer = css`
  display: flex;
  flex: 1;
  padding: 8px;
`;
const menuContainer = css`
  min-width: ${menuItemDimensions.width}px;

  // temporary solution to retain spacing defined by @atlaskit/Item
  & button {
    min-height: ${gridSize() * 4}px;
    padding: 8px 8px 7px;

    & > [data-item-elem-before] {
      margin-right: ${gridSize() / 2}px;
    }
  }
`;
export const itemSpacing = gridSize() / 2;

class Dropdown extends Component {
  render() {
    const {
      hide,
      dispatchCommand,
      items,
      intl
    } = this.props;
    return jsx("div", {
      css: menuContainer
    }, items.filter(item => !item.hidden).map((item, idx) => {
      const itemContent = jsx(ButtonItem, {
        key: idx,
        iconBefore: this.renderSelected(item, intl),
        iconAfter: item.elemAfter,
        onClick: () => {
          /**
           * The order of dispatching the event and hide() is important, because
           * the ClickAreaBlock will be relying on the element to calculate the
           * click coordinate.
           * For more details, please visit the comment in this PR https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5328/edm-1321-set-selection-near-smart-link?link_source=email#chg-packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx
           */
          dispatchCommand(item.onClick);
          hide();
        },
        "data-testid": item.testId,
        isDisabled: item.disabled,
        onMouseDown: e => {
          e.preventDefault();
        }
      }, item.title);

      if (item.tooltip) {
        return jsx(Tooltip, {
          key: idx,
          content: item.tooltip
        }, itemContent);
      }

      return itemContent;
    }));
  }

  renderSelected(item, intl) {
    const {
      showSelected = true
    } = this.props;
    const {
      selected
    } = item;

    if (showSelected && selected) {
      return jsx(EditorDoneIcon, {
        primaryColor: token('color.icon.selected', B400),
        size: "small",
        label: intl.formatMessage(messages.confirmModalOK)
      });
    }

    return jsx("span", {
      css: spacer
    });
  }

}

export default injectIntl(Dropdown);