import _extends from "@babel/runtime/helpers/extends";

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

function CategoryList({
  categories = [],
  ...props
}) {
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState(null);
  return jsx(Fragment, null, categories.map((category, index) => jsx(CategoryListItem, _extends({
    key: category.title,
    index: index,
    category: category,
    focus: focusedCategoryIndex === index,
    setFocusedCategoryIndex: setFocusedCategoryIndex
  }, props))));
}

function CategoryListItem({
  category,
  onSelectCategory,
  selectedCategory,
  index,
  focus,
  setFocusedCategoryIndex,
  createAnalyticsEvent
}) {
  const ref = useFocus(focus);
  const onClick = useCallback(() => {
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
  const onFocus = useCallback(() => {
    if (!focus) {
      setFocusedCategoryIndex(index);
    }
  }, [focus, index, setFocusedCategoryIndex]);
  const getTheme = useCallback((currentTheme, themeProps) => {
    const {
      buttonStyles,
      ...rest
    } = currentTheme(themeProps);
    return {
      buttonStyles: { ...buttonStyles,
        textAlign: 'start',
        marginLeft: '2px',
        height: '100%',
        width: '100%',
        color: category.name !== selectedCategory ? token('color.text', N800) : token('color.text.selected', B400),
        ...(category.name === selectedCategory && {
          background: token('color.background.selected', B50)
        })
      },
      ...rest
    };
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

const buttonWrapper = css`
  height: ${GRID_SIZE * 4}px;
  margin: 4px 4px 4px 0;

  @media (min-width: ${DEVICE_BREAKPOINT_NUMBERS.medium}px) {
    :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;
const MemoizedCategoryListWithAnalytics = /*#__PURE__*/memo(withAnalyticsContext({
  component: 'CategoryList'
})(CategoryList));
export default MemoizedCategoryListWithAnalytics;