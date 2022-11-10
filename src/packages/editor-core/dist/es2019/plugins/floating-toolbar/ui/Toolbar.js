import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

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
const akGridSize = gridSize();
const ToolbarItems = /*#__PURE__*/React.memo(({
  items,
  dispatchCommand,
  popupsMountPoint,
  popupsBoundariesElement,
  editorView,
  dispatchAnalyticsEvent,
  popupsScrollableElement,
  scrollable,
  providerFactory,
  extensionsProvider,
  node,
  setDisableScroll,
  mountRef
}) => {
  const emojiAndColourPickerMountPoint = scrollable ? popupsMountPoint || (editorView === null || editorView === void 0 ? void 0 : editorView.dom.closest('.fabric-editor-popup-scroll-parent')) || (editorView === null || editorView === void 0 ? void 0 : editorView.dom.closest('.ak-editor-content-area')) || undefined : popupsMountPoint;
  return jsx(ButtonGroup, null, items.filter(item => !item.hidden).map((item, idx) => {
    switch (item.type) {
      case 'button':
        const ButtonIcon = item.icon;

        const onClickHandler = () => {
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
          onMouseEnter: () => dispatchCommand(item.onMouseEnter),
          onMouseLeave: () => dispatchCommand(item.onMouseLeave),
          onFocus: () => dispatchCommand(item.onFocus),
          onBlur: () => dispatchCommand(item.onBlur),
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
          onSubmit: value => dispatchCommand(item.onSubmit(value)),
          onBlur: value => dispatchCommand(item.onBlur(value))
        });

      case 'custom':
        {
          return item.render(editorView, idx, dispatchAnalyticsEvent);
        }

      case 'dropdown':
        const DropdownIcon = item.icon;
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
            onChange: selected => dispatchCommand(item.onChange(selected)),
            filterOption: item.filterOption,
            setDisableParentScroll: scrollable ? setDisableScroll : undefined
          });
        }

        if (item.selectType === 'color') {
          return jsx(ColorPickerButton, {
            key: idx,
            title: item.title,
            onChange: selected => {
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
            onChange: selected => dispatchCommand(item.onChange(selected)),
            mountPoint: emojiAndColourPickerMountPoint,
            setDisableParentScroll: scrollable ? setDisableScroll : undefined
          });
        }

        return null;

      case 'extensions-placeholder':
        if (!editorView || !extensionsProvider) {
          return null;
        }

        const {
          extendFloatingToolbar
        } = getFeatureFlags(editorView.state) || {};

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
}, (prevProps, nextProps) => {
  if (!nextProps.node) {
    return false;
  } // only rerender toolbar items if the node is different
  // otherwise it causes an issue where multiple popups stays open


  return !(prevProps.node.type !== nextProps.node.type || prevProps.node.attrs.localId !== nextProps.node.attrs.localId || !areSameItems(prevProps.items, nextProps.items) || !prevProps.mounted !== !nextProps.mounted);
});

const toolbarContainer = (theme, scrollable, hasSelect, firstElementIsSelect) => css`
  background-color: ${themed({
  light: token('elevation.surface.overlay', 'white'),
  dark: token('elevation.surface.overlay', DN70)
})(theme)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token('elevation.shadow.overlay', `0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)`)};
  display: flex;
  line-height: 1;
  box-sizing: border-box;

  & > div > div {
    align-items: center;
  }
  ${scrollable ? css`
        ${hasSelect ? css`
              height: 40px;
            ` : css`
              height: 32px;
            `}
        overflow: hidden;
      ` : css`
        padding: ${akGridSize / 2}px ${akGridSize}px;
        ${firstElementIsSelect && css`
          padding-left: ${akGridSize / 2}px;
        `}
      `}
`;

const toolbarOverflow = (scrollable, scrollDisabled, firstElementIsSelect) => css`
  ${scrollable ? css`
        ${scrollDisabled ? css`
              overflow: hidden;
            ` : css`
              overflow-x: auto;
              overflow-y: hidden;
            `}
        -webkit-overflow-scrolling: touch;
        padding: ${akGridSize / 2}px 0 50px;
        > div {
          > div:first-child {
            ${firstElementIsSelect ? css`
                  margin-left: ${akGridSize / 2}px;
                ` : css`
                  margin-left: ${akGridSize}px;
                `}
          }
          > div:last-child {
            margin-right: ${akGridSize}px;
          }
        }
      ` : css`
        display: flex;
      `}
`;

function makeSameType(_a, _b) {
  return true;
}

const compareItemWithKeys = (leftItem, rightItem, excludedKeys = []) => Object.keys(leftItem).filter(key => excludedKeys.indexOf(key) === -1).every(key => leftItem[key] instanceof Object ? shallowEqual(leftItem[key], rightItem[key]) : leftItem[key] === rightItem[key]);

export const isSameItem = (leftItem, rightItem) => {
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
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !compareArrays(leftItem.options, rightItem.options, (left, right) => compareItemWithKeys(left, right))) {
        return false;
      }

      return compareItemWithKeys(leftItem, rightItem, ['type', 'onChange', 'options']);

    case 'dropdown':
      if (makeSameType(leftItem, rightItem) && Array.isArray(leftItem.options) && Array.isArray(rightItem.options) && !compareArrays(leftItem.options, rightItem.options, (left, right) => compareItemWithKeys(left, right, ['onClick']))) {
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
export const areSameItems = (leftArr, rightArr) => {
  if (leftArr === undefined && rightArr === undefined) {
    return true;
  }

  if (leftArr === undefined || rightArr === undefined) {
    return false;
  }

  if (leftArr.length !== rightArr.length) {
    return false;
  }

  return leftArr.every((item, index) => isSameItem(rightArr[index], item));
};

class Toolbar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "focusToolbar", event => {
      if (event.altKey && event.keyCode === 121) {
        var _getFirstFocusableEle, _this$toolbarContaine;

        (_getFirstFocusableEle = getFirstFocusableElement((_this$toolbarContaine = this.toolbarContainerRef) === null || _this$toolbarContaine === void 0 ? void 0 : _this$toolbarContaine.current)) === null || _getFirstFocusableEle === void 0 ? void 0 : _getFirstFocusableEle.focus();
      }
    });

    _defineProperty(this, "handleKeyDown", event => {
      var _this$props$items;

      //To prevent the keydown handing of arrow keys for 'hyper link floating toolbar'
      if ((_this$props$items = this.props.items) !== null && _this$props$items !== void 0 && _this$props$items.find(item => item.type === 'custom' && item.disableArrowNavigation)) {
        return;
      }

      if (event.key === 'Escape') {
        var _this$props$editorVie;

        (_this$props$editorVie = this.props.editorView) === null || _this$props$editorVie === void 0 ? void 0 : _this$props$editorVie.focus();
        event.preventDefault();
        event.stopPropagation();
      } else {
        var _this$toolbarContaine2, _this$toolbarContaine3, _this$toolbarContaine4;

        //To trap the focus inside the toolbar using left and right arrow keys
        const focusableElements = getFocusableElements((_this$toolbarContaine2 = this.toolbarContainerRef) === null || _this$toolbarContaine2 === void 0 ? void 0 : _this$toolbarContaine2.current);
        const firstFocsuableElement = getFirstFocusableElement((_this$toolbarContaine3 = this.toolbarContainerRef) === null || _this$toolbarContaine3 === void 0 ? void 0 : _this$toolbarContaine3.current);
        const lastFocsuableElement = getLastFocusableElement((_this$toolbarContaine4 = this.toolbarContainerRef) === null || _this$toolbarContaine4 === void 0 ? void 0 : _this$toolbarContaine4.current);

        if (!focusableElements || focusableElements.length === 0) {
          return;
        }

        if (event.key === 'ArrowRight') {
          if (this.currentSelectedItemIndex === focusableElements.length - 1) {
            firstFocsuableElement === null || firstFocsuableElement === void 0 ? void 0 : firstFocsuableElement.focus();
            this.currentSelectedItemIndex = 0;
          } else {
            var _focusableElements;

            (_focusableElements = focusableElements[this.currentSelectedItemIndex + 1]) === null || _focusableElements === void 0 ? void 0 : _focusableElements.focus();
            this.currentSelectedItemIndex++;
          }
        } else if (event.key === 'ArrowLeft') {
          if (this.currentSelectedItemIndex === 0) {
            lastFocsuableElement === null || lastFocsuableElement === void 0 ? void 0 : lastFocsuableElement.focus();
            this.currentSelectedItemIndex = focusableElements.length - 1;
          } else {
            var _focusableElements2;

            (_focusableElements2 = focusableElements[this.currentSelectedItemIndex - 1]) === null || _focusableElements2 === void 0 ? void 0 : _focusableElements2.focus();
            this.currentSelectedItemIndex--;
          }
        }
      }
    });

    this.scrollContainerRef = /*#__PURE__*/React.createRef();
    this.mountRef = /*#__PURE__*/React.createRef();
    this.toolbarContainerRef = /*#__PURE__*/React.createRef();
    this.state = {
      scrollDisabled: false,
      mounted: false
    };
    this.currentSelectedItemIndex = 0;
  } // remove any decorations added by toolbar buttons i.e danger and selected styling
  // this prevents https://product-fabric.atlassian.net/browse/ED-10207


  resetStyling({
    table
  }) {
    if (this.props.editorView) {
      const {
        state,
        dispatch
      } = this.props.editorView; // tables use their own decorations
      // TODO fix for tables https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-617

      if (table) {
        return null;
      }

      dispatch(state.tr.setMeta(decorationStateKey, {
        action: ACTIONS.DECORATION_REMOVE
      }));
    }
  }

  setDisableScroll(disabled) {
    // wait before setting disabled state incase users jumping from one popup to another
    if (disabled) {
      requestAnimationFrame(() => {
        this.setState({
          scrollDisabled: disabled
        });
      });
    } else {
      this.setState({
        scrollDisabled: disabled
      });
    }
  }

  componentDidMount() {
    this.setState({
      mounted: true
    });
    document.addEventListener('keydown', this.focusToolbar);
  }

  componentDidUpdate(prevProps) {
    if (this.props.node !== prevProps.node) {
      this.resetStyling({
        table: (prevProps === null || prevProps === void 0 ? void 0 : prevProps.node.type.name) === 'table'
      });
    }
  }

  componentWillUnmount() {
    this.resetStyling({
      table: this.props.node.type.name === 'table'
    });
    document.removeEventListener('keydown', this.focusToolbar);
  }
  /**
   * To listen to keyboard shortcut Alt+F10 and focus floating toolbar's first focusable element.
   * @param event
   */


  render() {
    const {
      items,
      className,
      node,
      intl,
      scrollable
    } = this.props;

    if (!items || !items.length) {
      return null;
    } // Select has left padding of 4px to the border, everything else 8px


    const firstElementIsSelect = items[0].type === 'select';
    const hasSelect = items.find(item => item.type === 'select' && item.selectType === 'list');
    return jsx(React.Fragment, null, jsx("div", {
      ref: this.toolbarContainerRef,
      css: theme => [toolbarContainer({
        theme
      }, scrollable, hasSelect !== undefined, firstElementIsSelect)],
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

}

export default injectIntl(Toolbar);