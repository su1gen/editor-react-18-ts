import React from 'react';
import PropTypes from 'prop-types';
import EditorActions from '../../actions';
export declare type EditorContextProps = {
    editorActions?: EditorActions;
};
export declare const useEditorContext: () => EditorContextProps;
export default class LegacyEditorContext extends React.Component<EditorContextProps, {}> {
    static childContextTypes: {
        editorActions: PropTypes.Requireable<object>;
    };
    private editorActions;
    constructor(props: EditorContextProps);
    getChildContext(): {
        editorActions: EditorActions<any>;
    };
    render(): JSX.Element;
}
