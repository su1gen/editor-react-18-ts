import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';
import { akEditorToolbarKeylineHeight } from '@atlaskit/editor-shared-styles';
import { fullPageEditorWrapper } from './StyledComponents';
import { ContextPanelWidthProvider } from '../../ContextPanel/context';
import { FullPageContentArea } from './FullPageContentArea';
import { FullPageToolbar } from './FullPageToolbar';
import { getFeatureFlags } from '../../../plugins/feature-flags-context';
export var FullPageEditor = /*#__PURE__*/function (_React$Component) {
  _inherits(FullPageEditor, _React$Component);

  var _super = _createSuper(FullPageEditor);

  // Wrapper container for toolbar and content area
  function FullPageEditor(props) {
    var _this;

    _classCallCheck(this, FullPageEditor);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      showKeyline: false
    });

    _defineProperty(_assertThisInitialized(_this), "scrollContainer", null);

    _defineProperty(_assertThisInitialized(_this), "wrapperElementRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "contentAreaRef", function (contentArea) {
      _this.contentArea = contentArea;
    });

    _defineProperty(_assertThisInitialized(_this), "scrollContainerRef", function (ref) {
      var previousScrollContainer = _this.scrollContainer; // remove existing handler

      if (previousScrollContainer) {
        previousScrollContainer.removeEventListener('scroll', _this.updateToolbarKeyline);
      }

      _this.scrollContainer = ref ? ref : null;

      if (_this.scrollContainer) {
        _this.scrollContainer.addEventListener('scroll', _this.updateToolbarKeyline, false);

        _this.updateToolbarKeyline();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "updateToolbarKeyline", rafSchedule(function () {
      if (!_this.scrollContainer) {
        return false;
      }

      var scrollTop = _this.scrollContainer.scrollTop;
      var showKeyline = scrollTop > akEditorToolbarKeylineHeight;

      if (showKeyline !== _this.state.showKeyline) {
        _this.setState({
          showKeyline: showKeyline
        });
      }

      return false;
    }));

    _defineProperty(_assertThisInitialized(_this), "handleResize", function () {
      _this.updateToolbarKeyline();
    });

    if (props.innerRef) {
      _this.wrapperElementRef = props.innerRef;
    }

    return _this;
  }

  _createClass(FullPageEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.handleResize, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      this.updateToolbarKeyline.cancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _props$editorView;

      var props = this.props;
      var showKeyline = this.state.showKeyline;
      var featureFlags = (_props$editorView = props.editorView) !== null && _props$editorView !== void 0 && _props$editorView.state ? getFeatureFlags(props.editorView.state) : undefined;
      return jsx(ContextPanelWidthProvider, null, jsx("div", {
        css: fullPageEditorWrapper,
        className: "akEditor",
        ref: this.wrapperElementRef
      }, jsx(FullPageToolbar, {
        appearance: props.appearance,
        beforeIcon: props.primaryToolbarIconBefore,
        collabEdit: props.collabEdit,
        containerElement: this.scrollContainer,
        customPrimaryToolbarComponents: props.customPrimaryToolbarComponents,
        disabled: !!props.disabled,
        dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
        editorActions: props.editorActions,
        editorDOMElement: props.editorDOMElement,
        editorView: props.editorView,
        eventDispatcher: props.eventDispatcher,
        hasMinWidth: props.enableToolbarMinWidth,
        popupsBoundariesElement: props.popupsBoundariesElement,
        popupsMountPoint: props.popupsMountPoint,
        popupsScrollableElement: props.popupsScrollableElement,
        primaryToolbarComponents: props.primaryToolbarComponents,
        providerFactory: props.providerFactory,
        showKeyline: showKeyline,
        featureFlags: featureFlags
      }), jsx(FullPageContentArea, {
        appearance: props.appearance,
        contentArea: this.contentArea,
        contentAreaRef: this.contentAreaRef,
        contentComponents: props.contentComponents,
        contextPanel: props.contextPanel,
        customContentComponents: props.customContentComponents,
        disabled: props.disabled,
        dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
        editorActions: props.editorActions,
        editorDOMElement: props.editorDOMElement,
        editorView: props.editorView,
        eventDispatcher: props.eventDispatcher,
        popupsBoundariesElement: props.popupsBoundariesElement,
        popupsMountPoint: props.popupsMountPoint,
        popupsScrollableElement: props.popupsScrollableElement,
        providerFactory: props.providerFactory,
        scrollContainer: this.scrollContainer,
        scrollContainerRef: this.scrollContainerRef,
        wrapperElement: this.wrapperElementRef.current
      })));
    }
  }]);

  return FullPageEditor;
}(React.Component);

_defineProperty(FullPageEditor, "displayName", 'FullPageEditor');