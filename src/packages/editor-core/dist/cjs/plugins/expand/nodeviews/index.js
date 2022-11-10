"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandNodeView = void 0;
exports.default = _default;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _prosemirrorState = require("prosemirror-state");

var _ExpandIconButton = require("../ui/ExpandIconButton");

var _w3cKeyname = require("w3c-keyname");

var _prosemirrorModel = require("prosemirror-model");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("../../../utils");

var _commands = require("../commands");

var _classNames = require("../ui/class-names");

var _gapCursorSelection = require("../../../plugins/selection/gap-cursor-selection");

var _featureFlagsContext = require("../../feature-flags-context");

var _dom = require("../../../utils/dom");

var _types = require("../../selection/types");

var _commands2 = require("../../selection/commands");

var _pluginFactory = require("../../selection/plugin-factory");

function buildExpandClassName(type, expanded) {
  return "".concat(_classNames.expandClassNames.prefix, " ").concat(_classNames.expandClassNames.type(type), " ").concat(expanded ? _classNames.expandClassNames.expanded : '');
}

var toDOM = function toDOM(node, intl) {
  return ['div', {
    // prettier-ignore
    'class': buildExpandClassName(node.type.name, node.attrs.__expanded),
    'data-node-type': node.type.name,
    'data-title': node.attrs.title
  }, ['div', {
    // prettier-ignore
    'class': _classNames.expandClassNames.titleContainer,
    contenteditable: 'false',
    // Element gains access to focus events.
    // This is needed to prevent PM gaining access
    // on interacting with our controls.
    tabindex: '-1'
  }, // prettier-ignore
  ['div', {
    'class': _classNames.expandClassNames.icon
  }], ['div', {
    // prettier-ignore
    'class': _classNames.expandClassNames.inputContainer
  }, ['input', {
    // prettier-ignore
    'class': _classNames.expandClassNames.titleInput,
    value: node.attrs.title,
    placeholder: intl && intl.formatMessage(_ui.expandMessages.expandPlaceholderText) || _ui.expandMessages.expandPlaceholderText.defaultMessage,
    type: 'text'
  }]]], // prettier-ignore
  ['div', {
    'class': _classNames.expandClassNames.content
  }, 0]];
};

var ExpandNodeView = /*#__PURE__*/function () {
  function ExpandNodeView(node, view, getPos, getIntl, isMobile) {
    var _this = this;

    (0, _classCallCheck2.default)(this, ExpandNodeView);
    (0, _defineProperty2.default)(this, "allowInteractiveExpand", true);
    (0, _defineProperty2.default)(this, "isMobile", false);
    (0, _defineProperty2.default)(this, "focusTitle", function () {
      if (_this.input) {
        var _this$view = _this.view,
            state = _this$view.state,
            dispatch = _this$view.dispatch;
        (0, _commands2.setSelectionRelativeToNode)(_types.RelativeSelectionPos.Start)(state, dispatch);
        (0, _commands.setSelectionInsideExpand)(state, dispatch, _this.view);

        _this.input.focus();
      }
    });
    (0, _defineProperty2.default)(this, "handleIconKeyDown", function (event) {
      switch ((0, _w3cKeyname.keyName)(event)) {
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
    (0, _defineProperty2.default)(this, "isAllowInteractiveExpandEnabled", function () {
      var state = _this.view.state;
      var featureFlags = (0, _featureFlagsContext.getFeatureFlags)(state);
      return featureFlags && !!featureFlags.interactiveExpand;
    });
    (0, _defineProperty2.default)(this, "handleClick", function (event) {
      var target = event.target;
      var _this$view2 = _this.view,
          state = _this$view2.state,
          dispatch = _this$view2.dispatch;

      if ((0, _dom.closestElement)(target, ".".concat(_classNames.expandClassNames.icon))) {
        if (!_this.isAllowInteractiveExpandEnabled()) {
          return;
        }

        event.stopPropagation(); // We blur the editorView, to prevent any keyboard showing on mobile
        // When we're interacting with the expand toggle

        if (_this.view.dom instanceof HTMLElement) {
          _this.view.dom.blur();
        }

        (0, _commands.toggleExpandExpanded)(_this.getPos(), _this.node.type)(state, dispatch);
        return;
      }

      if (target === _this.input) {
        event.stopPropagation();

        _this.focusTitle();

        return;
      }
    });
    (0, _defineProperty2.default)(this, "handleInput", function (event) {
      var target = event.target;

      if (target === _this.input) {
        event.stopPropagation();
        var _this$view3 = _this.view,
            state = _this$view3.state,
            dispatch = _this$view3.dispatch;
        (0, _commands.updateExpandTitle)(target.value, _this.getPos(), _this.node.type)(state, dispatch);
      }
    });
    (0, _defineProperty2.default)(this, "handleFocus", function (event) {
      event.stopImmediatePropagation();
    });
    (0, _defineProperty2.default)(this, "handleTitleKeydown", function (event) {
      switch ((0, _w3cKeyname.keyName)(event)) {
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
    (0, _defineProperty2.default)(this, "deleteExpand", function (event) {
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

      if (expandNode && (0, _utils.isEmptyNode)(state.schema)(expandNode)) {
        (0, _commands.deleteExpandAtPos)(_this.getPos(), expandNode)(state, _this.view.dispatch);
      }
    });
    (0, _defineProperty2.default)(this, "toggleExpand", function () {
      if (_this.isAllowInteractiveExpandEnabled()) {
        var _this$view4 = _this.view,
            state = _this$view4.state,
            dispatch = _this$view4.dispatch;
        (0, _commands.toggleExpandExpanded)(_this.getPos(), _this.node.type)(state, dispatch);
      }
    });
    (0, _defineProperty2.default)(this, "moveToOutsideOfTitle", function (event) {
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

      var sel = _prosemirrorState.Selection.findFrom(resolvedPos, 1, true);

      if (sel) {
        // If the input has focus, ProseMirror doesn't
        // Give PM focus back before changing our selection
        _this.view.focus();

        dispatch(state.tr.setSelection(sel));
      }
    });
    (0, _defineProperty2.default)(this, "isCollapsed", function () {
      return !_this.node.attrs.__expanded;
    });
    (0, _defineProperty2.default)(this, "setRightGapCursor", function (event) {
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

        dispatch(state.tr.setSelection(new _gapCursorSelection.GapCursorSelection(state.doc.resolve(_this.node.nodeSize + _this.getPos()), _gapCursorSelection.Side.RIGHT)));
      }
    });
    (0, _defineProperty2.default)(this, "setLeftGapCursor", function (event) {
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

        dispatch(state.tr.setSelection(new _gapCursorSelection.GapCursorSelection(state.doc.resolve(_this.getPos()), _gapCursorSelection.Side.LEFT)));
      }
    });
    (0, _defineProperty2.default)(this, "handleArrowRightFromTitle", function (event) {
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

        (0, _commands2.setSelectionRelativeToNode)(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, _this.getPos()))(state, dispatch);
      }
    });
    (0, _defineProperty2.default)(this, "handleArrowLeftFromTitle", function (event) {
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


        if ((0, _pluginFactory.getPluginState)(state).selectionRelativeToNode === undefined) {
          (0, _commands2.setSelectionRelativeToNode)(undefined, new _gapCursorSelection.GapCursorSelection(state.doc.resolve(_this.getPos()), _gapCursorSelection.Side.LEFT))(state, dispatch);
        } else {
          (0, _commands2.setSelectionRelativeToNode)(_types.RelativeSelectionPos.Start, _prosemirrorState.NodeSelection.create(state.doc, _this.getPos()))(state, dispatch);
        }
      }
    });
    this.intl = getIntl();

    var _DOMSerializer$render = _prosemirrorModel.DOMSerializer.renderSpec(document, toDOM(node, this.intl)),
        dom = _DOMSerializer$render.dom,
        contentDOM = _DOMSerializer$render.contentDOM;

    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.isMobile = isMobile;
    this.icon = this.dom.querySelector(".".concat(_classNames.expandClassNames.icon));
    this.input = this.dom.querySelector(".".concat(_classNames.expandClassNames.titleInput));
    this.titleContainer = this.dom.querySelector(".".concat(_classNames.expandClassNames.titleContainer));
    this.content = this.dom.querySelector(".".concat(_classNames.expandClassNames.content));
    this.renderIcon(this.intl);
    this.initHandlers();
  }

  (0, _createClass2.default)(ExpandNodeView, [{
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

      _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_ExpandIconButton.ExpandIconButton, {
        intl: intl,
        allowInteractiveExpand: this.isAllowInteractiveExpandEnabled(),
        expanded: __expanded
      }), this.icon);
    }
  }, {
    key: "stopEvent",
    value: function stopEvent(event) {
      var target = event.target;
      return target === this.input || target === this.icon || !!(0, _dom.closestElement)(target, ".".concat(_classNames.expandClassNames.icon));
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
            this.dom.classList.toggle(_classNames.expandClassNames.expanded);
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

        _reactDom.default.unmountComponentAtNode(this.icon);
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

exports.ExpandNodeView = ExpandNodeView;

function _default(_ref2) {
  var getIntl = _ref2.getIntl,
      isMobile = _ref2.isMobile;
  return function (node, view, getPos) {
    return new ExpandNodeView(node, view, getPos, getIntl, isMobile);
  };
}