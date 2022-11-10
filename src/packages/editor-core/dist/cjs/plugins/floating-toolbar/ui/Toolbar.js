"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSameItem = exports.default = exports.areSameItems = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var _buttonGroup = _interopRequireDefault(require("@atlaskit/button/button-group"));

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _featureFlagsContext = require("../../feature-flags-context");

var _utils = require("../utils");

var _commands = require("../pm-plugins/toolbar-data/commands");

var _Button = _interopRequireDefault(require("./Button"));

var _Dropdown = _interopRequireDefault(require("./Dropdown"));

var _Select = _interopRequireDefault(require("./Select"));

var _Separator = _interopRequireDefault(require("./Separator"));

var _Input = _interopRequireDefault(require("./Input"));

var _ExtensionsPlaceholder = require("./ExtensionsPlaceholder");

var _ColorPickerButton = _interopRequireDefault(require("../../../ui/ColorPickerButton"));

var _EmojiPickerButton = require("./EmojiPickerButton");

var _announcer = _interopRequireDefault(require("../../../utils/announcer/announcer"));

var _reactIntlNext = require("react-intl-next");

var _messages = _interopRequireDefault(require("./messages"));

var _tokens = require("@atlaskit/tokens");

var _decoration = require("../../base/pm-plugins/decoration");

var _ScrollButtons = _interopRequireDefault(require("./ScrollButtons"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var akGridSize = (0, _constants.gridSize)();

var ToolbarItems = /*#__PURE__*/_react.default.memo(function (_ref) {
  var items = _ref.items,
      dispatchCommand = _ref.dispatchCommand,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      editorView = _ref.editorView,
      dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
      popupsScrollableElement = _ref.popupsScrollableElement,
      scrollable = _ref.scrollable,
      providerFactory = _ref.providerFactory,
      extensionsProvider = _ref.extensionsProvider,
      node = _ref.node,
      setDisableScroll = _ref.setDisableScroll,
      mountRef = _ref.mountRef;
  var emojiAndColourPickerMountPoint = scrollable ? popupsMountPoint || (editorView === null || editorView === void 0 ? void 0 : editorView.dom.closest('.fabric-editor-popup-scroll-parent')) || (editorView === null || editorView === void 0 ? void 0 : editorView.dom.closest('.ak-editor-content-area')) || undefined : popupsMountPoint;
  return (0, _react2.jsx)(_buttonGroup.default, null, items.filter(function (item) {
    return !item.hidden;
  }).map(function (item, idx) {
    switch (item.type) {
      case 'button':
        var ButtonIcon = item.icon;

        var onClickHandler = function onClickHandler() {
          if (item.confirmDialog) {
            dispatchCommand((0, _commands.showConfirmDialog)(idx));
          } else {
            dispatchCommand(item.onClick);
          }
        };

        return (0, _react2.jsx)(_Button.default, {
          className: item.className,
          key: idx,
          title: item.title,
          href: item.href,
          icon: item.icon ? (0, _react2.jsx)(ButtonIcon, {
            label: item.title
          }) : undefined,
          appearance: item.appearance,
          target: item.target,
          onClick: onClickHandler,
          onMouseEnter: function onMouseEnter() {
            return dispatchCommand(item.onMouseEnter);
          },
          onMouseLeave: function onMouseLeave() {
            return dispatchCommand(item.onMouseLeave);
          },
          onFocus: function onFocus() {
            return dispatchCommand(item.onFocus);
          },
          onBlur: function onBlur() {
            return dispatchCommand(item.onBlur);
          },
          selected: item.selected,
          disabled: item.disabled,
          tooltipContent: item.tooltipContent,
          testId: item.testId,
          hideTooltipOnClick: item.hideTooltipOnClick,
          ariaHasPopup: item.ariaHasPopup,
          tabIndex: item.tabIndex
        }, item.showTitle && item.title);

      case 'input':
        return (0, _react2.jsx)(_Input.default, {
          key: idx,
          mountPoint: popupsMountPoint,
          boundariesElement: popupsBoundariesElement,
          defaultValue: item.defaultValue,
          placeholder: item.placeholder,
          onSubmit: function onSubmit(value) {
            return dispatchCommand(item.onSubmit(value));
          },
          onBlur: function onBlur(value) {
            return dispatchCommand(item.onBlur(value));
          }
        });

      case 'custom':
        {
          return item.render(editorView, idx, dispatchAnalyticsEvent);
        }

      case 'dropdown':
        var DropdownIcon = item.icon;
        return (0, _react2.jsx)(_Dropdown.default, {
          key: idx,
          title: item.title,
          icon: DropdownIcon && (0, _react2.jsx)(DropdownIcon, {
            label: item.title
          }),
          dispatchCommand: dispatchCommand,
          options: item.options,
          disabled: item.disabled,
          tooltip: item.tooltip,
          hideExpandIcon: item.hideExpandIcon,
          mountPoint: popupsMountPoint,
          boundariesElement: popupsBoundariesElement,
          scrollableElement: popupsScrollableElement,
          dropdownWidth: item.dropdownWidth,
          showSelected: item.showSelected,
          setDisableParentScroll: scrollable ? setDisableScroll : undefined
        });

      case 'select':
        if (item.selectType === 'list') {
          return (0, _react2.jsx)(_Select.default, {
            key: idx,
            dispatchCommand: dispatchCommand,
            options: item.options,
            hideExpandIcon: item.hideExpandIcon,
            mountPoint: scrollable ? mountRef.current : undefined,
            boundariesElement: popupsBoundariesElement,
            scrollableElement: popupsScrollableElement,
            defaultValue: item.defaultValue,
            placeholder: item.placeholder,
            onChange: function onChange(selected) {
              return dispatchCommand(item.onChange(selected));
            },
            filterOption: item.filterOption,
            setDisableParentScroll: scrollable ? setDisableScroll : undefined
          });
        }

        if (item.selectType === 'color') {
          return (0, _react2.jsx)(_ColorPickerButton.default, {
            key: idx,
            title: item.title,
            onChange: function onChange(selected) {
              dispatchCommand(item.onChange(selected));
            },
            colorPalette: item.options,
            currentColor: item.defaultValue ? item.defaultValue.value : undefined,
            placement: "Panels",
            mountPoint: emojiAndColourPickerMountPoint,
            setDisableParentScroll: scrollable ? setDisableScroll : undefined
          });
        }

        if (item.selectType === 'emoji') {
          return (0, _react2.jsx)(_EmojiPickerButton.EmojiPickerButton, {
            key: idx,
            editorView: editorView,
            title: item.title,
            providerFactory: providerFactory,
            isSelected: item.selected,
            onChange: function onChange(selected) {
              return dispatchCommand(item.onChange(selected));
            },
            mountPoint: emojiAndColourPickerMountPoint,
            setDisableParentScroll: scrollable ? setDisableScroll : undefined
          });
        }

        return null;

      case 'extensions-placeholder':
        if (!editorView || !extensionsProvider) {
          return null;
        }

        var _ref2 = (0, _featureFlagsContext.getFeatureFlags)(editorView.state) || {},
            extendFloatingToolbar = _ref2.extendFloatingToolbar;

        if (!extendFloatingToolbar) {
          return null;
        }

        return (0, _react2.jsx)(_ExtensionsPlaceholder.ExtensionsPlaceholder, {
          key: idx,
          node: node,
          editorView: editorView,
          extensionProvider: extensionsProvider,
          separator: item.separator
        });

      case 'separator':
        return (0, _react2.jsx)(_Separator.default, {
          key: idx
        });
    }
  }));
}, function (prevProps, nextProps) {
  if (!nextProps.node) {
    return false;
  } // only rerender toolbar items if the node is different
  // otherwise it causes an issue where multiple popups stays open


  return !(prevProps.node.type !== nextProps.node.type || prevProps.node.attrs.localId !== nextProps.node.attrs.localId || !areSameItems(prevProps.items, nextProps.items) || !prevProps.mounted !== !nextProps.mounted);
});

var toolbarContainer = function toolbarContainer(theme, scrollable, hasSelect, firstElementIsSelect) {
  return (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  line-height: 1;\n  box-sizing: border-box;\n\n  & > div > div {\n    align-items: center;\n  }\n  ", "\n"])), (0, _components.themed)({
    light: (0, _tokens.token)('elevation.surface.overlay', 'white'),
    dark: (0, _tokens.token)('elevation.surface.overlay', _colors.DN70)
  })(theme), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)"), scrollable ? (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n        ", "\n        overflow: hidden;\n      "])), hasSelect ? (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n              height: 40px;\n            "]))) : (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n              height: 32px;\n            "])))) : (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n        padding: ", "px ", "px;\n        ", "\n      "])), akGridSize / 2, akGridSize, firstElementIsSelect && (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n          padding-left: ", "px;\n        "])), akGridSize / 2)));
};

var toolbarOverflow = function toolbarOverflow(scrollable, scrollDisabled, firstElementIsSelect) {
  return (0, _react2.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n"])), scrollable ? (0, _react2.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n        ", "\n        -webkit-overflow-scrolling: touch;\n        padding: ", "px 0 50px;\n        > div {\n          > div:first-child {\n            ", "\n          }\n          > div:last-child {\n            margin-right: ", "px;\n          }\n        }\n      "])), scrollDisabled ? (0, _react2.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n              overflow: hidden;\n            "]))) : (0, _react2.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n              overflow-x: auto;\n              overflow-y: hidden;\n            "]))), akGridSize / 2, firstElementIsSelect ? (0, _react2.css)(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2.default)(["\n                  margin-left: ", "px;\n                "])), akGridSize / 2) : (0, _react2.css)(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2.default)(["\n                  margin-left: ", "px;\n                "])), akGridSize), akGridSize) : (0, _react2.css)(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2.default)(["\n        display: flex;\n      "]))));
};

function makeSameType(_a, _b) {
  return true;
}

var compareItemWithKeys = function compareItemWithKeys(leftItem, rightItem) {
  var excludedKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return Object.keys(leftItem).filter(function (key) {
    return excludedKeys.indexOf(key) === -1;
  }).every(function (key) {
    return leftItem[key] instanceof Object ? (0, _utils.shallowEqual)(leftItem[key], rightItem[key]) : leftItem[key] === rightItem[key];
  });
};

var isSameItem = function isSameItem(leftItem, rightItem) {
  if (leftItem.type !== rightItem.type) {
    return false;
  }

  switch (leftItem.type) {
    case 'button':
      // Need to typecast `rightItem as typeof leftItem` otherwise we will
      // have to put the `type !==` inside each case.
      return compareItemWithKeys(leftItem, rightItem, ['type', 'onClick', 'onMouseEnter', 'onMouseLeave']);

    case 'copy-button':
      return compareItemWithKeys(leftItem, rightItem, ['type', 'items']);

    case 'input':
      return compareItemWithKeys(leftItem, rightItem, ['type', 'onSubmit', 'onBlur']);

    case 'select':
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !(0, _utils.compareArrays)(leftItem.options, rightItem.options, function (left, right) {
        return compareItemWithKeys(left, right);
      })) {
        return false;
      }

      return compareItemWithKeys(leftItem, rightItem, ['type', 'onChange', 'options']);

    case 'dropdown':
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !(0, _utils.compareArrays)(leftItem.options, rightItem.options, function (left, right) {
        return compareItemWithKeys(left, right, ['onClick']);
      })) {
        return false;
      }

      return compareItemWithKeys(leftItem, rightItem, ['type', 'options']);

    case 'custom':
      return false;

    case 'separator':
      return compareItemWithKeys(leftItem, rightItem);

    case 'extensions-placeholder':
      return compareItemWithKeys(leftItem, rightItem);
  }
};

exports.isSameItem = isSameItem;

var areSameItems = function areSameItems(leftArr, rightArr) {
  if (leftArr === undefined && rightArr === undefined) {
    return true;
  }

  if (leftArr === undefined || rightArr === undefined) {
    return false;
  }

  if (leftArr.length !== rightArr.length) {
    return false;
  }

  return leftArr.every(function (item, index) {
    return isSameItem(rightArr[index], item);
  });
};

exports.areSameItems = areSameItems;

var Toolbar = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Toolbar, _Component);

  var _super = _createSuper(Toolbar);

  function Toolbar(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Toolbar);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "focusToolbar", function (event) {
      if (event.altKey && event.keyCode === 121) {
        var _getFirstFocusableEle, _this$toolbarContaine;

        (_getFirstFocusableEle = (0, _utils.getFirstFocusableElement)((_this$toolbarContaine = _this.toolbarContainerRef) === null || _this$toolbarContaine === void 0 ? void 0 : _this$toolbarContaine.current)) === null || _getFirstFocusableEle === void 0 ? void 0 : _getFirstFocusableEle.focus();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyDown", function (event) {
      var _this$props$items;

      //To prevent the keydown handing of arrow keys for 'hyper link floating toolbar'
      if ((_this$props$items = _this.props.items) !== null && _this$props$items !== void 0 && _this$props$items.find(function (item) {
        return item.type === 'custom' && item.disableArrowNavigation;
      })) {
        return;
      }

      if (event.key === 'Escape') {
        var _this$props$editorVie;

        (_this$props$editorVie = _this.props.editorView) === null || _this$props$editorVie === void 0 ? void 0 : _this$props$editorVie.focus();
        event.preventDefault();
        event.stopPropagation();
      } else {
        var _this$toolbarContaine2, _this$toolbarContaine3, _this$toolbarContaine4;

        //To trap the focus inside the toolbar using left and right arrow keys
        var focusableElements = (0, _utils.getFocusableElements)((_this$toolbarContaine2 = _this.toolbarContainerRef) === null || _this$toolbarContaine2 === void 0 ? void 0 : _this$toolbarContaine2.current);
        var firstFocsuableElement = (0, _utils.getFirstFocusableElement)((_this$toolbarContaine3 = _this.toolbarContainerRef) === null || _this$toolbarContaine3 === void 0 ? void 0 : _this$toolbarContaine3.current);
        var lastFocsuableElement = (0, _utils.getLastFocusableElement)((_this$toolbarContaine4 = _this.toolbarContainerRef) === null || _this$toolbarContaine4 === void 0 ? void 0 : _this$toolbarContaine4.current);

        if (!focusableElements || focusableElements.length === 0) {
          return;
        }

        if (event.key === 'ArrowRight') {
          if (_this.currentSelectedItemIndex === focusableElements.length - 1) {
            firstFocsuableElement === null || firstFocsuableElement === void 0 ? void 0 : firstFocsuableElement.focus();
            _this.currentSelectedItemIndex = 0;
          } else {
            var _focusableElements;

            (_focusableElements = focusableElements[_this.currentSelectedItemIndex + 1]) === null || _focusableElements === void 0 ? void 0 : _focusableElements.focus();
            _this.currentSelectedItemIndex++;
          }
        } else if (event.key === 'ArrowLeft') {
          if (_this.currentSelectedItemIndex === 0) {
            lastFocsuableElement === null || lastFocsuableElement === void 0 ? void 0 : lastFocsuableElement.focus();
            _this.currentSelectedItemIndex = focusableElements.length - 1;
          } else {
            var _focusableElements2;

            (_focusableElements2 = focusableElements[_this.currentSelectedItemIndex - 1]) === null || _focusableElements2 === void 0 ? void 0 : _focusableElements2.focus();
            _this.currentSelectedItemIndex--;
          }
        }
      }
    });
    _this.scrollContainerRef = /*#__PURE__*/_react.default.createRef();
    _this.mountRef = /*#__PURE__*/_react.default.createRef();
    _this.toolbarContainerRef = /*#__PURE__*/_react.default.createRef();
    _this.state = {
      scrollDisabled: false,
      mounted: false
    };
    _this.currentSelectedItemIndex = 0;
    return _this;
  } // remove any decorations added by toolbar buttons i.e danger and selected styling
  // this prevents https://product-fabric.atlassian.net/browse/ED-10207


  (0, _createClass2.default)(Toolbar, [{
    key: "resetStyling",
    value: function resetStyling(_ref3) {
      var table = _ref3.table;

      if (this.props.editorView) {
        var _this$props$editorVie2 = this.props.editorView,
            state = _this$props$editorVie2.state,
            dispatch = _this$props$editorVie2.dispatch; // tables use their own decorations
        // TODO fix for tables https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-617

        if (table) {
          return null;
        }

        dispatch(state.tr.setMeta(_decoration.decorationStateKey, {
          action: _decoration.ACTIONS.DECORATION_REMOVE
        }));
      }
    }
  }, {
    key: "setDisableScroll",
    value: function setDisableScroll(disabled) {
      var _this2 = this;

      // wait before setting disabled state incase users jumping from one popup to another
      if (disabled) {
        requestAnimationFrame(function () {
          _this2.setState({
            scrollDisabled: disabled
          });
        });
      } else {
        this.setState({
          scrollDisabled: disabled
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        mounted: true
      });
      document.addEventListener('keydown', this.focusToolbar);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.node !== prevProps.node) {
        this.resetStyling({
          table: (prevProps === null || prevProps === void 0 ? void 0 : prevProps.node.type.name) === 'table'
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.resetStyling({
        table: this.props.node.type.name === 'table'
      });
      document.removeEventListener('keydown', this.focusToolbar);
    }
    /**
     * To listen to keyboard shortcut Alt+F10 and focus floating toolbar's first focusable element.
     * @param event
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          items = _this$props.items,
          className = _this$props.className,
          node = _this$props.node,
          intl = _this$props.intl,
          scrollable = _this$props.scrollable;

      if (!items || !items.length) {
        return null;
      } // Select has left padding of 4px to the border, everything else 8px


      var firstElementIsSelect = items[0].type === 'select';
      var hasSelect = items.find(function (item) {
        return item.type === 'select' && item.selectType === 'list';
      });
      return (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)("div", {
        ref: this.toolbarContainerRef,
        css: function css(theme) {
          return [toolbarContainer({
            theme: theme
          }, scrollable, hasSelect !== undefined, firstElementIsSelect)];
        },
        "aria-label": intl.formatMessage(_messages.default.floatingToolbarAriaLabel),
        role: "toolbar",
        className: className,
        onKeyDown: this.handleKeyDown
      }, (0, _react2.jsx)(_announcer.default, {
        text: intl.formatMessage(_messages.default.floatingToolbarAnnouncer),
        delay: 250
      }), (0, _react2.jsx)("div", {
        ref: this.scrollContainerRef,
        css: toolbarOverflow(scrollable, this.state.scrollDisabled, firstElementIsSelect)
      }, (0, _react2.jsx)(ToolbarItems, (0, _extends2.default)({}, this.props, {
        setDisableScroll: this.setDisableScroll.bind(this),
        mountRef: this.mountRef,
        mounted: this.state.mounted
      }))), scrollable && (0, _react2.jsx)(_ScrollButtons.default, {
        intl: intl,
        scrollContainerRef: this.scrollContainerRef,
        node: node,
        disabled: this.state.scrollDisabled
      })), (0, _react2.jsx)("div", {
        ref: this.mountRef
      }));
    }
  }]);
  return Toolbar;
}(_react.Component);

var _default = (0, _reactIntlNext.injectIntl)(Toolbar);

exports.default = _default;