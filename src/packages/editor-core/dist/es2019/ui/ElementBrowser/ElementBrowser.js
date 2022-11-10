import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { PureComponent } from 'react';
import StatelessElementBrowser from './components/StatelessElementBrowser';
export default class ElementBrowser extends PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      categories: [],
      items: [],
      searchTerm: '',
      selectedCategory: this.props.defaultCategory
    });

    _defineProperty(this, "getCategories", (items = this.fetchItems()) => // NOTE: we fetch all items to determine available categories.
    this.filterCategories(items, this.props.categories));

    _defineProperty(this, "filterCategories", (items, categories = []) => {
      const {
        showCategories
      } = this.props;

      if (!showCategories) {
        return [];
      }

      return categories.filter(category => category.name === 'all' || items.some(item => (item.categories || []).includes(category.name)));
    });

    _defineProperty(this, "fetchItems", (query, category) => {
      return this.props.getItems(query, category);
    });

    _defineProperty(this, "handleSearch", searchTerm => {
      const {
        defaultCategory
      } = this.props;
      this.setState({
        searchTerm,
        selectedCategory: defaultCategory
      });
    });

    _defineProperty(this, "handleCategorySelection", clickedCategory => {
      const {
        selectedCategory: stateCategoryValue
      } = this.state;
      /**
       * Reset selection if clicked on the same category twice.
       */

      if (stateCategoryValue === clickedCategory.name) {
        return this.setState({
          selectedCategory: this.props.defaultCategory
        });
      }

      this.setState({
        selectedCategory: clickedCategory.name,
        searchTerm: ''
      });
    });
  }

  componentDidMount() {
    const items = this.fetchItems();
    this.setState({
      items,
      categories: this.getCategories(items)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      searchTerm,
      selectedCategory
    } = this.state; // Update both items and categories when there's a new getItems

    if (this.props.getItems !== prevProps.getItems) {
      this.setState({
        categories: this.getCategories(),
        items: this.fetchItems(searchTerm, selectedCategory)
      });
    } else if (searchTerm !== prevState.searchTerm || selectedCategory !== prevState.selectedCategory) {
      this.setState({
        items: this.fetchItems(searchTerm, selectedCategory)
      });
    }
  }

  render() {
    const {
      onInsertItem,
      onSelectItem,
      showSearch,
      showCategories,
      mode,
      emptyStateHandler
    } = this.props;
    const {
      categories,
      searchTerm,
      selectedCategory,
      items
    } = this.state;
    return /*#__PURE__*/React.createElement(StatelessElementBrowser, {
      items: items,
      categories: categories,
      onSearch: this.handleSearch,
      onSelectCategory: this.handleCategorySelection,
      onSelectItem: onSelectItem,
      onInsertItem: onInsertItem,
      selectedCategory: selectedCategory,
      showSearch: showSearch,
      showCategories: showCategories,
      mode: mode,
      searchTerm: searchTerm,
      emptyStateHandler: emptyStateHandler
    });
  }

}

_defineProperty(ElementBrowser, "defaultProps", {
  defaultCategory: 'all',
  onInsertItem: () => {}
});