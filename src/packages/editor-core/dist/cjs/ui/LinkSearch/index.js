"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _LinkSearchList = _interopRequireDefault(require("./LinkSearchList"));

var _reactIntlNext = require("react-intl-next");

var _withActivityProvider = _interopRequireDefault(require("./withActivityProvider"));

var _analytics = require("../../plugins/analytics");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DEFAULT_ITEMS_LIMIT = 5;

var limit = function limit(items, max) {
  return items.slice(0, max);
};

var RecentLink = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(RecentLink, _React$Component);

  var _super = _createSuper(RecentLink);

  function RecentLink(props) {
    var _this;

    (0, _classCallCheck2.default)(this, RecentLink);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "activityProvider", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSubmit", function () {
      var _this$state = _this.state,
          items = _this$state.items,
          url = _this$state.url,
          selectedIndex = _this$state.selectedIndex;

      var inputMethod = _this.getCurrentInputMethod();

      if (!inputMethod) {
        return; // No call submit, if there is nothing to submit
      }

      switch (inputMethod) {
        case _analytics.INPUT_METHOD.MANUAL:
          {
            _this.props.onSubmit({
              url: url,
              text: url,
              inputMethod: _analytics.INPUT_METHOD.MANUAL
            });

            break;
          }

        case _analytics.INPUT_METHOD.TYPEAHEAD:
          {
            var item = items[selectedIndex];

            _this.setState(function () {
              return {
                url: item.url
              };
            });

            if (_this.props.onSubmit) {
              _this.props.onSubmit({
                url: item.url,
                text: item.name,
                inputMethod: _analytics.INPUT_METHOD.TYPEAHEAD
              });
            }

            break;
          }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSelected", function (href, text) {
      if (_this.props.onSubmit) {
        _this.setState(function () {
          return {
            url: href
          };
        });

        _this.props.onSubmit({
          text: text,
          url: href,
          inputMethod: _analytics.INPUT_METHOD.TYPEAHEAD
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(input) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.setState({
                  url: input
                });

                if (!_this.activityProvider) {
                  _context.next = 24;
                  break;
                }

                if (!(input.length === 0)) {
                  _context.next = 15;
                  break;
                }

                _context.t0 = _this;
                _context.t1 = limit;
                _context.next = 7;
                return _this.activityProvider.getRecentItems();

              case 7:
                _context.t2 = _context.sent;
                _context.t3 = _this.props.limit;
                _context.t4 = (0, _context.t1)(_context.t2, _context.t3);
                _context.t5 = -1;
                _context.t6 = {
                  items: _context.t4,
                  selectedIndex: _context.t5
                };

                _context.t0.setState.call(_context.t0, _context.t6);

                _context.next = 24;
                break;

              case 15:
                _context.t7 = _this;
                _context.t8 = limit;
                _context.next = 19;
                return _this.activityProvider.searchRecent(input);

              case 19:
                _context.t9 = _context.sent;
                _context.t10 = _this.props.limit;
                _context.t11 = (0, _context.t8)(_context.t9, _context.t10);
                _context.t12 = {
                  items: _context.t11,
                  selectedIndex: 0
                };

                _context.t7.setState.call(_context.t7, _context.t12);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyDown", function (e) {
      var _this$state2 = _this.state,
          items = _this$state2.items,
          selectedIndex = _this$state2.selectedIndex;

      if (!items || !items.length) {
        return;
      }

      if (e.key === 'ArrowDown') {
        // down
        e.preventDefault();

        _this.setState({
          selectedIndex: (selectedIndex + 1) % items.length
        });
      } else if (e.key === 'ArrowUp') {
        // up
        e.preventDefault();

        _this.setState({
          selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : items.length - 1
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseMove", function (objectId) {
      var items = _this.state.items;

      if (items) {
        var index = items.findIndex(function (item) {
          return item.objectId === objectId;
        });

        _this.setState({
          selectedIndex: index
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderRecentList", function () {
      var _this$state3 = _this.state,
          items = _this$state3.items,
          isLoading = _this$state3.isLoading,
          selectedIndex = _this$state3.selectedIndex;
      return /*#__PURE__*/_react.default.createElement(_LinkSearchList.default, {
        items: items,
        isLoading: isLoading,
        selectedIndex: selectedIndex,
        onSelect: _this.handleSelected,
        onMouseMove: _this.handleMouseMove
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "clearValue", function () {
      _this.setState({
        url: ''
      });
    });
    _this.state = {
      selectedIndex: -1,
      isLoading: false,
      items: [],
      url: props.defaultUrl || ''
    };
    return _this;
  }

  (0, _createClass2.default)(RecentLink, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.defaultUrl !== nextProps.defaultUrl) {
        this.setState(function (state) {
          if (state.url !== nextProps.defaultUrl) {
            return {
              items: [],
              selectedIndex: -1,
              url: nextProps.defaultUrl || ''
            };
          }

          return null;
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.props.activityProvider) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 3;
                return this.props.activityProvider;

              case 3:
                this.activityProvider = _context2.sent;
                _context2.next = 6;
                return this.loadRecentItems(this.activityProvider);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "loadRecentItems",
    value: function () {
      var _loadRecentItems = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(activityProvider) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                if (this.state.url) {
                  _context3.next = 11;
                  break;
                }

                _context3.t0 = this;
                _context3.t1 = limit;
                _context3.next = 6;
                return activityProvider.getRecentItems();

              case 6:
                _context3.t2 = _context3.sent;
                _context3.t3 = this.props.limit;
                _context3.t4 = (0, _context3.t1)(_context3.t2, _context3.t3);
                _context3.t5 = {
                  isLoading: true,
                  items: _context3.t4
                };

                _context3.t0.setState.call(_context3.t0, _context3.t5);

              case 11:
                _context3.prev = 11;
                this.setState({
                  isLoading: false
                });
                return _context3.finish(11);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0,, 11, 14]]);
      }));

      function loadRecentItems(_x2) {
        return _loadRecentItems.apply(this, arguments);
      }

      return loadRecentItems;
    }()
  }, {
    key: "getCurrentInputMethod",
    value: function getCurrentInputMethod() {
      var _this$state4 = this.state,
          items = _this$state4.items,
          url = _this$state4.url,
          selectedIndex = _this$state4.selectedIndex;

      if (items && items.length > 0 && selectedIndex > -1) {
        return _analytics.INPUT_METHOD.TYPEAHEAD;
      } else if (url && url.length > 0) {
        return _analytics.INPUT_METHOD.MANUAL;
      }

      return;
    }
  }, {
    key: "render",
    value: function render() {
      var render = this.props.render;
      var url = this.state.url;
      return render({
        activityProvider: this.activityProvider,
        inputProps: {
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          onSubmit: this.handleSubmit,
          value: url
        },
        clearValue: this.clearValue,
        currentInputMethod: this.getCurrentInputMethod(),
        renderRecentList: this.renderRecentList
      });
    }
  }]);
  return RecentLink;
}(_react.default.Component);

(0, _defineProperty2.default)(RecentLink, "defaultProps", {
  limit: DEFAULT_ITEMS_LIMIT
});

var _default = (0, _withActivityProvider.default)((0, _reactIntlNext.injectIntl)(RecentLink));

exports.default = _default;