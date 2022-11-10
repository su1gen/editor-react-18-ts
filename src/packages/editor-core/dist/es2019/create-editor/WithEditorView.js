import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { useEditorContext } from '../ui/EditorContext';
export const WithEditorView = WrappedComponent => {
  const _WithFeatureFlags = props => {
    const {
      editorActions
    } = useEditorContext();
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      editorView: editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView()
    }));
  };

  return _WithFeatureFlags;
};