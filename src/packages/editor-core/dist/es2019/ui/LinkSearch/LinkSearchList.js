/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import LinkSearchListItem from './LinkSearchListItem';
const listContainer = css`
  padding-top: 0;
`;
const spinnerContainer = css`
  text-align: center;
  min-height: 80px;
  margin-top: 30px;
`;
export const linkSearchList = css`
  padding: 0;
  list-style: none;
`;
export default class LinkSearchList extends PureComponent {
  render() {
    const {
      onSelect,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      items,
      selectedIndex,
      isLoading,
      ariaControls,
      role,
      id
    } = this.props;
    let itemsContent;
    let loadingContent;

    if (items && items.length > 0) {
      itemsContent = jsx("ul", {
        css: linkSearchList,
        id: id,
        role: role,
        "aria-controls": ariaControls
      }, items.map((item, index) => jsx(LinkSearchListItem, {
        id: `link-search-list-item-${index}`,
        role: role && 'option',
        item: item,
        selected: selectedIndex === index,
        onMouseMove: onMouseMove,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onSelect: onSelect,
        key: item.objectId
      })));
    }

    if (isLoading) {
      loadingContent = jsx("div", {
        css: spinnerContainer
      }, jsx(Spinner, {
        size: "medium"
      }));
    }

    return jsx("div", {
      css: listContainer
    }, itemsContent, loadingContent);
  }

}