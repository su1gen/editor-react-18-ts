import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { DN70 } from '@atlaskit/theme/colors';
import { getFeatureFlags } from '../../feature-flags-context';
import { compareArrays, getFirstFocusableElement, getLastFocusableElement, getFocusableElements, shallowEqual } from '../utils';
import { showConfirmDialog } from '../pm-plugins/toolbar-data/commands';
import Button from './Button';
import Dropdown from './Dropdown';
import Select from './Select';
import Separator from './Separator';
import Input from './Input';
import { ExtensionsPlaceholder } from './ExtensionsPlaceholder';
import ColorPickerButton from '../../../ui/ColorPickerButton';
import { EmojiPickerButton } from './EmojiPickerButton';
import Announcer from '../../../utils/announcer/announcer';
import { injectIntl } from 'react-intl-next';
import messages from './messages';
import { token } from '@atlaskit/tokens';
import { decorationStateKey, ACTIONS } from '../../base/pm-plugins/decoration';
import ScrollButtons from './ScrollButtons';
var akGridSize = gridSize();
var ToolbarItems = /*#__PURE__*/React.memo(function (_ref) {
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
  return jsx(ButtonGroup, null, items.filter(function (item) {
    return !item.hidden;
  }).map(function (item, idx) {
    switch (item.type) {
      case 'button':
        var ButtonIcon = item.icon;

        var onClickHandler = function onClickHandler() {
          if (item.confirmDialog) {
            dispatchCommand(showConfirmDialog(idx));
          } else {
            dispatchCommand(item.onClick);
          }
        };

        return jsx(Button, {
          className: item.className,
          key: idx,
          title: item.title,
          href: item.href,
          icon: item.icon ? jsx(ButtonIcon, {
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
        return jsx(Input, {
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
        return jsx(Dropdown, {
          key: idx,
          title: item.title,
          icon: DropdownIcon && jsx(DropdownIcon, {
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
          return jsx(Select, {
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
          return jsx(ColorPickerButton, {
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
          return jsx(EmojiPickerButton, {
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

        var _ref2 = getFeatureFlags(editorView.state) || {},
            extendFloatingToolbar = _ref2.extendFloatingToolbar;

        if (!extendFloatingToolbar) {
          return null;
        }

        return jsx(ExtensionsPlaceholder, {
          key: idx,
          node: node,
          editorView: editorView,
          extensionProvider: extensionsProvider,
          separator: item.separator
        });

      case 'separator':
        return jsx(Separator, {
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
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background-color: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  line-height: 1;\n  box-sizing: border-box;\n\n  & > div > div {\n    align-items: center;\n  }\n  ", "\n"])), themed({
    light: token('elevation.surface.overlay', 'white'),
    dark: token('elevation.surface.overlay', DN70)
  })(theme), borderRadius(), token('elevation.shadow.overlay', "0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)"), scrollable ? css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        ", "\n        overflow: hidden;\n      "])), hasSelect ? css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n              height: 40px;\n            "]))) : css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n              height: 32px;\n            "])))) : css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n        padding: ", "px ", "px;\n        ", "\n      "])), akGridSize / 2, akGridSize, firstElementIsSelect && css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n          padding-left: ", "px;\n        "])), akGridSize / 2)));
};

var toolbarOverflow = function toolbarOverflow(scrollable, scrollDisabled, firstElementIsSelect) {
  return css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  ", "\n"])), scrollable ? css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n        ", "\n        -webkit-overflow-scrolling: touch;\n        padding: ", "px 0 50px;\n        > div {\n          > div:first-child {\n            ", "\n          }\n          > div:last-child {\n            margin-right: ", "px;\n          }\n        }\n      "])), scrollDisabled ? css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n              overflow: hidden;\n            "]))) : css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n              overflow-x: auto;\n              overflow-y: hidden;\n            "]))), akGridSize / 2, firstElementIsSelect ? css(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n                  margin-left: ", "px;\n                "])), akGridSize / 2) : css(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n                  margin-left: ", "px;\n                "])), akGridSize), akGridSize) : css(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n        display: flex;\n      "]))));
};

function makeSameType(_a, _b) {
  return true;
}

var compareItemWithKeys = function compareItemWithKeys(leftItem, rightItem) {
  var excludedKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return Object.keys(leftItem).filter(function (key) {
    return excludedKeys.indexOf(key) === -1;
  }).every(function (key) {
    return leftItem[key] instanceof Object ? shallowEqual(leftItem[key], rightItem[key]) : leftItem[key] === rightItem[key];
  });
};

export var isSameItem = function isSameItem(leftItem, rightItem) {
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
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !compareArrays(leftItem.options, rightItem.options, function (left, right) {
        return compareItemWithKeys(left, right);
      })) {
        return false;
      }

      return compareItemWithKeys(leftItem, rightItem, ['type', 'onChange', 'options']);

    case 'dropdown':
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !compareArrays(leftItem.options, rightItem.options, function (left, right) {
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
export var areSameItems = function areSameItems(leftArr, rightArr) {
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

var Toolbar = /*#__PURE__*/function (_Component) {
  _inherits(Toolbar, _Component);

  var _super = _createSuper(Toolbar);

  function Toolbar(props) {
    var _this;

    _classCallCheck(this, Toolbar);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "focusToolbar", function (event) {
      if (event.altKey && event.keyCode === 121) {
        var _getFirstFocusableEle, _this$toolbarContaine;

        (_getFirstFocusableEle = getFirstFocusableElement((_this$toolbarContaine = _this.toolbarContainerRef) === null || _this$toolbarContaine === void 0 ? void 0 : _this$toolbarContaine.current)) === null || _getFirstFocusableEle === void 0 ? void 0 : _getFirstFocusableEle.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (event) {
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
        var focusableElements = getFocusableElements((_this$toolbarContaine2 = _this.toolbarContainerRef) === null || _this$toolbarContaine2 === void 0 ? void 0 : _this$toolbarContaine2.current);
        var firstFocsuableElement = getFirstFocusableElement((_this$toolbarContaine3 = _this.toolbarContainerRef) === null || _this$toolbarContaine3 === void 0 ? void 0 : _this$toolbarContaine3.current);
        var lastFocsuableElement = getLastFocusableElement((_this$toolbarContaine4 = _this.toolbarContainerRef) === null || _this$toolbarContaine4 === void 0 ? void 0 : _this$toolbarContaine4.current);

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

    _this.scrollContainerRef = /*#__PURE__*/React.createRef();
    _this.mountRef = /*#__PURE__*/React.createRef();
    _this.toolbarContainerRef = /*#__PURE__*/React.createRef();
    _this.state = {
      scrollDisabled: false,
      mounted: false
    };
    _this.currentSelectedItemIndex = 0;
    return _this;
  } // remove any decorations added by toolbar buttons i.e danger and selected styling
  // this prevents https://product-fabric.atlassian.net/browse/ED-10207


  _createClass(Toolbar, [{
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

        dispatch(state.tr.setMeta(decorationStateKey, {
          action: ACTIONS.DECORATION_REMOVE
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
      return jsx(React.Fragment, null, jsx("div", {
        ref: this.toolbarContainerRef,
        css: function css(theme) {
          return [toolbarContainer({
            theme: theme
          }, scrollable, hasSelect !== undefined, firstElementIsSelect)];
        },
        "aria-label": intl.formatMessage(messages.floatingToolbarAriaLabel),
        role: "toolbar",
        className: className,
        onKeyDown: this.handleKeyDown
      }, jsx(Announcer, {
        text: intl.formatMessage(messages.floatingToolbarAnnouncer),
        delay: 250
      }), jsx("div", {
        ref: this.scrollContainerRef,
        css: toolbarOverflow(scrollable, this.state.scrollDisabled, firstElementIsSelect)
      }, jsx(ToolbarItems, _extends({}, this.props, {
        setDisableScroll: this.setDisableScroll.bind(this),
        mountRef: this.mountRef,
        mounted: this.state.mounted
      }))), scrollable && jsx(ScrollButtons, {
        intl: intl,
        scrollContainerRef: this.scrollContainerRef,
        node: node,
        disabled: this.state.scrollDisabled
      })), jsx("div", {
        ref: this.mountRef
      }));
    }
  }]);

  return Toolbar;
}(Component);

export default injectIntl(Toolbar);