import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { FloatingToolbarConfig } from '../../plugins/floating-toolbar/types';
export declare const annotationMessages: {
    createComment: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    createCommentInvalid: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    toolbar: {
        id: string;
        defaultMessage: string;
        description: string;
    };
};
export declare const buildToolbar: (state: EditorState, intl: IntlShape, isToolbarAbove?: boolean) => FloatingToolbarConfig | undefined;
