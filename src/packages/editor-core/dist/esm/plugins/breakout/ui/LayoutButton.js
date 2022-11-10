import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { B300, N300, N20A } from '@atlaskit/theme/colors';
import { injectIntl } from 'react-intl-next';
import { findParentDomRefOfType, findDomRefAtPos } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common/ui';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import ToolbarButton from '../../../ui/ToolbarButton';
import { getBreakoutMode } from '../utils/get-breakout-mode';
import { setBreakoutMode } from '../commands/set-breakout-mode';
import { removeBreakout } from '../commands/remove-breakout';
import commonMessages from '../../../messages';
import { BreakoutCssClassName } from '../constants';
import { isBreakoutMarkAllowed } from '../utils/is-breakout-mark-allowed';
import { getPluginState } from '../plugin-key';
import { NodeSelection } from 'prosemirror-state';
import { isSupportedNodeForBreakout } from '../utils/is-supported-node';
import { token } from '@atlaskit/tokens';
var toolbarButtonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  && button {\n    background: ", ";\n    color: ", ";\n    :hover {\n      background: ", ";\n      color: ", " !important;\n    }\n  }\n"])), token('color.background.neutral', N20A), token('color.icon', N300), token('color.background.neutral.hovered', B300), token('color.icon', 'white'));
var BREAKOUT_MODE = {
  FULL_WIDTH: 'full-width',
  CENTER: 'center',
  WIDE: 'wide'
};

var getNextBreakoutMode = function getNextBreakoutMode(currentMode) {
  if (currentMode === BREAKOUT_MODE.FULL_WIDTH) {
    return BREAKOUT_MODE.CENTER;
  } else if (currentMode === BREAKOUT_MODE.WIDE) {
    return BREAKOUT_MODE.FULL_WIDTH;
  }

  return BREAKOUT_MODE.WIDE;
};

var getTitle = function getTitle(layout) {
  switch (layout) {
    case BREAKOUT_MODE.FULL_WIDTH:
      return commonMessages.layoutFixedWidth;

    case BREAKOUT_MODE.WIDE:
      return commonMessages.layoutFullWidth;

    default:
      return commonMessages.layoutWide;
  }
};

function getBreakoutNodeElement(pluginState, selection, editorView) {
  if (selection instanceof NodeSelection && isSupportedNodeForBreakout(selection.node)) {
    return findDomRefAtPos(selection.from, editorView.domAtPos.bind(editorView));
  }

  return findParentDomRefOfType(pluginState.breakoutNode.type, editorView.domAtPos.bind(editorView))(selection);
}

var LayoutButton = /*#__PURE__*/function (_React$Component) {
  _inherits(LayoutButton, _React$Component);

  var _super = _createSuper(LayoutButton);

  function LayoutButton() {
    var _this;

    _classCallCheck(this, LayoutButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (breakoutMode) {
      return function () {
        var _this$props$editorVie = _this.props.editorView,
            state = _this$props$editorVie.state,
            dispatch = _this$props$editorVie.dispatch;

        if ([BREAKOUT_MODE.WIDE, BREAKOUT_MODE.FULL_WIDTH].indexOf(breakoutMode) !== -1) {
          setBreakoutMode(breakoutMode)(state, dispatch);
        } else {
          removeBreakout()(state, dispatch);
        }
      };
    });

    return _this;
  }

  _createClass(LayoutButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          formatMessage = _this$props.intl.formatMessage,
          mountPoint = _this$props.mountPoint,
          boundariesElement = _this$props.boundariesElement,
          scrollableElement = _this$props.scrollableElement,
          editorView = _this$props.editorView,
          node = _this$props.node;
      var state = editorView.state;

      if (!node || !isBreakoutMarkAllowed(state)) {
        return null;
      }

      var breakoutMode = getBreakoutMode(editorView.state);
      var titleMessage = getTitle(breakoutMode);
      var title = formatMessage(titleMessage);
      var nextBreakoutMode = getNextBreakoutMode(breakoutMode);
      var pluginState = getPluginState(state);
      var element = getBreakoutNodeElement(pluginState, state.selection, editorView);

      if (!element) {
        return null;
      }

      var closestEl = element.querySelector(".".concat(BreakoutCssClassName.BREAKOUT_MARK_DOM));

      if (closestEl && closestEl.firstChild) {
        element = closestEl.firstChild;
      }

      return jsx(Popup, {
        ariaLabel: title,
        target: element,
        offset: [5, 0],
        alignY: "start",
        alignX: "end",
        mountTo: mountPoint,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement,
        stick: true,
        forcePlacement: true
      }, jsx("div", {
        css: toolbarButtonWrapper
      }, jsx(ToolbarButton, {
        title: title,
        testId: titleMessage.id,
        onClick: this.handleClick(nextBreakoutMode),
        iconBefore: breakoutMode === BREAKOUT_MODE.FULL_WIDTH ? jsx(CollapseIcon, {
          label: title
        }) : jsx(ExpandIcon, {
          label: title
        })
      })));
    }
  }]);

  return LayoutButton;
}(React.Component);

_defineProperty(LayoutButton, "displayName", 'LayoutButton');

export default injectIntl(LayoutButton);