import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";

var _templateObject;

var _excluded = ["categories"],
    _excluded2 = ["buttonStyles"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { memo, useCallback, Fragment } from 'react';
import { N800, B400, B50 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/custom-theme-button';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { DEVICE_BREAKPOINT_NUMBERS, GRID_SIZE } from '../constants';
import useFocus from '../hooks/use-focus';
import { fireAnalyticsEvent, EVENT_TYPE, ACTION_SUBJECT, ACTION_SUBJECT_ID, ACTION } from '../../../plugins/analytics';
import { token } from '@atlaskit/tokens';

function CategoryList(_ref) {
  var _ref$categories = _ref.categories,
      categories = _ref$categories === void 0 ? [] : _ref$categories,
      props = _objectWithoutProperties(_ref, _excluded);

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      focusedCategoryIndex = _React$useState2[0],
      setFocusedCategoryIndex = _React$useState2[1];

  return jsx(Fragment, null, categories.map(function (category, index) {
    return jsx(CategoryListItem, _extends({
      key: category.title,
      index: index,
      category: category,
      focus: focusedCategoryIndex === index,
      setFocusedCategoryIndex: setFocusedCategoryIndex
    }, props));
  }));
}

function CategoryListItem(_ref2) {
  var category = _ref2.category,
      onSelectCategory = _ref2.onSelectCategory,
      selectedCategory = _ref2.selectedCategory,
      index = _ref2.index,
      focus = _ref2.focus,
      setFocusedCategoryIndex = _ref2.setFocusedCategoryIndex,
      createAnalyticsEvent = _ref2.createAnalyticsEvent;
  var ref = useFocus(focus);
  var onClick = useCallback(function () {
    onSelectCategory(category);
    /**
     * When user double clicks on same category, focus on first item.
     */

    if (selectedCategory === category.name) {
      setFocusedCategoryIndex(0);
    } else {
      setFocusedCategoryIndex(index);
    }

    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.CLICKED,
        actionSubject: ACTION_SUBJECT.BUTTON,
        actionSubjectId: ACTION_SUBJECT_ID.BUTTON_CATEGORY,
        eventType: EVENT_TYPE.TRACK
      }
    });
  }, [onSelectCategory, category, index, selectedCategory, setFocusedCategoryIndex, createAnalyticsEvent]);
  var onFocus = useCallback(function () {
    if (!focus) {
      setFocusedCategoryIndex(index);
    }
  }, [focus, index, setFocusedCategoryIndex]);
  var getTheme = useCallback(function (currentTheme, themeProps) {
    var _currentTheme = currentTheme(themeProps),
        buttonStyles = _currentTheme.buttonStyles,
        rest = _objectWithoutProperties(_currentTheme, _excluded2);

    return _objectSpread({
      buttonStyles: _objectSpread(_objectSpread({}, buttonStyles), {}, {
        textAlign: 'start',
        marginLeft: '2px',
        height: '100%',
        width: '100%',
        color: category.name !== selectedCategory ? token('color.text', N800) : token('color.text.selected', B400)
      }, category.name === selectedCategory && {
        background: token('color.background.selected', B50)
      })
    }, rest);
  }, [category.name, selectedCategory]);
  return jsx("div", {
    css: buttonWrapper
  }, jsx(Button, {
    appearance: "subtle",
    isSelected: selectedCategory === category.name,
    onClick: onClick,
    onFocus: onFocus,
    theme: getTheme,
    ref: ref,
    testId: "element-browser-category-item"
  }, category.title));
}

var buttonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  height: ", "px;\n  margin: 4px 4px 4px 0;\n\n  @media (min-width: ", "px) {\n    :not(:last-child) {\n      margin-bottom: 0;\n    }\n  }\n"])), GRID_SIZE * 4, DEVICE_BREAKPOINT_NUMBERS.medium);
var MemoizedCategoryListWithAnalytics = /*#__PURE__*/memo(withAnalyticsContext({
  component: 'CategoryList'
})(CategoryList));
export default MemoizedCategoryListWithAnalytics;