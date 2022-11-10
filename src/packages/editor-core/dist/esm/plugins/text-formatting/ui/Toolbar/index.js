import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React, { useMemo, useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { separatorStyles, wrapperStyle, buttonGroupStyle } from '../../../../ui/styles';
import { useFormattingIcons, useHasFormattingActived } from './hooks/formatting-icons';
import { useClearIcon } from './hooks/clear-formatting-icon';
import { useResponsiveToolbarButtons, useResponsiveIconTypeMenu } from './hooks/responsive-toolbar-buttons';
import { SingleToolbarButtons } from './single-toolbar-buttons';
import { MoreButton } from './more-button';
import { FormattingTextDropdownMenu } from './dropdown-menu';
import { toolbarMessages } from './toolbar-messages';
import { usePreviousObjectState, compareItemsArrays, isArrayContainsContent } from '../../utils';
import Announcer from '../../../../utils/announcer/announcer';

var ToolbarFormatting = function ToolbarFormatting(_ref) {
  var shouldUseResponsiveToolbar = _ref.shouldUseResponsiveToolbar,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      editorView = _ref.editorView,
      toolbarSize = _ref.toolbarSize,
      isReducedSpacing = _ref.isReducedSpacing,
      isToolbarDisabled = _ref.isToolbarDisabled,
      intl = _ref.intl;
  var editorState = useMemo(function () {
    return editorView.state;
  }, [editorView.state]);

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      message = _useState2[0],
      setMessage = _useState2[1];

  var defaultIcons = useFormattingIcons({
    editorState: editorState,
    intl: intl,
    isToolbarDisabled: isToolbarDisabled
  });
  var clearIcon = useClearIcon({
    editorState: editorState,
    intl: intl
  });
  var menuIconTypeList = useResponsiveIconTypeMenu({
    toolbarSize: toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  });
  var hasFormattingActive = useHasFormattingActived({
    editorState: editorView.state,
    iconTypeList: menuIconTypeList
  });

  var _useResponsiveToolbar = useResponsiveToolbarButtons({
    icons: defaultIcons,
    toolbarSize: toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  }),
      dropdownItems = _useResponsiveToolbar.dropdownItems,
      singleItems = _useResponsiveToolbar.singleItems;

  var clearFormattingStatus = intl.formatMessage(toolbarMessages.textFormattingOff);
  var superscriptOffSubscriptOnStatus = intl.formatMessage(toolbarMessages.superscriptOffSubscriptOn);
  var subscriptOffSuperscriptOnStatus = intl.formatMessage(toolbarMessages.subscriptOffSuperscriptOn);
  var activeItems = [].concat(_toConsumableArray(dropdownItems), _toConsumableArray(singleItems)).filter(function (item) {
    return item.isActive;
  });
  var prevActiveItems = usePreviousObjectState(activeItems);
  var fromSuperscriptToSubscript = isArrayContainsContent(activeItems, 'Subscript') && isArrayContainsContent(prevActiveItems, 'Superscript');
  var fromSubscriptToSuperscript = isArrayContainsContent(activeItems, 'Superscript') && isArrayContainsContent(prevActiveItems, 'Subscript');
  var comparedItems;
  var screenReaderMessage = '';

  if (prevActiveItems && activeItems.length > prevActiveItems.length) {
    comparedItems = compareItemsArrays(activeItems, prevActiveItems);
    screenReaderMessage = intl.formatMessage(toolbarMessages.on, {
      formattingType: comparedItems[0].content
    });
  } else {
    comparedItems = compareItemsArrays(prevActiveItems, activeItems);

    if (comparedItems && comparedItems.length) {
      var _activeItems$;

      screenReaderMessage = intl.formatMessage(toolbarMessages.off, {
        formattingType: comparedItems[0].content
      });

      if (((_activeItems$ = activeItems[0]) === null || _activeItems$ === void 0 ? void 0 : _activeItems$.content) === 'Code') {
        screenReaderMessage = intl.formatMessage(toolbarMessages.codeOn, {
          textFormattingOff: (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1 ? clearFormattingStatus : screenReaderMessage
        });
      }

      if (fromSuperscriptToSubscript) {
        screenReaderMessage = superscriptOffSubscriptOnStatus;
      }

      if (fromSubscriptToSuperscript) {
        screenReaderMessage = subscriptOffSuperscriptOnStatus;
      }
    }
  } // handle 'Clear formatting' status for screen readers


  if (!(activeItems !== null && activeItems !== void 0 && activeItems.length) && (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1) {
    screenReaderMessage = clearFormattingStatus;
  }

  var items = useMemo(function () {
    if (!clearIcon) {
      return dropdownItems;
    }

    return [].concat(_toConsumableArray(dropdownItems), [clearIcon]);
  }, [clearIcon, dropdownItems]);
  var moreFormattingButtonLabel = intl.formatMessage(toolbarMessages.moreFormatting);
  useEffect(function () {
    if (screenReaderMessage) {
      setMessage(screenReaderMessage);
    }
  }, [screenReaderMessage]);
  return jsx("span", {
    css: buttonGroupStyle
  }, message && jsx(Announcer, {
    ariaLive: "assertive",
    text: message,
    ariaRelevant: "additions",
    delay: 250
  }), jsx(SingleToolbarButtons, {
    items: singleItems,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing
  }), jsx("span", {
    css: wrapperStyle
  }, isToolbarDisabled ? jsx("div", null, jsx(MoreButton, {
    label: moreFormattingButtonLabel,
    isReducedSpacing: isReducedSpacing,
    isDisabled: true,
    isSelected: false,
    "aria-expanded": undefined,
    "aria-pressed": undefined
  })) : jsx(FormattingTextDropdownMenu, {
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing,
    moreButtonLabel: moreFormattingButtonLabel,
    hasFormattingActive: hasFormattingActive,
    items: items
  }), jsx("span", {
    css: separatorStyles
  })));
};

var Toolbar = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Toolbar, _React$PureComponent);

  var _super = _createSuper(Toolbar);

  function Toolbar() {
    _classCallCheck(this, Toolbar);

    return _super.apply(this, arguments);
  }

  _createClass(Toolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          toolbarSize = _this$props.toolbarSize,
          isReducedSpacing = _this$props.isReducedSpacing,
          editorView = _this$props.editorView,
          isToolbarDisabled = _this$props.isToolbarDisabled,
          shouldUseResponsiveToolbar = _this$props.shouldUseResponsiveToolbar,
          intl = _this$props.intl;
      return jsx(ToolbarFormatting, {
        popupsMountPoint: popupsMountPoint,
        popupsScrollableElement: popupsScrollableElement,
        toolbarSize: toolbarSize,
        isReducedSpacing: isReducedSpacing,
        editorView: editorView,
        isToolbarDisabled: isToolbarDisabled,
        shouldUseResponsiveToolbar: shouldUseResponsiveToolbar,
        intl: intl
      });
    }
  }]);

  return Toolbar;
}(React.PureComponent);

export default injectIntl(Toolbar);