import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { WidthObserver } from '@atlaskit/width-detector';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { useElementWidth } from './hooks';
import { widthToToolbarSize, toolbarSizeToWidth } from './toolbar-size';
import { Toolbar } from './Toolbar';
import { ToolbarSize } from './types';
import { isFullPage } from '../../utils/is-full-page';
const toolbar = css`
  width: 100%;
  position: relative;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1 / 2;
    grid-row: 2;
    width: calc(100% - 30px);
    margin: 0 15px;
  }
`;
export const ToolbarWithSizeDetector = props => {
  const ref = /*#__PURE__*/React.createRef();
  const [width, setWidth] = React.useState(undefined);
  const elementWidth = useElementWidth(ref, {
    skip: typeof width !== 'undefined'
  });
  const toolbarSize = typeof width === 'undefined' && typeof elementWidth === 'undefined' ? undefined : widthToToolbarSize(width || elementWidth, props.appearance);
  const toolbarStyle = useMemo(() => {
    const toolbarWidth = isFullPage(props.appearance) && props.twoLineEditorToolbar ? ToolbarSize.S : ToolbarSize.M;
    const toolbarMinWidth = toolbarSizeToWidth(toolbarWidth, props.appearance);
    const minWidth = `min-width: ${props.hasMinWidth ? toolbarMinWidth : '254'}px`;
    return [toolbar, minWidth];
  }, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);
  return jsx("div", {
    css: toolbarStyle
  }, jsx(WidthObserver, {
    setWidth: setWidth
  }), props.editorView && toolbarSize ? jsx(Toolbar, _extends({}, props, {
    toolbarSize: toolbarSize
  })) : jsx("div", {
    ref: ref
  }));
};