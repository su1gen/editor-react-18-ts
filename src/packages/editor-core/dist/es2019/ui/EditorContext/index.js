import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import PropTypes from 'prop-types';
import EditorActions from '../../actions';
const EditorContext = /*#__PURE__*/React.createContext({});
export const useEditorContext = () => React.useContext(EditorContext);
export default class LegacyEditorContext extends React.Component {
  constructor(props) {
    super(props);
    this.editorActions = props.editorActions || new EditorActions();
  }

  getChildContext() {
    return {
      editorActions: this.editorActions
    };
  }

  render() {
    return /*#__PURE__*/React.createElement(EditorContext.Provider, {
      value: this.getChildContext()
    }, this.props.children);
  }

}

_defineProperty(LegacyEditorContext, "childContextTypes", {
  editorActions: PropTypes.object
});