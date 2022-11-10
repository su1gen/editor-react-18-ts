import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import LinkSearchList from './LinkSearchList';
import { injectIntl } from 'react-intl-next';
import withActivityProvider from './withActivityProvider';
import { INPUT_METHOD } from '../../plugins/analytics';
var DEFAULT_ITEMS_LIMIT = 5;

var limit = function limit(items, max) {
  return items.slice(0, max);
};

var RecentLink = /*#__PURE__*/function (_React$Component) {
  _inherits(RecentLink, _React$Component);

  var _super = _createSuper(RecentLink);

  function RecentLink(props) {
    var _this;

    _classCallCheck(this, RecentLink);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "activityProvider", null);

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", function () {
      var _this$state = _this.state,
          items = _this$state.items,
          url = _this$state.url,
          selectedIndex = _this$state.selectedIndex;

      var inputMethod = _this.getCurrentInputMethod();

      if (!inputMethod) {
        return; // No call submit, if there is nothing to submit
      }

      switch (inputMethod) {
        case INPUT_METHOD.MANUAL:
          {
            _this.props.onSubmit({
              url: url,
              text: url,
              inputMethod: INPUT_METHOD.MANUAL
            });

            break;
          }

        case INPUT_METHOD.TYPEAHEAD:
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
                inputMethod: INPUT_METHOD.TYPEAHEAD
              });
            }

            break;
          }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelected", function (href, text) {
      if (_this.props.onSubmit) {
        _this.setState(function () {
          return {
            url: href
          };
        });

        _this.props.onSubmit({
          text: text,
          url: href,
          inputMethod: INPUT_METHOD.TYPEAHEAD
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(input) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (e) {
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

    _defineProperty(_assertThisInitialized(_this), "handleMouseMove", function (objectId) {
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

    _defineProperty(_assertThisInitialized(_this), "renderRecentList", function () {
      var _this$state3 = _this.state,
          items = _this$state3.items,
          isLoading = _this$state3.isLoading,
          selectedIndex = _this$state3.selectedIndex;
      return /*#__PURE__*/React.createElement(LinkSearchList, {
        items: items,
        isLoading: isLoading,
        selectedIndex: selectedIndex,
        onSelect: _this.handleSelected,
        onMouseMove: _this.handleMouseMove
      });
    });

    _defineProperty(_assertThisInitialized(_this), "clearValue", function () {
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

  _createClass(RecentLink, [{
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
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
      var _loadRecentItems = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(activityProvider) {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
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
        return INPUT_METHOD.TYPEAHEAD;
      } else if (url && url.length > 0) {
        return INPUT_METHOD.MANUAL;
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
}(React.Component);

_defineProperty(RecentLink, "defaultProps", {
  limit: DEFAULT_ITEMS_LIMIT
});

export default withActivityProvider(injectIntl(RecentLink));