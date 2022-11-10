"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _StatelessElementBrowser = _interopRequireDefault(require("./components/StatelessElementBrowser"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ElementBrowser = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ElementBrowser, _PureComponent);

  var _super = _createSuper(ElementBrowser);

  function ElementBrowser() {
    var _this;

    (0, _classCallCheck2.default)(this, ElementBrowser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      categories: [],
      items: [],
      searchTerm: '',
      selectedCategory: _this.props.defaultCategory
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getCategories", function () {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.fetchItems();
      return (// NOTE: we fetch all items to determine available categories.
        _this.filterCategories(items, _this.props.categories)
      );
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "filterCategories", function (items) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "fetchItems", function (query, category) {
      return _this.props.getItems(query, category);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSearch", function (searchTerm) {
      var defaultCategory = _this.props.defaultCategory;

      _this.setState({
        searchTerm: searchTerm,
        selectedCategory: defaultCategory
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCategorySelection", function (clickedCategory) {
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

  (0, _createClass2.default)(ElementBrowser, [{
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
      return /*#__PURE__*/_react.default.createElement(_StatelessElementBrowser.default, {
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
}(_react.PureComponent);

exports.default = ElementBrowser;
(0, _defineProperty2.default)(ElementBrowser, "defaultProps", {
  defaultCategory: 'all',
  onInsertItem: function onInsertItem() {}
});