import { EditorView } from 'prosemirror-view';
/**
 * @see ED-14699 - check if editor is inside a modal to continue to bring cursor to input when
 * any part of the editor container is clicked
 *
 * Handles two cases when a click event is fired:
 *
 * 1. if editor (e.g. comment inside of Jira ticket view) is inside modal then ensure focus and cursor is brought to the input
 * 2. if another modal is open (e.g. delete confirmation modal for confluence table) then ignore clicks as they shouldn't influence editor state
 */
export declare const checkForModal: (target: HTMLElement) => boolean;
declare const clickAreaClickHandler: (view: EditorView<any>, event: React.MouseEvent<any>) => void;
export { clickAreaClickHandler };
