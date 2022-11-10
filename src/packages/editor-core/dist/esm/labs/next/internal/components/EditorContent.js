import React from 'react';
var EditorContentContext = /*#__PURE__*/React.createContext(function () {});
var EditorContentProvider = EditorContentContext.Provider;
/**
 * ProseMirror View mount point.
 */

var EditorContent = /*#__PURE__*/React.memo(function () {
  var handleRef = React.useContext(EditorContentContext);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%'
    },
    ref: handleRef
  });
});
export { EditorContentProvider, EditorContent };