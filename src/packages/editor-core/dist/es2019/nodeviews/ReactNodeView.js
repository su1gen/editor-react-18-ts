import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { createDispatch } from '../event-dispatcher';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../plugins/analytics';
import { analyticsEventKey } from '../plugins/analytics/consts';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { getPerformanceOptions, startMeasureReactNodeViewRendered, stopMeasureReactNodeViewRendered } from './getPerformanceOptions';
export default class ReactNodeView {
  constructor(_node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, reactComponent, hasAnalyticsContext = false, viewShouldUpdate, hasIntlContext = false) {
    _defineProperty(this, "handleRef", node => this._handleRef(node));

    _defineProperty(this, "dispatchAnalyticsEvent", payload => {
      if (this.eventDispatcher) {
        const dispatch = createDispatch(this.eventDispatcher);
        dispatch(analyticsEventKey, {
          payload
        });
      }
    });

    this.node = _node;
    this.view = view;
    this.getPos = getPos;
    this.portalProviderAPI = portalProviderAPI;
    this.reactComponentProps = reactComponentProps || {};
    this.reactComponent = reactComponent;
    this.hasAnalyticsContext = hasAnalyticsContext;
    this._viewShouldUpdate = viewShouldUpdate;
    this.eventDispatcher = eventDispatcher;
    this.hasIntlContext = hasIntlContext;
  }
  /**
   * This method exists to move initialization logic out of the constructor,
   * so object can be initialized properly before calling render first time.
   *
   * Example:
   * Instance properties get added to an object only after super call in
   * constructor, which leads to some methods being undefined during the
   * first render.
   */


  init() {
    this.domRef = this.createDomRef();
    this.setDomAttrs(this.node, this.domRef);
    const {
      dom: contentDOMWrapper,
      contentDOM
    } = this.getContentDOM() || {
      dom: undefined,
      contentDOM: undefined
    };

    if (this.domRef && contentDOMWrapper) {
      this.domRef.appendChild(contentDOMWrapper);
      this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper;
      this.contentDOMWrapper = contentDOMWrapper || contentDOM;
    } // @see ED-3790
    // something gets messed up during mutation processing inside of a
    // nodeView if DOM structure has nested plain "div"s, it doesn't see the
    // difference between them and it kills the nodeView


    this.domRef.classList.add(`${this.node.type.name}View-content-wrap`);
    const {
      samplingRate,
      slowThreshold,
      trackingEnabled
    } = getPerformanceOptions(this.view);
    trackingEnabled && startMeasureReactNodeViewRendered({
      nodeTypeName: this.node.type.name
    });
    this.renderReactComponent(() => this.render(this.reactComponentProps, this.handleRef));
    trackingEnabled && stopMeasureReactNodeViewRendered({
      nodeTypeName: this.node.type.name,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
      editorState: this.view.state,
      samplingRate,
      slowThreshold
    });
    return this;
  }

  renderReactComponent(component) {
    if (!this.domRef || !component) {
      return;
    }

    const componentWithErrorBoundary = () => {
      var _this$node$type$name, _this$node, _this$node$type;

      return /*#__PURE__*/React.createElement(ErrorBoundary, {
        component: ACTION_SUBJECT.REACT_NODE_VIEW,
        componentId: (_this$node$type$name = this === null || this === void 0 ? void 0 : (_this$node = this.node) === null || _this$node === void 0 ? void 0 : (_this$node$type = _this$node.type) === null || _this$node$type === void 0 ? void 0 : _this$node$type.name) !== null && _this$node$type$name !== void 0 ? _this$node$type$name : ACTION_SUBJECT_ID.UNKNOWN_NODE,
        dispatchAnalyticsEvent: this.dispatchAnalyticsEvent
      }, component());
    };

    this.portalProviderAPI.render(componentWithErrorBoundary, this.domRef, this.hasAnalyticsContext, this.hasIntlContext);
  }

  createDomRef() {
    if (!this.node.isInline) {
      return document.createElement('div');
    }

    const htmlElement = document.createElement('span');
    return htmlElement;
  }

  getContentDOM() {
    return undefined;
  }

  _handleRef(node) {
    const contentDOM = this.contentDOMWrapper || this.contentDOM; // move the contentDOM node inside the inner reference after rendering

    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM);
    }
  }

  render(props, forwardRef) {
    return this.reactComponent ? /*#__PURE__*/React.createElement(this.reactComponent, _extends({
      view: this.view,
      getPos: this.getPos,
      node: this.node,
      forwardRef: forwardRef
    }, props)) : null;
  }

  update(node, _decorations, _innerDecorations, validUpdate = () => true) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate = this.node.type === node.type && validUpdate(this.node, node);

    if (!isValidUpdate) {
      return false;
    }

    if (this.domRef && !this.node.sameMarkup(node)) {
      this.setDomAttrs(node, this.domRef);
    } // View should not process a re-render if this is false.
    // We dont want to destroy the view, so we return true.


    if (!this.viewShouldUpdate(node)) {
      this.node = node;
      return true;
    }

    this.node = node;
    this.renderReactComponent(() => this.render(this.reactComponentProps, this.handleRef));
    return true;
  }

  viewShouldUpdate(nextNode) {
    if (this._viewShouldUpdate) {
      return this._viewShouldUpdate(nextNode);
    }

    return true;
  }
  /**
   * Copies the attributes from a ProseMirror Node to a DOM node.
   * @param node The Prosemirror Node from which to source the attributes
   */


  setDomAttrs(node, element) {
    Object.keys(node.attrs || {}).forEach(attr => {
      element.setAttribute(attr, node.attrs[attr]);
    });
  }

  get dom() {
    return this.domRef;
  }

  destroy() {
    if (!this.domRef) {
      return;
    }

    this.portalProviderAPI.remove(this.domRef);
    this.domRef = undefined;
    this.contentDOM = undefined;
  }

  static fromComponent(component, portalProviderAPI, eventDispatcher, props, viewShouldUpdate, hasIntlContext = false) {
    return (node, view, getPos) => new ReactNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, props, component, false, viewShouldUpdate, hasIntlContext).init();
  }

}