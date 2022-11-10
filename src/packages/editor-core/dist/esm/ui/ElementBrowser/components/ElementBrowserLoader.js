import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import Loadable from 'react-loadable';
import Spinner from '@atlaskit/spinner';
var spinnerContainer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n"])));
var ElementBrowserLoader = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-element-browser" */
    '../ElementBrowser').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return jsx("div", {
      css: spinnerContainer
    }, jsx(Spinner, {
      size: "medium"
    }));
  }
});
export default ElementBrowserLoader;