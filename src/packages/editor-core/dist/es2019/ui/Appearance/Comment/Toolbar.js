/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { akEditorToolbarKeylineHeight, akEditorGridLineZIndex, akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
export const TableControlsPadding = 20;
const mainToolbarWrapperStyle = css`
  position: relative;
  align-items: center;
  padding: ${gridSize()}px ${gridSize()}px 0;
  display: flex;
  height: auto;
  background-color: ${token('elevation.surface', 'white')};
  box-shadow: none;
  padding-left: ${TableControlsPadding}px;

  & > div {
    > :first-child:not(style),
    > style:first-child + * {
      margin-left: 0;
    }
  }

  .block-type-btn {
    padding-left: 0;
  }
`;
const stickyToolbarWrapperStyle = css`
  /* stylelint-disable declaration-block-no-duplicate-properties */
  position: relative;
  position: sticky;
  /* stylelint-enable declaration-block-no-duplicate-properties */
  padding-bottom: ${gridSize()}px;
  z-index: ${akEditorGridLineZIndex + akEditorMenuZIndex};
  transition: box-shadow ease-in-out 0.2s;
  &.show-keyline {
    box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0
      ${token('color.border', N30)};
  }
`;

const StickyToolbar = props => {
  const [top, setTop] = useState(0);
  useEffect(() => {
    var _props$externalToolba, _props$externalToolba2;

    setTop(((_props$externalToolba = props.externalToolbarRef) === null || _props$externalToolba === void 0 ? void 0 : (_props$externalToolba2 = _props$externalToolba.current) === null || _props$externalToolba2 === void 0 ? void 0 : _props$externalToolba2.clientHeight) || 0);
  }, [setTop, props.externalToolbarRef]);
  return jsx("div", {
    css: [mainToolbarWrapperStyle, stickyToolbarWrapperStyle, css`
          top: ${top};
        `],
    "data-testid": "ak-editor-main-toolbar",
    className: 'show-keyline'
  }, props.children);
};

const FixedToolbar = props => jsx("div", {
  css: mainToolbarWrapperStyle,
  "data-testid": "ak-editor-main-toolbar"
}, props.children);

export const MainToolbar = ({
  useStickyToolbar,
  children
}) => {
  if (!!useStickyToolbar) {
    return jsx(StickyToolbar, {
      externalToolbarRef: typeof useStickyToolbar === 'boolean' ? undefined : useStickyToolbar
    }, children);
  }

  return jsx(FixedToolbar, null, children);
};
export const mainToolbarCustomComponentsSlotStyle = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  padding-right: ${TableControlsPadding}px;
  > div {
    display: flex;
    flex-shrink: 0;
  }
`;