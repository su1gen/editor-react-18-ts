/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
export const MediaInlineNodeSelector = 'media-inline-node';
export const MediaSingleNodeSelector = 'media-single-node';
export const figureWrapper = css`
  margin: 0;
`;
const absoluteDiv = css`
  position: absolute;
  width: 100%;
  height: 100%;
`;
const forcedDimensions = css`
  width: 100%;
  position: relative;
`;
export const MediaCardWrapper = ({
  dimensions,
  children,
  onContextMenu
}) => {
  return jsx("div", {
    css: forcedDimensions,
    style: {
      paddingBottom: `${dimensions.height / dimensions.width * 100}%`
    },
    onContextMenuCapture: onContextMenu
  }, jsx("div", {
    css: absoluteDiv
  }, children));
};