import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import ReactDOM from 'react-dom';
import { Selection, NodeSelection } from 'prosemirror-state';
import { ExpandIconButton } from '../ui/ExpandIconButton';
import { keyName } from 'w3c-keyname';
import { DOMSerializer } from 'prosemirror-model';
import { expandMessages } from '@atlaskit/editor-common/ui';
import { isEmptyNode } from '../../../utils';
import { updateExpandTitle, toggleExpandExpanded, deleteExpandAtPos, setSelectionInsideExpand } from '../commands';
import { expandClassNames } from '../ui/class-names';
import { GapCursorSelection, Side } from '../../../plugins/selection/gap-cursor-selection';
import { getFeatureFlags } from '../../feature-flags-context';
import { closestElement } from '../../../utils/dom';
import { RelativeSelectionPos } from '../../selection/types';
import { setSelectionRelativeToNode } from '../../selection/commands';
import { getPluginState as getSelectionPluginState } from '../../selection/plugin-factory';

function buildExpandClassName(type, expanded) {
  return "".concat(expandClassNames.prefix, " ").concat(expandClassNames.type(type), " ").concat(expanded ? expandClassNames.expanded : '');
}

var toDOM = function toDOM(node, intl) {
  return ['div', {
    // prettier-ignore
    'class': buildExpandClassName(node.type.name, node.attrs.__expanded),
    'data-node-type': node.type.name,
    'data-title': node.attrs.title
  }, ['div', {
    // prettier-ignore
    'class': expandClassNames.titleContainer,
    contenteditable: 'false',
    // Element gains access to focus events.
    // This is needed to prevent PM gaining access
    // on interacting with our controls.
    tabindex: '-1'
  }, // prettier-ignore
  ['div', {
    'class': expandClassNames.icon
  }], ['div', {
    // prettier-ignore
    'class': expandClassNames.inputContainer
  }, ['input', {
    // prettier-ignore
    'class': expandClassNames.titleInput,
    value: node.attrs.title,
    placeholder: intl && intl.formatMessage(expandMessages.expandPlaceholderText) || expandMessages.expandPlaceholderText.defaultMessage,
    type: 'text'
  }]]], // prettier-ignore
  ['div', {
    'class': expandClassNames.content
  }, 0]];
};

export var ExpandNodeView = /*#__PURE__*/function () {
  function ExpandNodeView(node, view, getPos, getIntl, isMobile) {
    var _this = this;

    _classCallCheck(this, ExpandNodeView);

    _defineProperty(this, "allowInteractiveExpand", true);

    _defineProperty(this, "isMobile", false);

    _defineProperty(this, "focusTitle", function () {
      if (_this.input) {
        var _this$view = _this.view,
            state = _this$view.state,
            dispatch = _this$view.dispatch;
        setSelectionRelativeToNode(RelativeSelectionPos.Start)(state, dispatch);
        setSelectionInsideExpand(state, dispatch, _this.view);

        _this.input.focus();
      }
    });

    _defineProperty(this, "handleIconKeyDown", function (event) {
      switch (keyName(event)) {
        case 'Tab':
          event.preventDefault();

          _this.focusTitle();

          break;

        case 'Enter':
          event.preventDefault();

          _this.handleClick(event);

          break;
      }
    });

    _defineProperty(this, "isAllowInteractiveExpandEnabled", function () {
      var state = _this.view.state;
      var featureFlags = getFeatureFlags(state);
      return featureFlags && !!featureFlags.interactiveExpand;
    });

    _defineProperty(this, "handleClick", function (event) {
      var target = event.target;
      var _this$view2 = _this.view,
          state = _this$view2.state,
          dispatch = _this$view2.dispatch;

      if (closestElement(target, ".".concat(expandClassNames.icon))) {
        if (!_this.isAllowInteractiveExpandEnabled()) {
          return;
        }

        event.stopPropagation(); // We blur the editorView, to prevent any keyboard showing on mobile
        // When we're interacting with the expand toggle

        if (_this.view.dom instanceof HTMLElement) {
          _this.view.dom.blur();
        }

        toggleExpandExpanded(_this.getPos(), _this.node.type)(state, dispatch);
        return;
      }

      if (target === _this.input) {
        event.stopPropagation();

        _this.focusTitle();

        return;
      }
    });

    _defineProperty(this, "handleInput", function (event) {
      var target = event.target;

      if (target === _this.input) {
        event.stopPropagation();
        var _this$view3 = _this.view,
            state = _this$view3.state,
            dispatch = _this$view3.dispatch;
        updateExpandTitle(target.value, _this.getPos(), _this.node.type)(state, dispatch);
      }
    });

    _defineProperty(this, "handleFocus", function (event) {
      event.stopImmediatePropagation();
    });

    _defineProperty(this, "handleTitleKeydown", function (event) {
      switch (keyName(event)) {
        case 'Enter':
          _this.toggleExpand();

          break;

        case 'Tab':
        case 'ArrowDown':
          _this.moveToOutsideOfTitle(event);

          break;

        case 'ArrowRight':
          _this.handleArrowRightFromTitle(event);

          break;

        case 'ArrowLeft':
          _this.handleArrowLeftFromTitle(event);

          break;

        case 'ArrowUp':
          _this.setLeftGapCursor(event);

          break;

        case 'Backspace':
          _this.deleteExpand(event);

          break;
      }
    });

    _defineProperty(this, "deleteExpand", function (event) {
      if (!_this.input) {
        return;
      }

      var _this$input = _this.input,
          selectionStart = _this$input.selectionStart,
          selectionEnd = _this$input.selectionEnd;

      if (selectionStart !== selectionEnd || selectionStart !== 0) {
        return;
      }

      var state = _this.view.state;
      var expandNode = _this.node;

      if (expandNode && isEmptyNode(state.schema)(expandNode)) {
        deleteExpandAtPos(_this.getPos(), expandNode)(state, _this.view.dispatch);
      }
    });

    _defineProperty(this, "toggleExpand", function () {
      if (_this.isAllowInteractiveExpandEnabled()) {
        var _this$view4 = _this.view,
            state = _this$view4.state,
            dispatch = _this$view4.dispatch;
        toggleExpandExpanded(_this.getPos(), _this.node.type)(state, dispatch);
      }
    });

    _defineProperty(this, "moveToOutsideOfTitle", function (event) {
      event.preventDefault();
      var _this$view5 = _this.view,
          state = _this$view5.state,
          dispatch = _this$view5.dispatch;

      var expandPos = _this.getPos();

      if (typeof expandPos !== 'number') {
        return;
      }

      var pos = expandPos;

      if (_this.isCollapsed()) {
        pos = expandPos + _this.node.nodeSize;
      }

      var resolvedPos = state.doc.resolve(pos);

      if (!resolvedPos) {
        return;
      }

      if (_this.isCollapsed() && resolvedPos.nodeAfter && ['expand', 'nestedExpand'].indexOf(resolvedPos.nodeAfter.type.name) > -1) {
        return _this.setRightGapCursor(event);
      }

      var sel = Selection.findFrom(resolvedPos, 1, true);

      if (sel) {
        // If the input has focus, ProseMirror doesn't
        // Give PM focus back before changing our selection
        _this.view.focus();

        dispatch(state.tr.setSelection(sel));
      }
    });

    _defineProperty(this, "isCollapsed", function () {
      return !_this.node.attrs.__expanded;
    });

    _defineProperty(this, "setRightGapCursor", function (event) {
      if (!_this.input) {
        return;
      }

      var _this$input2 = _this.input,
          value = _this$input2.value,
          selectionStart = _this$input2.selectionStart,
          selectionEnd = _this$input2.selectionEnd;

      if (selectionStart === selectionEnd && selectionStart === value.length) {
        var _this$view6 = _this.view,
            state = _this$view6.state,
            dispatch = _this$view6.dispatch;
        event.preventDefault();

        _this.view.focus();

        dispatch(state.tr.setSelection(new GapCursorSelection(state.doc.resolve(_this.node.nodeSize + _this.getPos()), Side.RIGHT)));
      }
    });

    _defineProperty(this, "setLeftGapCursor", function (event) {
      if (!_this.input) {
        return;
      }

      var _this$input3 = _this.input,
          selectionStart = _this$input3.selectionStart,
          selectionEnd = _this$input3.selectionEnd;

      if (selectionStart === selectionEnd && selectionStart === 0) {
        event.preventDefault();
        var _this$view7 = _this.view,
            state = _this$view7.state,
            dispatch = _this$view7.dispatch;

        _this.view.focus();

        dispatch(state.tr.setSelection(new GapCursorSelection(state.doc.resolve(_this.getPos()), Side.LEFT)));
      }
    });

    _defineProperty(this, "handleArrowRightFromTitle", function (event) {
      if (!_this.input) {
        return;
      }

      var _this$input4 = _this.input,
          value = _this$input4.value,
          selectionStart = _this$input4.selectionStart,
          selectionEnd = _this$input4.selectionEnd;

      if (selectionStart === selectionEnd && selectionStart === value.length) {
        event.preventDefault();
        var _this$view8 = _this.view,
            state = _this$view8.state,
            dispatch = _this$view8.dispatch;

        _this.view.focus();

        setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, _this.getPos()))(state, dispatch);
      }
    });

    _defineProperty(this, "handleArrowLeftFromTitle", function (event) {
      if (!_this.input) {
        return;
      }

      var _this$input5 = _this.input,
          selectionStart = _this$input5.selectionStart,
          selectionEnd = _this$input5.selectionEnd;

      if (selectionStart === selectionEnd && selectionStart === 0) {
        event.preventDefault();
        var _this$view9 = _this.view,
            state = _this$view9.state,
            dispatch = _this$view9.dispatch;

        _this.view.focus(); // selectionRelativeToNode is undefined when user clicked to select node, then hit left to get focus in title
        // This is a special case where we want to bypass node selection and jump straight to gap cursor


        if (getSelectionPluginState(state).selectionRelativeToNode === undefined) {
          setSelectionRelativeToNode(undefined, new GapCursorSelection(state.doc.resolve(_this.getPos()), Side.LEFT))(state, dispatch);
        } else {
          setSelectionRelativeToNode(RelativeSelectionPos.Start, NodeSelection.create(state.doc, _this.getPos()))(state, dispatch);
        }
      }
    });

    this.intl = getIntl();

    var _DOMSerializer$render = DOMSerializer.renderSpec(document, toDOM(node, this.intl)),
        dom = _DOMSerializer$render.dom,
        contentDOM = _DOMSerializer$render.contentDOM;

    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.isMobile = isMobile;
    this.icon = this.dom.querySelector(".".concat(expandClassNames.icon));
    this.input = this.dom.querySelector(".".concat(expandClassNames.titleInput));
    this.titleContainer = this.dom.querySelector(".".concat(expandClassNames.titleContainer));
    this.content = this.dom.querySelector(".".concat(expandClassNames.content));
    this.renderIcon(this.intl);
    this.initHandlers();
  }

  _createClass(ExpandNodeView, [{
    key: "initHandlers",
    value: function initHandlers() {
      if (this.dom) {
        this.dom.addEventListener('click', this.handleClick);
        this.dom.addEventListener('input', this.handleInput);
      }

      if (this.input) {
        this.input.addEventListener('keydown', this.handleTitleKeydown);
      }

      if (this.titleContainer) {
        // If the user interacts in our title bar (either toggle or input)
        // Prevent ProseMirror from getting a focus event (causes weird selection issues).
        this.titleContainer.addEventListener('focus', this.handleFocus);
      }

      if (this.icon) {
        this.icon.addEventListener('keydown', this.handleIconKeyDown);
      }
    }
  }, {
    key: "renderIcon",
    value: function renderIcon(intl, node) {
      if (!this.icon) {
        return;
      }

      var _ref = node && node.attrs || this.node.attrs,
          __expanded = _ref.__expanded;

      ReactDOM.render( /*#__PURE__*/React.createElement(ExpandIconButton, {
        intl: intl,
        allowInteractiveExpand: this.isAllowInteractiveExpandEnabled(),
        expanded: __expanded
      }), this.icon);
    }
  }, {
    key: "stopEvent",
    value: function stopEvent(event) {
      var target = event.target;
      return target === this.input || target === this.icon || !!closestElement(target, ".".concat(expandClassNames.icon));
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation(mutationRecord) {
      // ME-1931: Mobile relies on composition which creates dom mutations. If we ignore them, prosemirror
      // does not recognise the changes and reverts them.
      if (this.isMobile && (mutationRecord.type === 'characterData' || mutationRecord.type === 'childList')) {
        return false;
      }

      if (mutationRecord.type === 'selection') {
        return false;
      }

      return true;
    }
  }, {
    key: "update",
    value: function update(node, _decorations) {
      var _this2 = this;

      if (this.node.type === node.type) {
        if (this.node.attrs.__expanded !== node.attrs.__expanded) {
          // Instead of re-rendering the view on an expand toggle
          // we toggle a class name to hide the content and animate the chevron.
          if (this.dom) {
            this.dom.classList.toggle(expandClassNames.expanded);
            this.renderIcon(this && this.intl, node);
          }

          if (this.content) {
            // Disallow interaction/selection inside when collapsed.
            this.content.setAttribute('contenteditable', node.attrs.__expanded);
          }
        } // During a collab session the title doesn't sync with other users
        // since we're intentionally being less aggressive about re-rendering.
        // We also apply a rAF to avoid abrupt continuous replacement of the title.


        window.requestAnimationFrame(function () {
          if (_this2.input && _this2.node.attrs.title !== _this2.input.value) {
            _this2.input.value = _this2.node.attrs.title;
          }
        });
        this.node = node;
        return true;
      }

      return false;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.dom) {
        this.dom.removeEventListener('click', this.handleClick);
        this.dom.removeEventListener('input', this.handleInput);
      }

      if (this.input) {
        this.input.removeEventListener('keydown', this.handleTitleKeydown);
      }

      if (this.titleContainer) {
        this.titleContainer.removeEventListener('focus', this.handleFocus);
      }

      if (this.icon) {
        this.icon.removeEventListener('keydown', this.handleIconKeyDown);
        ReactDOM.unmountComponentAtNode(this.icon);
      }

      this.dom = undefined;
      this.contentDOM = undefined;
      this.icon = undefined;
      this.input = undefined;
      this.titleContainer = undefined;
      this.content = undefined;
    }
  }]);

  return ExpandNodeView;
}();
export default function (_ref2) {
  var getIntl = _ref2.getIntl,
      isMobile = _ref2.isMobile;
  return function (node, view, getPos) {
    return new ExpandNodeView(node, view, getPos, getIntl, isMobile);
  };
}