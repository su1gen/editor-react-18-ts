import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { createDispatch } from '../event-dispatcher';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../plugins/analytics';
import { analyticsEventKey } from '../plugins/analytics/consts';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { getPerformanceOptions, startMeasureReactNodeViewRendered, stopMeasureReactNodeViewRendered } from './getPerformanceOptions';

var ReactNodeView = /*#__PURE__*/function () {
  function ReactNodeView(_node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, reactComponent) {
    var _this = this;

    var hasAnalyticsContext = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var viewShouldUpdate = arguments.length > 8 ? arguments[8] : undefined;
    var hasIntlContext = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;

    _classCallCheck(this, ReactNodeView);

    _defineProperty(this, "handleRef", function (node) {
      return _this._handleRef(node);
    });

    _defineProperty(this, "dispatchAnalyticsEvent", function (payload) {
      if (_this.eventDispatcher) {
        var dispatch = createDispatch(_this.eventDispatcher);
        dispatch(analyticsEventKey, {
          payload: payload
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


  _createClass(ReactNodeView, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.domRef = this.createDomRef();
      this.setDomAttrs(this.node, this.domRef);

      var _ref = this.getContentDOM() || {
        dom: undefined,
        contentDOM: undefined
      },
          contentDOMWrapper = _ref.dom,
          contentDOM = _ref.contentDOM;

      if (this.domRef && contentDOMWrapper) {
        this.domRef.appendChild(contentDOMWrapper);
        this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper;
        this.contentDOMWrapper = contentDOMWrapper || contentDOM;
      } // @see ED-3790
      // something gets messed up during mutation processing inside of a
      // nodeView if DOM structure has nested plain "div"s, it doesn't see the
      // difference between them and it kills the nodeView


      this.domRef.classList.add("".concat(this.node.type.name, "View-content-wrap"));

      var _getPerformanceOption = getPerformanceOptions(this.view),
          samplingRate = _getPerformanceOption.samplingRate,
          slowThreshold = _getPerformanceOption.slowThreshold,
          trackingEnabled = _getPerformanceOption.trackingEnabled;

      trackingEnabled && startMeasureReactNodeViewRendered({
        nodeTypeName: this.node.type.name
      });
      this.renderReactComponent(function () {
        return _this2.render(_this2.reactComponentProps, _this2.handleRef);
      });
      trackingEnabled && stopMeasureReactNodeViewRendered({
        nodeTypeName: this.node.type.name,
        dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        editorState: this.view.state,
        samplingRate: samplingRate,
        slowThreshold: slowThreshold
      });
      return this;
    }
  }, {
    key: "renderReactComponent",
    value: function renderReactComponent(component) {
      var _this3 = this;

      if (!this.domRef || !component) {
        return;
      }

      var componentWithErrorBoundary = function componentWithErrorBoundary() {
        var _this3$node$type$name, _this3$node, _this3$node$type;

        return /*#__PURE__*/React.createElement(ErrorBoundary, {
          component: ACTION_SUBJECT.REACT_NODE_VIEW,
          componentId: (_this3$node$type$name = _this3 === null || _this3 === void 0 ? void 0 : (_this3$node = _this3.node) === null || _this3$node === void 0 ? void 0 : (_this3$node$type = _this3$node.type) === null || _this3$node$type === void 0 ? void 0 : _this3$node$type.name) !== null && _this3$node$type$name !== void 0 ? _this3$node$type$name : ACTION_SUBJECT_ID.UNKNOWN_NODE,
          dispatchAnalyticsEvent: _this3.dispatchAnalyticsEvent
        }, component());
      };

      this.portalProviderAPI.render(componentWithErrorBoundary, this.domRef, this.hasAnalyticsContext, this.hasIntlContext);
    }
  }, {
    key: "createDomRef",
    value: function createDomRef() {
      if (!this.node.isInline) {
        return document.createElement('div');
      }

      var htmlElement = document.createElement('span');
      return htmlElement;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      return undefined;
    }
  }, {
    key: "_handleRef",
    value: function _handleRef(node) {
      var contentDOM = this.contentDOMWrapper || this.contentDOM; // move the contentDOM node inside the inner reference after rendering

      if (node && contentDOM && !node.contains(contentDOM)) {
        node.appendChild(contentDOM);
      }
    }
  }, {
    key: "render",
    value: function render(props, forwardRef) {
      return this.reactComponent ? /*#__PURE__*/React.createElement(this.reactComponent, _extends({
        view: this.view,
        getPos: this.getPos,
        node: this.node,
        forwardRef: forwardRef
      }, props)) : null;
    }
  }, {
    key: "update",
    value: function update(node, _decorations, _innerDecorations) {
      var _this4 = this;

      var validUpdate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
        return true;
      };
      // @see https://github.com/ProseMirror/prosemirror/issues/648
      var isValidUpdate = this.node.type === node.type && validUpdate(this.node, node);

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
      this.renderReactComponent(function () {
        return _this4.render(_this4.reactComponentProps, _this4.handleRef);
      });
      return true;
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this._viewShouldUpdate) {
        return this._viewShouldUpdate(nextNode);
      }

      return true;
    }
    /**
     * Copies the attributes from a ProseMirror Node to a DOM node.
     * @param node The Prosemirror Node from which to source the attributes
     */

  }, {
    key: "setDomAttrs",
    value: function setDomAttrs(node, element) {
      Object.keys(node.attrs || {}).forEach(function (attr) {
        element.setAttribute(attr, node.attrs[attr]);
      });
    }
  }, {
    key: "dom",
    get: function get() {
      return this.domRef;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this.domRef) {
        return;
      }

      this.portalProviderAPI.remove(this.domRef);
      this.domRef = undefined;
      this.contentDOM = undefined;
    }
  }], [{
    key: "fromComponent",
    value: function fromComponent(component, portalProviderAPI, eventDispatcher, props, viewShouldUpdate) {
      var hasIntlContext = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      return function (node, view, getPos) {
        return new ReactNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, props, component, false, viewShouldUpdate, hasIntlContext).init();
      };
    }
  }]);

  return ReactNodeView;
}();

export { ReactNodeView as default };