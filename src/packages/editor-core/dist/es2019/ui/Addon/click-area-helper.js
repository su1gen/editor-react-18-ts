import { closestElement } from '../../utils/dom';
import { setSelectionTopLevelBlocks, hasGapCursorPlugin } from '../../plugins/selection/gap-cursor-selection';
import { addParagraphAtEnd } from '../../commands'; // we ignore all of the clicks made inside <div class="ak-editor-content-area" /> (but not clicks on the node itself)

const insideContentArea = ref => {
  while (ref) {
    if (ref.classList && ref.classList.contains('ak-editor-content-area')) {
      return true;
    }

    ref = ref.parentNode;
  }

  return false;
};
/**
 * @see ED-14699 - check if editor is inside a modal to continue to bring cursor to input when
 * any part of the editor container is clicked
 *
 * Handles two cases when a click event is fired:
 *
 * 1. if editor (e.g. comment inside of Jira ticket view) is inside modal then ensure focus and cursor is brought to the input
 * 2. if another modal is open (e.g. delete confirmation modal for confluence table) then ignore clicks as they shouldn't influence editor state
 */


export const checkForModal = target => {
  const modalDialog = target.closest('[role=dialog]');

  if (modalDialog) {
    // return false if not an editor inside modal, otherwise return true
    return !!(modalDialog !== null && modalDialog !== void 0 && modalDialog.querySelector('.akEditor'));
  } // no modal present so we can return true


  return true;
};

const clickAreaClickHandler = (view, event) => {
  var _view$hasFocus;

  const isTargetContentArea = event.currentTarget.querySelector('.ak-editor-content-area');
  const isEditorFocused = !!(view !== null && view !== void 0 && (_view$hasFocus = view.hasFocus) !== null && _view$hasFocus !== void 0 && _view$hasFocus.call(view));
  const target = event.target; // @see https://product-fabric.atlassian.net/browse/ED-4287
  // click event gets triggered twice on a checkbox (on <label> first and then on <input>)
  // by the time it gets triggered on input, PM already re-renders nodeView and detaches it from DOM
  // which doesn't pass the check !contentArea.contains(event.target)

  const isInputClicked = target.nodeName === 'INPUT'; // @see ED-5126

  const isPopupClicked = !!closestElement(target, '[data-editor-popup]'); // Fixes issue when using a textarea for editor title in full page editor doesn't let user focus it.

  const isTextAreaClicked = target.nodeName === 'TEXTAREA';
  const isBreadcrumbClicked = !!closestElement(target, 'nav[aria-label="Breadcrumbs"]');
  const isTargetChildOfContentArea = insideContentArea(target.parentNode);
  const selection = window.getSelection();
  const isEditorPopupTextSelected = (selection === null || selection === void 0 ? void 0 : selection.type) === 'Range' && closestElement(selection === null || selection === void 0 ? void 0 : selection.anchorNode, '[data-editor-popup]');
  const isClickOutsideEditor = (!isTargetContentArea || !isTargetChildOfContentArea || !isEditorFocused) && !isInputClicked && !isTextAreaClicked && !isPopupClicked && !isBreadcrumbClicked && !isEditorPopupTextSelected && checkForModal(target); // click was within editor container and focus should be brought to input

  if (isClickOutsideEditor && view) {
    outsideProsemirrorEditorClickHandler(view, event);
  }
};

const outsideProsemirrorEditorClickHandler = (view, event) => {
  var _view$hasFocus2;

  const {
    dispatch,
    dom,
    state
  } = view;
  const {
    tr
  } = state;
  const isEditorFocused = !!(view !== null && view !== void 0 && (_view$hasFocus2 = view.hasFocus) !== null && _view$hasFocus2 !== void 0 && _view$hasFocus2.call(view));
  const isBottomAreaClicked = event.clientY > dom.getBoundingClientRect().bottom;

  if (isBottomAreaClicked) {
    addParagraphAtEnd(tr);
  }

  if (hasGapCursorPlugin(state)) {
    setSelectionTopLevelBlocks(tr, event, dom, view.posAtCoords.bind(view), isEditorFocused);
  }

  if (!tr.docChanged && !tr.selectionSet) {
    return;
  }

  if (dispatch) {
    dispatch(tr);
  }

  view.focus();
  event.stopPropagation();
  event.preventDefault();
};

export { clickAreaClickHandler };