"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickAreaClickHandler = exports.checkForModal = void 0;

var _dom = require("../../utils/dom");

var _gapCursorSelection = require("../../plugins/selection/gap-cursor-selection");

var _commands = require("../../commands");

// we ignore all of the clicks made inside <div class="ak-editor-content-area" /> (but not clicks on the node itself)
var insideContentArea = function insideContentArea(ref) {
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


var checkForModal = function checkForModal(target) {
  var modalDialog = target.closest('[role=dialog]');

  if (modalDialog) {
    // return false if not an editor inside modal, otherwise return true
    return !!(modalDialog !== null && modalDialog !== void 0 && modalDialog.querySelector('.akEditor'));
  } // no modal present so we can return true


  return true;
};

exports.checkForModal = checkForModal;

var clickAreaClickHandler = function clickAreaClickHandler(view, event) {
  var _view$hasFocus;

  var isTargetContentArea = event.currentTarget.querySelector('.ak-editor-content-area');
  var isEditorFocused = !!(view !== null && view !== void 0 && (_view$hasFocus = view.hasFocus) !== null && _view$hasFocus !== void 0 && _view$hasFocus.call(view));
  var target = event.target; // @see https://product-fabric.atlassian.net/browse/ED-4287
  // click event gets triggered twice on a checkbox (on <label> first and then on <input>)
  // by the time it gets triggered on input, PM already re-renders nodeView and detaches it from DOM
  // which doesn't pass the check !contentArea.contains(event.target)

  var isInputClicked = target.nodeName === 'INPUT'; // @see ED-5126

  var isPopupClicked = !!(0, _dom.closestElement)(target, '[data-editor-popup]'); // Fixes issue when using a textarea for editor title in full page editor doesn't let user focus it.

  var isTextAreaClicked = target.nodeName === 'TEXTAREA';
  var isBreadcrumbClicked = !!(0, _dom.closestElement)(target, 'nav[aria-label="Breadcrumbs"]');
  var isTargetChildOfContentArea = insideContentArea(target.parentNode);
  var selection = window.getSelection();
  var isEditorPopupTextSelected = (selection === null || selection === void 0 ? void 0 : selection.type) === 'Range' && (0, _dom.closestElement)(selection === null || selection === void 0 ? void 0 : selection.anchorNode, '[data-editor-popup]');
  var isClickOutsideEditor = (!isTargetContentArea || !isTargetChildOfContentArea || !isEditorFocused) && !isInputClicked && !isTextAreaClicked && !isPopupClicked && !isBreadcrumbClicked && !isEditorPopupTextSelected && checkForModal(target); // click was within editor container and focus should be brought to input

  if (isClickOutsideEditor && view) {
    outsideProsemirrorEditorClickHandler(view, event);
  }
};

exports.clickAreaClickHandler = clickAreaClickHandler;

var outsideProsemirrorEditorClickHandler = function outsideProsemirrorEditorClickHandler(view, event) {
  var _view$hasFocus2;

  var dispatch = view.dispatch,
      dom = view.dom,
      state = view.state;
  var tr = state.tr;
  var isEditorFocused = !!(view !== null && view !== void 0 && (_view$hasFocus2 = view.hasFocus) !== null && _view$hasFocus2 !== void 0 && _view$hasFocus2.call(view));
  var isBottomAreaClicked = event.clientY > dom.getBoundingClientRect().bottom;

  if (isBottomAreaClicked) {
    (0, _commands.addParagraphAtEnd)(tr);
  }

  if ((0, _gapCursorSelection.hasGapCursorPlugin)(state)) {
    (0, _gapCursorSelection.setSelectionTopLevelBlocks)(tr, event, dom, view.posAtCoords.bind(view), isEditorFocused);
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