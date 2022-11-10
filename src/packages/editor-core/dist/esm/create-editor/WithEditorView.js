import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { useEditorContext } from '../ui/EditorContext';
export var WithEditorView = function WithEditorView(WrappedComponent) {
  var _WithFeatureFlags = function _WithFeatureFlags(props) {
    var _useEditorContext = useEditorContext(),
        editorActions = _useEditorContext.editorActions;

    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      editorView: editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView()
    }));
  };

  return _WithFeatureFlags;
};