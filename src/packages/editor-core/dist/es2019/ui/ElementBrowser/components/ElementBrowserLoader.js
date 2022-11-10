/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import Loadable from 'react-loadable';
import Spinner from '@atlaskit/spinner';
const spinnerContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
const ElementBrowserLoader = Loadable({
  loader: () => import(
  /* webpackChunkName: "@atlaskit-internal_editor-element-browser" */
  '../ElementBrowser').then(module => module.default),
  loading: () => jsx("div", {
    css: spinnerContainer
  }, jsx(Spinner, {
    size: "medium"
  }))
});
export default ElementBrowserLoader;