import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx } from '@emotion/react';
import Button from '@atlaskit/button/custom-theme-button';
import { expandMessages, expandLayoutWrapperStyle, ExpandLayoutWrapperWithRef } from '@atlaskit/editor-common/ui';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { expandClassNames } from './class-names';
export const withTooltip = WrapperComponent => {
  return class WithSortableColumn extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const {
        label
      } = this.props;
      return jsx(Tooltip, {
        content: label,
        position: "top",
        tag: ExpandLayoutWrapperWithRef
      }, jsx(WrapperComponent, this.props));
    }

  };
};
export const CustomButton = props => {
  const {
    label,
    allowInteractiveExpand
  } = props;
  const useTheme = useCallback((currentTheme, themeProps) => {
    const {
      buttonStyles,
      ...rest
    } = currentTheme(themeProps);
    return {
      buttonStyles: { ...buttonStyles,
        height: '100%',
        '& svg': {
          transform: props.expanded ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);',
          transition: `transform 0.2s ${akEditorSwoopCubicBezier};`
        }
      },
      ...rest
    };
  }, [props]);
  return jsx(Button, {
    appearance: "subtle",
    className: expandClassNames.iconContainer,
    iconBefore: jsx(ChevronRightIcon, {
      label: label
    }),
    shouldFitContainer: true,
    theme: useTheme,
    isDisabled: !allowInteractiveExpand
  });
};
const ButtonWithTooltip = withTooltip(CustomButton);
const ButtonWithoutTooltip = CustomButton;
export const ExpandIconButton = props => {
  const {
    expanded,
    intl
  } = props;
  const message = expanded ? expandMessages.collapseNode : expandMessages.expandNode;
  const label = intl && intl.formatMessage(message) || message.defaultMessage; // check to ensure device supports any-hover

  const supportsAnyHover = !!window.matchMedia ? window.matchMedia('(any-hover: hover)').matches !== window.matchMedia('(any-hover: none)').matches : false;
  const hoverEventCheck = supportsAnyHover ? window.matchMedia('(any-hover: hover)').matches : true; // hoverEventCheck is to disable tooltips for mobile to prevent incorrect hover state causing issues on iOS

  if (props.allowInteractiveExpand && hoverEventCheck) {
    return jsx(ButtonWithTooltip, _extends({
      label: label
    }, props));
  }

  return jsx("div", {
    css: expandLayoutWrapperStyle
  }, jsx(ButtonWithoutTooltip, _extends({
    label: label
  }, props)));
};