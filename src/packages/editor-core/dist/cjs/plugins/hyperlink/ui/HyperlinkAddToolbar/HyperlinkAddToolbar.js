"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.default = exports.RECENT_SEARCH_LIST_SIZE = exports.HyperlinkLinkAddToolbarWithIntl = exports.HyperlinkLinkAddToolbar = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _adfSchema = require("@atlaskit/adf-schema");

var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/cross-circle"));

var _alignLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-left"));

var _link = _interopRequireDefault(require("@atlaskit/icon/glyph/link"));

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _ = _interopRequireDefault(require("@atlaskit/icon-object/glyph/page/16"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _reactIntlNext = require("react-intl-next");

var _analyticsNext = require("@atlaskit/analytics-next");

var _messages = require("../../../../messages");

var _PanelTextInput = _interopRequireDefault(require("../../../../ui/PanelTextInput"));

var _LinkSearchList = _interopRequireDefault(require("../../../../ui/LinkSearch/LinkSearchList"));

var _ToolbarComponents = require("../../../../ui/LinkSearch/ToolbarComponents");

var _analytics = require("../../../analytics");

var _utils = require("../../utils");

var _array = require("../../../../utils/array");

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _utils2 = require("./utils");

var _commands = require("../../commands");

var _actions = require("../../../card/pm-plugins/actions");

var _styles = require("../../styles");

var _utils3 = require("@atlaskit/editor-common/utils");

var _transformTimeStamp = require("../../../../ui/LinkSearch/transformTimeStamp");

var _announcer = _interopRequireDefault(require("../../../../utils/announcer/announcer"));

var _templateObject, _templateObject2, _templateObject3;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var RECENT_SEARCH_LIST_SIZE = 5;
exports.RECENT_SEARCH_LIST_SIZE = RECENT_SEARCH_LIST_SIZE;
var clearText = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  cursor: pointer;\n  padding: 0;\n  margin-right: 8px;\n  color: ", ";\n  background: transparent;\n  border: none;\n"])), (0, _tokens.token)('color.icon.subtle', _colors.N90));
var textInputWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  border-top: 1px solid ", ";\n  border-bottom: 1px solid ", ";\n"])), _ToolbarComponents.inputWrapper, (0, _tokens.token)('color.border', _colors.N30), (0, _tokens.token)('color.border', _colors.N30));
var iconWrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  padding: 4px 8px;\n  width: 18px;\n"])), (0, _tokens.token)('color.icon.subtle', _colors.N80));
var messages = (0, _reactIntlNext.defineMessages)({
  displayText: {
    id: 'fabric.editor.displayText',
    defaultMessage: 'Text to display',
    description: 'Text to display'
  },
  clearText: {
    id: 'fabric.editor.clearLinkText',
    defaultMessage: 'Clear text',
    description: 'Clears text on the link toolbar'
  },
  clearLink: {
    id: 'fabric.editor.clearLink',
    defaultMessage: 'Clear link',
    description: 'Clears link in the link toolbar'
  },
  searchLinkAriaDescription: {
    id: 'fabric.editor.hyperlink.searchLinkAriaDescription',
    defaultMessage: 'Suggestions will appear below as you type into the field',
    description: 'Describes what the search field does for screen reader users.'
  },
  searchLinkResults: {
    id: 'fabric.editor.hyperlink.searchLinkResults',
    defaultMessage: '{count, plural, =0 {no results} one {# result} other {# results}} found',
    description: 'Announce search results for screen-reader users.'
  },
  linkAriaLabel: {
    id: 'fabric.editor.hyperlink.linkAriaLabel',
    defaultMessage: 'Link label',
    description: 'aria label for a link'
  }
});
exports.messages = messages;
var defaultIcon = (0, _react2.jsx)(_.default, {
  label: 'page'
});

var mapActivityProviderResultToLinkSearchItemData = function mapActivityProviderResultToLinkSearchItemData(_ref) {
  var name = _ref.name,
      container = _ref.container,
      iconUrl = _ref.iconUrl,
      objectId = _ref.objectId,
      url = _ref.url,
      viewedTimestamp = _ref.viewedTimestamp;
  return {
    objectId: objectId,
    name: name,
    container: container,
    iconUrl: iconUrl,
    url: url,
    lastViewedDate: viewedTimestamp ? new Date(viewedTimestamp) : undefined,
    prefetch: true
  };
};

var mapSearchProviderResultToLinkSearchItemData = function mapSearchProviderResultToLinkSearchItemData(_ref2) {
  var objectId = _ref2.objectId,
      container = _ref2.container,
      title = _ref2.title,
      contentType = _ref2.contentType,
      url = _ref2.url,
      updatedTimestamp = _ref2.updatedTimestamp;
  return {
    objectId: objectId,
    container: container,
    name: title,
    url: url,
    lastUpdatedDate: updatedTimestamp ? new Date(updatedTimestamp) : undefined,
    icon: contentType && _utils2.mapContentTypeToIcon[contentType] || defaultIcon,
    prefetch: false
  };
};

var HyperlinkLinkAddToolbar = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(HyperlinkLinkAddToolbar, _PureComponent);

  var _super = _createSuper(HyperlinkLinkAddToolbar);

  /* To prevent double submit */
  function HyperlinkLinkAddToolbar(props) {
    var _this;

    (0, _classCallCheck2.default)(this, HyperlinkLinkAddToolbar);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "submitted", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "urlInputContainer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "displayTextInputContainer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "wrapperRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "quickSearchQueryVersion", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "analyticSource", 'createLinkInlineDialog');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "quickSearch", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(input, items, quickSearchLimit) {
        var _pluginState$searchSe;

        var _this$state, searchProvider, displayUrl, pluginState, queryVersion, perfStart, _pluginState$searchSe2, searchProviderResultItems, searchItems, perfStop, duration, _perfStop, _duration;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state = _this.state, searchProvider = _this$state.searchProvider, displayUrl = _this$state.displayUrl;
                pluginState = _this.props.pluginState;

                if (searchProvider) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                queryVersion = ++_this.quickSearchQueryVersion;

                _this.fireAnalytics({
                  action: _analytics.ACTION.ENTERED,
                  actionSubject: _analytics.ACTION_SUBJECT.TEXT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.LINK_SEARCH_INPUT,
                  attributes: {
                    queryLength: input.length,
                    queryVersion: queryVersion,
                    queryHash: (0, _utils2.sha1)(input),
                    searchSessionId: (_pluginState$searchSe = pluginState.searchSessionId) !== null && _pluginState$searchSe !== void 0 ? _pluginState$searchSe : '',
                    wordCount: (0, _utils2.wordCount)(input),
                    source: _this.analyticSource
                  },
                  nonPrivacySafeAttributes: {
                    query: input
                  },
                  eventType: _analytics.EVENT_TYPE.UI
                });

                perfStart = performance.now();
                _context.prev = 7;
                _context.next = 10;
                return searchProvider.quickSearch(input, quickSearchLimit);

              case 10:
                searchProviderResultItems = _context.sent;
                searchItems = limit((0, _array.filterUniqueItems)([].concat((0, _toConsumableArray2.default)(items), (0, _toConsumableArray2.default)(searchProviderResultItems.map(mapSearchProviderResultToLinkSearchItemData))), function (firstItem, secondItem) {
                  return firstItem.objectId === secondItem.objectId;
                }));

                if (displayUrl === input && queryVersion === _this.quickSearchQueryVersion) {
                  _this.setState({
                    items: searchItems,
                    isLoading: false
                  });
                }

                perfStop = performance.now();
                duration = perfStop - perfStart;

                _this.fireAnalytics({
                  action: _analytics.ACTION.INVOKED,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.QUICK_SEARCH,
                  attributes: {
                    duration: duration,
                    count: searchProviderResultItems.length
                  },
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL
                });

                _this.fireAnalytics({
                  action: _analytics.ACTION.SHOWN,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.POST_QUERY_SEARCH_RESULTS,
                  attributes: {
                    source: _this.analyticSource,
                    postQueryRequestDurationMs: duration,
                    searchSessionId: (_pluginState$searchSe2 = pluginState.searchSessionId) !== null && _pluginState$searchSe2 !== void 0 ? _pluginState$searchSe2 : '',
                    resultCount: searchProviderResultItems.length,
                    results: searchProviderResultItems.map(function (item) {
                      return {
                        resultContentId: item.objectId,
                        resultType: item.contentType
                      };
                    })
                  },
                  eventType: _analytics.EVENT_TYPE.UI
                });

                _context.next = 24;
                break;

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](7);
                _perfStop = performance.now();
                _duration = _perfStop - perfStart;

                _this.fireAnalytics({
                  action: _analytics.ACTION.INVOKED,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.QUICK_SEARCH,
                  attributes: {
                    duration: _duration,
                    count: -1,
                    errorCode: _context.t0.status
                  },
                  nonPrivacySafeAttributes: {
                    error: _context.t0.message
                  },
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL
                });

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[7, 19]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateInput", /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(input) {
        var _this$state2, activityProvider, searchProvider, _items, shouldQuerySearchProvider;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state2 = _this.state, activityProvider = _this$state2.activityProvider, searchProvider = _this$state2.searchProvider;

                _this.setState({
                  displayUrl: input
                });

                if (!activityProvider) {
                  _context2.next = 23;
                  break;
                }

                if (!(input.length === 0)) {
                  _context2.next = 13;
                  break;
                }

                _context2.t0 = _this;
                _context2.next = 7;
                return _this.getRecentItems(activityProvider);

              case 7:
                _context2.t1 = _context2.sent;
                _context2.t2 = -1;
                _context2.t3 = {
                  items: _context2.t1,
                  selectedIndex: _context2.t2
                };

                _context2.t0.setState.call(_context2.t0, _context2.t3);

                _context2.next = 23;
                break;

              case 13:
                if (!(0, _adfSchema.isSafeUrl)(input)) {
                  _context2.next = 17;
                  break;
                }

                _this.setState({
                  items: [],
                  selectedIndex: -1,
                  isLoading: false
                });

                _context2.next = 23;
                break;

              case 17:
                _context2.next = 19;
                return _this.getRecentItems(activityProvider, input);

              case 19:
                _items = _context2.sent;
                shouldQuerySearchProvider = _items.length < RECENT_SEARCH_LIST_SIZE && !!searchProvider;

                _this.setState({
                  items: _items,
                  isLoading: shouldQuerySearchProvider
                });

                if (shouldQuerySearchProvider) {
                  _this.debouncedQuickSearch(input, _items, RECENT_SEARCH_LIST_SIZE);
                }

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "createClearHandler", function (field) {
      return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var activityProvider, _this$setState;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                activityProvider = _this.state.activityProvider;

                if (activityProvider) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                _context3.t0 = field;
                _context3.next = _context3.t0 === 'displayUrl' ? 6 : _context3.t0 === 'displayText' ? 21 : 23;
                break;

              case 6:
                _context3.t1 = _this;
                _this$setState = {};
                (0, _defineProperty2.default)(_this$setState, field, '');
                _context3.t2 = _defineProperty2.default;
                _context3.t3 = _this$setState;
                _context3.t4 = limit;
                _context3.next = 14;
                return activityProvider.getRecentItems();

              case 14:
                _context3.t5 = _context3.sent;
                _context3.t6 = (0, _context3.t4)(_context3.t5);
                (0, _context3.t2)(_context3.t3, "items", _context3.t6);
                _context3.t7 = _this$setState;

                _context3.t1.setState.call(_context3.t1, _context3.t7);

                if (_this.urlInputContainer) {
                  _this.urlInputContainer.focus();
                }

                return _context3.abrupt("break", 23);

              case 21:
                _this.setState((0, _defineProperty2.default)({}, field, ''));

                if (_this.displayTextInputContainer) {
                  _this.displayTextInputContainer.focus();
                }

              case 23:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClickOutside", function (event) {
      if (event.target instanceof Element && _this.wrapperRef.current && !_this.wrapperRef.current.contains(event.target)) {
        var view = _this.props.view;
        (0, _commands.hideLinkToolbar)()(view.state, view.dispatch);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getScreenReaderText", function () {
      var intl = _this.props.intl;
      var _this$state3 = _this.state,
          items = _this$state3.items,
          selectedIndex = _this$state3.selectedIndex;

      if (items.length && selectedIndex > -1) {
        var _items$selectedIndex = items[selectedIndex],
            name = _items$selectedIndex.name,
            _container = _items$selectedIndex.container,
            lastUpdatedDate = _items$selectedIndex.lastUpdatedDate,
            lastViewedDate = _items$selectedIndex.lastViewedDate;
        var date = (0, _transformTimeStamp.transformTimeStamp)(intl, lastViewedDate, lastUpdatedDate);
        return "".concat(name, ", ").concat(_container, ", ").concat(date === null || date === void 0 ? void 0 : date.pageAction, " ").concat(date === null || date === void 0 ? void 0 : date.dateString, " ").concat((date === null || date === void 0 ? void 0 : date.timeSince) || '');
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isUrlPopulatedWithSelectedItem", function () {
      /**
       * When we use ArrowKey to navigate through result items,
       * the URL field will be populated with the content of
       * selected item.
       * This function will check if the URL field is populated
       * with selected item.
       * It can be useful to detect whether we want to insert a
       * smartlink or a hyperlink with customized title
       */
      var _this$state4 = _this.state,
          items = _this$state4.items,
          selectedIndex = _this$state4.selectedIndex,
          displayUrl = _this$state4.displayUrl;
      var selectedItem = items[selectedIndex];

      if (selectedItem && selectedItem.url === displayUrl) {
        return true;
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSelected", function (href, text) {
      _this.handleInsert(href, text, _analytics.INPUT_METHOD.TYPEAHEAD, 'click');
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInsert", function (href, title, inputType, interaction) {
      var _this$props = _this.props,
          pluginState = _this$props.pluginState,
          onSubmit = _this$props.onSubmit;
      var _this$state5 = _this.state,
          items = _this$state5.items,
          selectedIndex = _this$state5.selectedIndex,
          displayText = _this$state5.displayText;

      if (onSubmit) {
        _this.submitted = true;
        onSubmit(href, title, displayText, inputType);
      }

      if (interaction === 'click' || _this.isUrlPopulatedWithSelectedItem()) {
        var _pluginState$searchSe3, _selectedItem$prefetc;

        /**
         * When it's a mouse click even or the selectedItem.url matches displayUrl, we think
         * it's selected from the result list and fire the
         * analytic
         */
        var selectedItem = items[selectedIndex];

        _this.fireAnalytics({
          action: _analytics.ACTION.SELECTED,
          actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
          attributes: {
            source: _this.analyticSource,
            searchSessionId: (_pluginState$searchSe3 = pluginState.searchSessionId) !== null && _pluginState$searchSe3 !== void 0 ? _pluginState$searchSe3 : '',
            trigger: interaction,
            resultCount: items.length,
            selectedResultId: selectedItem.objectId,
            selectedRelativePosition: selectedIndex,
            prefetch: (_selectedItem$prefetc = selectedItem.prefetch) !== null && _selectedItem$prefetc !== void 0 ? _selectedItem$prefetc : false
          },
          eventType: _analytics.EVENT_TYPE.UI
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseEnterResultItem", function (objectId) {
      var items = _this.state.items;
      var index = findIndex(items, function (item) {
        return item.objectId === objectId;
      });

      _this.setState({
        selectedIndex: index
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseLeaveResultItem", function (objectId) {
      var _this$state6 = _this.state,
          items = _this$state6.items,
          selectedIndex = _this$state6.selectedIndex;
      var index = findIndex(items, function (item) {
        return item.objectId === objectId;
      }); // This is to avoid updating index that was set by other mouseenter event

      if (selectedIndex === index) {
        _this.setState({
          selectedIndex: -1
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSubmit", function () {
      var _this$state7 = _this.state,
          displayUrl = _this$state7.displayUrl,
          selectedIndex = _this$state7.selectedIndex,
          items = _this$state7.items;
      var selectedItem = items[selectedIndex];

      if (_this.isUrlPopulatedWithSelectedItem()) {
        _this.handleInsert((0, _utils.normalizeUrl)(selectedItem.url), selectedItem.name, _analytics.INPUT_METHOD.TYPEAHEAD, 'keyboard');
      } else if (displayUrl && displayUrl.length > 0) {
        var url = (0, _utils.normalizeUrl)(displayUrl);

        if (url) {
          _this.handleInsert(url, displayUrl, _analytics.INPUT_METHOD.MANUAL, 'notselected');
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClearTextKeyDown", function (event) {
      var KEY_CODE_TAB = 9;
      var keyCode = event.keyCode;

      if (keyCode === KEY_CODE_TAB) {
        if (!_this.submitted) {
          var _this$state8 = _this.state,
              displayUrl = _this$state8.displayUrl,
              _displayText = _this$state8.displayText;
          var url = (0, _utils.normalizeUrl)(displayUrl);

          _this.handleInsert(url, _displayText || displayUrl, _analytics.INPUT_METHOD.MANUAL, 'notselected');
        }

        event.preventDefault();
        return;
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyDown", function (event) {
      var _this$state9 = _this.state,
          items = _this$state9.items,
          selectedIndex = _this$state9.selectedIndex;
      var _this$props2 = _this.props,
          pluginState = _this$props2.pluginState,
          view = _this$props2.view;
      var keyCode = event.keyCode;
      var KEY_CODE_ESCAPE = 27;
      var KEY_CODE_ARROW_DOWN = 40;
      var KEY_CODE_ARROW_UP = 38;

      if (keyCode === KEY_CODE_ESCAPE) {
        // escape
        event.preventDefault();
        (0, _commands.hideLinkToolbar)()(view.state, view.dispatch);
        view.dispatch((0, _actions.hideLinkToolbar)(view.state.tr));
        return;
      }

      if (!items || !items.length) {
        return;
      }

      var updatedIndex = selectedIndex;

      if (keyCode === KEY_CODE_ARROW_DOWN) {
        // down
        event.preventDefault();
        updatedIndex = (selectedIndex + 1) % items.length;
      } else if (keyCode === KEY_CODE_ARROW_UP) {
        // up
        event.preventDefault();
        updatedIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
      }

      if ([KEY_CODE_ARROW_DOWN, KEY_CODE_ARROW_UP].includes(keyCode) && items[updatedIndex]) {
        var _pluginState$searchSe4;

        _this.setState({
          selectedIndex: updatedIndex,
          displayUrl: items[updatedIndex].url
        });

        _this.fireAnalytics({
          action: _analytics.ACTION.HIGHLIGHTED,
          actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
          attributes: {
            source: _this.analyticSource,
            searchSessionId: (_pluginState$searchSe4 = pluginState.searchSessionId) !== null && _pluginState$searchSe4 !== void 0 ? _pluginState$searchSe4 : '',
            selectedResultId: items[updatedIndex].objectId,
            selectedRelativePosition: updatedIndex
          },
          eventType: _analytics.EVENT_TYPE.UI
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateTextInput", function (displayText) {
      _this.setState({
        displayText: displayText
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCancel", function (e) {
      var view = _this.props.view;
      e.preventDefault();
      (0, _commands.hideLinkToolbar)()(view.state, view.dispatch);
    });
    _this.state = {
      selectedIndex: -1,
      isLoading: false,
      displayUrl: (0, _utils.normalizeUrl)(props.displayUrl),
      displayText: props.displayText,
      items: []
    };
    /* Cache functions */

    _this.handleClearText = _this.createClearHandler('displayUrl');
    _this.handleClearDisplayText = _this.createClearHandler('displayText');
    _this.debouncedQuickSearch = (0, _debounce.default)(_this.quickSearch, 400);
    _this.fireCustomAnalytics = (0, _analytics.fireAnalyticsEvent)(props.createAnalyticsEvent);
    return _this;
  }

  (0, _createClass2.default)(HyperlinkLinkAddToolbar, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var _pluginState$searchSe5, _pluginState$inputMet;

        var pluginState, _yield$Promise$all, _yield$Promise$all2, activityProvider, searchProvider;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                pluginState = this.props.pluginState;
                document.addEventListener('mousedown', this.handleClickOutside);
                this.fireAnalytics({
                  action: _analytics.ACTION.VIEWED,
                  actionSubject: _analytics.ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
                  attributes: {
                    timesViewed: pluginState.timesViewed,
                    searchSessionId: (_pluginState$searchSe5 = pluginState.searchSessionId) !== null && _pluginState$searchSe5 !== void 0 ? _pluginState$searchSe5 : '',
                    trigger: (_pluginState$inputMet = pluginState.inputMethod) !== null && _pluginState$inputMet !== void 0 ? _pluginState$inputMet : ''
                  },
                  eventType: _analytics.EVENT_TYPE.SCREEN
                });
                _context4.next = 5;
                return Promise.all([this.props.activityProvider, this.props.searchProvider]);

              case 5:
                _yield$Promise$all = _context4.sent;
                _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 2);
                activityProvider = _yield$Promise$all2[0];
                searchProvider = _yield$Promise$all2[1];
                this.setState({
                  activityProvider: activityProvider,
                  searchProvider: searchProvider
                });
                _context4.next = 12;
                return this.loadInitialLinkSearchResult();

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var pluginState = this.props.pluginState;
      document.removeEventListener('mousedown', this.handleClickOutside);

      if (!this.submitted) {
        var _pluginState$searchSe6;

        this.fireAnalytics({
          action: _analytics.ACTION.DISMISSED,
          actionSubject: _analytics.ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
          attributes: {
            source: this.analyticSource,
            searchSessionId: (_pluginState$searchSe6 = pluginState.searchSessionId) !== null && _pluginState$searchSe6 !== void 0 ? _pluginState$searchSe6 : '',
            trigger: 'blur'
          },
          eventType: _analytics.EVENT_TYPE.UI
        });
      }
    }
  }, {
    key: "getRecentItems",
    value: function () {
      var _getRecentItems = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(activityProvider, query) {
        var pluginState, perfStart, _pluginState$searchSe7, activityRecentItems, _items2, perfStop, duration, _perfStop2, _duration2;

        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                pluginState = this.props.pluginState;
                perfStart = performance.now();
                _context5.prev = 2;
                _context5.t0 = limit;

                if (!query) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 7;
                return activityProvider.searchRecent(query);

              case 7:
                _context5.t1 = _context5.sent;
                _context5.next = 13;
                break;

              case 10:
                _context5.next = 12;
                return activityProvider.getRecentItems();

              case 12:
                _context5.t1 = _context5.sent;

              case 13:
                _context5.t2 = _context5.t1;
                activityRecentItems = (0, _context5.t0)(_context5.t2);
                _items2 = activityRecentItems.map(mapActivityProviderResultToLinkSearchItemData);
                perfStop = performance.now();
                duration = perfStop - perfStart;
                this.fireAnalytics({
                  action: _analytics.ACTION.INVOKED,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
                  attributes: {
                    duration: duration,
                    count: _items2.length
                  },
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL
                });
                this.fireAnalytics({
                  action: _analytics.ACTION.SHOWN,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.PRE_QUERY_SEARCH_RESULTS,
                  attributes: {
                    source: this.analyticSource,
                    preQueryRequestDurationMs: duration,
                    searchSessionId: (_pluginState$searchSe7 = pluginState.searchSessionId) !== null && _pluginState$searchSe7 !== void 0 ? _pluginState$searchSe7 : '',
                    resultCount: _items2.length,
                    results: activityRecentItems.map(function (item) {
                      var _item$type;

                      return {
                        resultContentId: item.objectId,
                        resultType: (_item$type = item.type) !== null && _item$type !== void 0 ? _item$type : ''
                      };
                    })
                  },
                  eventType: _analytics.EVENT_TYPE.UI
                });
                return _context5.abrupt("return", _items2);

              case 23:
                _context5.prev = 23;
                _context5.t3 = _context5["catch"](2);
                _perfStop2 = performance.now();
                _duration2 = _perfStop2 - perfStart;
                this.fireAnalytics({
                  action: _analytics.ACTION.INVOKED,
                  actionSubject: _analytics.ACTION_SUBJECT.SEARCH_RESULT,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
                  attributes: {
                    duration: _duration2,
                    count: -1,
                    errorCode: _context5.t3.status
                  },
                  nonPrivacySafeAttributes: {
                    error: _context5.t3.message
                  },
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL
                });
                return _context5.abrupt("return", []);

              case 29:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 23]]);
      }));

      function getRecentItems(_x5, _x6) {
        return _getRecentItems.apply(this, arguments);
      }

      return getRecentItems;
    }()
  }, {
    key: "fireAnalytics",
    value: function fireAnalytics(payload) {
      if (this.props.createAnalyticsEvent && this.fireCustomAnalytics) {
        this.fireCustomAnalytics({
          payload: payload
        });
      }
    }
  }, {
    key: "loadInitialLinkSearchResult",
    value: function () {
      var _loadInitialLinkSearchResult = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var _this$state10, displayUrl, activityProvider, _items3;

        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this$state10 = this.state, displayUrl = _this$state10.displayUrl, activityProvider = _this$state10.activityProvider;
                _context6.prev = 1;

                if (!(!displayUrl && activityProvider)) {
                  _context6.next = 8;
                  break;
                }

                this.setState({
                  isLoading: true
                });
                _context6.next = 6;
                return this.getRecentItems(activityProvider);

              case 6:
                _items3 = _context6.sent;
                this.setState({
                  items: _items3
                });

              case 8:
                _context6.prev = 8;
                this.setState({
                  isLoading: false
                });
                return _context6.finish(8);

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1,, 8, 11]]);
      }));

      function loadInitialLinkSearchResult() {
        return _loadInitialLinkSearchResult.apply(this, arguments);
      }

      return loadInitialLinkSearchResult;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state11 = this.state,
          items = _this$state11.items,
          isLoading = _this$state11.isLoading,
          selectedIndex = _this$state11.selectedIndex,
          displayUrl = _this$state11.displayUrl,
          displayText = _this$state11.displayText;
      var _this$props3 = this.props,
          formatMessage = _this$props3.intl.formatMessage,
          activityProvider = _this$props3.activityProvider;
      var placeholder = formatMessage(activityProvider ? _messages.linkToolbarMessages.placeholder : _messages.linkToolbarMessages.linkPlaceholder);
      var formatLinkAddressText = formatMessage(_messages.linkToolbarMessages.linkAddress);
      var formatClearLinkText = formatMessage(messages.clearLink);
      var formatDisplayText = formatMessage(messages.displayText);
      var screenReaderDescriptionId = 'search-recent-links-field-description';
      var linkSearchListId = 'hyperlink-search-list';
      var ariaActiveDescendant = selectedIndex > -1 ? "link-search-list-item-".concat(selectedIndex) : ''; // Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
      // as the Aria design pattern for combobox does not work in this case
      // for details: https://a11y-internal.atlassian.net/browse/AK-740

      var screenReaderText = _utils3.browser.safari && this.getScreenReaderText();
      return (0, _react2.jsx)("div", {
        className: "recent-list"
      }, (0, _react2.jsx)("div", {
        css: [_ToolbarComponents.container, !!activityProvider && _ToolbarComponents.containerWithProvider],
        ref: this.wrapperRef
      }, (0, _react2.jsx)("div", {
        css: _ToolbarComponents.inputWrapper
      }, (0, _react2.jsx)("span", {
        css: iconWrapper
      }, (0, _react2.jsx)(_tooltip.default, {
        content: formatLinkAddressText
      }, (0, _react2.jsx)(_link.default, {
        label: formatLinkAddressText
      }))), screenReaderText && (0, _react2.jsx)(_announcer.default, {
        ariaLive: "assertive",
        text: screenReaderText,
        ariaRelevant: "additions",
        delay: 250
      }), (0, _react2.jsx)("div", {
        css: _styles.visuallyHiddenStyles,
        "aria-hidden": "true",
        id: screenReaderDescriptionId
      }, formatMessage(messages.searchLinkAriaDescription)), (0, _react2.jsx)(_PanelTextInput.default, {
        role: "combobox",
        ariaExpanded: true,
        ariaActiveDescendant: ariaActiveDescendant,
        ariaControls: linkSearchListId,
        ariaAutoComplete: true,
        describedById: screenReaderDescriptionId,
        ref: function ref(ele) {
          return _this2.urlInputContainer = ele;
        },
        placeholder: placeholder,
        testId: 'link-url',
        onSubmit: this.handleSubmit,
        onChange: this.updateInput,
        autoFocus: {
          preventScroll: true
        },
        onCancel: this.handleCancel,
        defaultValue: displayUrl,
        onKeyDown: this.handleKeyDown
      }), displayUrl && (0, _react2.jsx)(_tooltip.default, {
        content: formatClearLinkText
      }, (0, _react2.jsx)("button", {
        css: clearText,
        onClick: this.handleClearText
      }, (0, _react2.jsx)(_crossCircle.default, {
        label: formatClearLinkText
      })))), (0, _react2.jsx)("div", {
        css: textInputWrapper
      }, (0, _react2.jsx)("span", {
        css: iconWrapper
      }, (0, _react2.jsx)(_tooltip.default, {
        content: formatDisplayText
      }, (0, _react2.jsx)(_alignLeft.default, {
        label: formatDisplayText
      }))), (0, _react2.jsx)(_PanelTextInput.default, {
        ref: function ref(ele) {
          return _this2.displayTextInputContainer = ele;
        },
        placeholder: formatDisplayText,
        ariaLabel: formatMessage(messages.linkAriaLabel),
        testId: 'link-label',
        onChange: this.updateTextInput,
        onCancel: this.handleCancel,
        defaultValue: displayText,
        onSubmit: this.handleSubmit,
        onKeyDown: this.handleKeyDown
      }), displayText && (0, _react2.jsx)(_tooltip.default, {
        content: formatMessage(messages.clearText)
      }, (0, _react2.jsx)("button", {
        css: clearText,
        onClick: this.handleClearDisplayText,
        onKeyDown: this.handleClearTextKeyDown
      }, (0, _react2.jsx)(_crossCircle.default, {
        label: formatMessage(messages.clearText)
      })))), (0, _react2.jsx)("div", {
        css: _styles.visuallyHiddenStyles,
        "aria-live": "polite",
        "aria-atomic": "true",
        id: "fabric.editor.hyperlink.suggested.results"
      }, displayUrl && formatMessage(messages.searchLinkResults, {
        count: items.length
      })), (0, _react2.jsx)(_LinkSearchList.default, {
        ariaControls: "fabric.editor.hyperlink.suggested.results",
        id: linkSearchListId,
        role: "listbox",
        items: items,
        isLoading: isLoading,
        selectedIndex: selectedIndex,
        onSelect: this.handleSelected,
        onMouseEnter: this.handleMouseEnterResultItem,
        onMouseLeave: this.handleMouseLeaveResultItem
      })));
    }
  }]);
  return HyperlinkLinkAddToolbar;
}(_react.PureComponent);

exports.HyperlinkLinkAddToolbar = HyperlinkLinkAddToolbar;

function findIndex(array, predicate) {
  var index = -1;
  array.some(function (item, i) {
    if (predicate(item)) {
      index = i;
      return true;
    }

    return false;
  });
  return index;
}

function limit(items) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}

var HyperlinkLinkAddToolbarWithIntl = (0, _reactIntlNext.injectIntl)(HyperlinkLinkAddToolbar);
exports.HyperlinkLinkAddToolbarWithIntl = HyperlinkLinkAddToolbarWithIntl;

var _default = (0, _analyticsNext.withAnalyticsEvents)()(HyperlinkLinkAddToolbarWithIntl);

exports.default = _default;