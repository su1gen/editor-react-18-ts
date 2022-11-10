import { EditorPlugin } from '../../types';
declare const toolbarListsIndentationPlugin: ({ showIndentationButtons, allowHeadingAndParagraphIndentation, }: {
    showIndentationButtons: boolean;
    allowHeadingAndParagraphIndentation: boolean;
}) => EditorPlugin;
export default toolbarListsIndentationPlugin;
