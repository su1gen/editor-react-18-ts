import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
import StatelessElementBrowser from './components/StatelessElementBrowser';

var ElementBrowser = /*#__PURE__*/function (_PureComponent) {
  _inherits(ElementBrowser, _PureComponent);

  var _super = _createSuper(ElementBrowser);

  function ElementBrowser() {
    var _this;

    _classCallCheck(this, ElementBrowser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      categories: [],
      items: [],
      searchTerm: '',
      selectedCategory: _this.props.defaultCategory
    });

    _defineProperty(_assertThisInitialized(_this), "getCategories", function () {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.fetchItems();
      return (// NOTE: we fetch all items to determine available categories.
        _this.filterCategories(items, _this.props.categories)
      );
    });

    _defineProperty(_assertThisInitialized(_this), "filterCategories", function (items) {
      var categories = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var showCategories = _this.props.showCategories;

      if (!showCategories) {
        return [];
      }

      return categories.filter(function (category) {
        return category.name === 'all' || items.some(function (item) {
          return (item.categories || []).includes(category.name);
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "fetchItems", function (query, category) {
      return _this.props.getItems(query, category);
    });

    _defineProperty(_assertThisInitialized(_this), "handleSearch", function (searchTerm) {
      var defaultCategory = _this.props.defaultCategory;

      _this.setState({
        searchTerm: searchTerm,
        selectedCategory: defaultCategory
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCategorySelection", function (clickedCategory) {
      var stateCategoryValue = _this.state.selectedCategory;
      /**
       * Reset selection if clicked on the same category twice.
       */

      if (stateCategoryValue === clickedCategory.name) {
        return _this.setState({
          selectedCategory: _this.props.defaultCategory
        });
      }

      _this.setState({
        selectedCategory: clickedCategory.name,
        searchTerm: ''
      });
    });

    return _this;
  }

  _createClass(ElementBrowser, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var items = this.fetchItems();
      this.setState({
        items: items,
        categories: this.getCategories(items)
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$state = this.state,
          searchTerm = _this$state.searchTerm,
          selectedCategory = _this$state.selectedCategory; // Update both items and categories when there's a new getItems

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
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onInsertItem = _this$props.onInsertItem,
          onSelectItem = _this$props.onSelectItem,
          showSearch = _this$props.showSearch,
          showCategories = _this$props.showCategories,
          mode = _this$props.mode,
          emptyStateHandler = _this$props.emptyStateHandler;
      var _this$state2 = this.state,
          categories = _this$state2.categories,
          searchTerm = _this$state2.searchTerm,
          selectedCategory = _this$state2.selectedCategory,
          items = _this$state2.items;
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
  }]);

  return ElementBrowser;
}(PureComponent);

_defineProperty(ElementBrowser, "defaultProps", {
  defaultCategory: 'all',
  onInsertItem: function onInsertItem() {}
});

export { ElementBrowser as default };