"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInlineNodeViewProducer = getInlineNodeViewProducer;
exports.inlineNodeViewClassname = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("@atlaskit/editor-common/utils");

var _analytics = require("../plugins/analytics");

var _consts = require("../plugins/analytics/consts");

var _ErrorBoundary = require("../ui/ErrorBoundary");

var _getPerformanceOptions = require("./getPerformanceOptions");

var inlineNodeViewClassname = 'inlineNodeView';
exports.inlineNodeViewClassname = inlineNodeViewClassname;

function createNodeView(_ref) {
  var nodeViewParams = _ref.nodeViewParams,
      pmPluginFactoryParams = _ref.pmPluginFactoryParams,
      Component = _ref.Component,
      extraComponentProps = _ref.extraComponentProps;
  // We set a variable for the current node which is
  // used for comparisions when doing updates, before being
  // overwritten to the updated node.
  var currentNode = nodeViewParams.node; // First we setup the dom element which will be rendered and "tracked" by prosemirror
  // and also used as a "editor portal" (not react portal) target by the editor
  // portal provider api, for rendering the Component passed.

  var domRef = document.createElement('span');
  domRef.contentEditable = 'false';
  setDomAttrs(nodeViewParams.node, domRef); // @see ED-3790
  // something gets messed up during mutation processing inside of a
  // nodeView if DOM structure has nested plain "div"s, it doesn't see the
  // difference between them and it kills the nodeView

  domRef.classList.add("".concat(nodeViewParams.node.type.name, "View-content-wrap"), "".concat(inlineNodeViewClassname)); // This util is shared for tracking rendering, and the ErrorBoundary that
  // is setup to wrap the Component when rendering
  // NOTE: This is not a prosemirror dispatch

  function dispatchAnalyticsEvent(payload) {
    pmPluginFactoryParams.eventDispatcher.emit(_consts.analyticsEventKey, {
      payload: payload
    });
  } // This is called to render the Component into domRef which is inside the
  // prosemirror View.
  // Internally it uses the unstable_renderSubtreeIntoContainer api to render,
  // to the passed dom element (domRef) which means it is automatically
  // "cleaned up" when you do a "re render".


  function renderComponent() {
    pmPluginFactoryParams.portalProviderAPI.render(getPortalChildren({
      dispatchAnalyticsEvent: dispatchAnalyticsEvent,
      currentNode: currentNode,
      nodeViewParams: nodeViewParams,
      Component: Component,
      extraComponentProps: extraComponentProps
    }), domRef, false, // node views should be rendered with intl context
    true);
  }

  var _getPerformanceOption = (0, _getPerformanceOptions.getPerformanceOptions)(nodeViewParams.view),
      samplingRate = _getPerformanceOption.samplingRate,
      slowThreshold = _getPerformanceOption.slowThreshold,
      trackingEnabled = _getPerformanceOption.trackingEnabled;

  trackingEnabled && (0, _getPerformanceOptions.startMeasureReactNodeViewRendered)({
    nodeTypeName: currentNode.type.name
  }); // We render the component while creating the node view

  renderComponent();
  trackingEnabled && (0, _getPerformanceOptions.stopMeasureReactNodeViewRendered)({
    nodeTypeName: currentNode.type.name,
    dispatchAnalyticsEvent: dispatchAnalyticsEvent,
    editorState: nodeViewParams.view.state,
    samplingRate: samplingRate,
    slowThreshold: slowThreshold
  }); // https://prosemirror.net/docs/ref/#view.NodeView

  var nodeView = {
    get dom() {
      return domRef;
    },

    update: function update(nextNode, _decorations) {
      // Let ProseMirror handle the update if node types are different.
      // This prevents an issue where it was not possible to select the
      // inline node view then replace it by entering text - the node
      // view contents would be deleted but the node view itself would
      // stay in the view and become uneditable.
      if (currentNode.type !== nextNode.type) {
        return false;
      } // On updates, we only set the new attributes if the type, attributes, and marks
      // have changed on the node.
      // NOTE: this could mean attrs changes aren't reflected in the dom,
      // when an attribute key which was previously present is no longer
      // present.
      // ie.
      // -> Original attributes { text: "hello world", color: "red" }
      // -> Updated attributes { color: "blue" }
      // in this case, the dom text attribute will not be cleared.
      //
      // This may not be an issue with any of our current node schemas.


      if (!currentNode.sameMarkup(nextNode)) {
        setDomAttrs(nextNode, domRef);
      }

      currentNode = nextNode;
      renderComponent();
      return true;
    },
    destroy: function destroy() {
      // When prosemirror destroys the node view, we need to clean up
      // what we have previously rendered using the editor portal
      // provider api.
      pmPluginFactoryParams.portalProviderAPI.remove(domRef); // @ts-expect-error Expect an error as domRef is expected to be
      // of HTMLSpanElement type however once the node view has
      // been destroyed no other consumers should still be using it.

      domRef = undefined;
    }
  };
  return nodeView;
}
/**
 * Copies the attributes from a ProseMirror Node to a DOM node.
 * @param node The Prosemirror Node from which to source the attributes
 */


function setDomAttrs(node, element) {
  Object.keys(node.attrs || {}).forEach(function (attr) {
    element.setAttribute(attr, node.attrs[attr]);
  });
}

function getPortalChildren(_ref2) {
  var dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent,
      currentNode = _ref2.currentNode,
      nodeViewParams = _ref2.nodeViewParams,
      Component = _ref2.Component,
      extraComponentProps = _ref2.extraComponentProps;
  return function portalChildren() {
    var _currentNode$type$nam, _currentNode$type;

    //  All inline nodes use `display: inline` to allow for multi-line
    //  wrapping. This does produce an issue in Chrome where it is not
    //  possible to click select the position after the node,
    //  see: https://product-fabric.atlassian.net/browse/ED-12003
    //  however this is only a problem for node views that use
    //  `display: inline-block` somewhere within the Component.
    //  Looking at the below structure, spans with className
    //  `inlineNodeViewAddZeroWidthSpace` have pseudo elements that
    //  add a zero width space which fixes the problem.
    //  Without the additional zero width space before the Component,
    //  it is not possible to use the keyboard to range select in Safari.
    //
    //  Zero width spaces on either side of the Component also prevent
    //  the cursor from appearing inside the node view on all browsers.
    //
    //  Note:
    //  In future it is worth considering prohibiting the use of `display: inline-block`
    //  within inline node view Components however would require a sizable
    //  refactor. A test suite to catch any instances of this is ideal however
    //  the refactor required is currently out of scope for https://product-fabric.atlassian.net/browse/ED-14176
    return /*#__PURE__*/_react.default.createElement(_ErrorBoundary.ErrorBoundary, {
      component: _analytics.ACTION_SUBJECT.REACT_NODE_VIEW,
      componentId: (_currentNode$type$nam = currentNode === null || currentNode === void 0 ? void 0 : (_currentNode$type = currentNode.type) === null || _currentNode$type === void 0 ? void 0 : _currentNode$type.name) !== null && _currentNode$type$nam !== void 0 ? _currentNode$type$nam : _analytics.ACTION_SUBJECT_ID.UNKNOWN_NODE,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "".concat(inlineNodeViewClassname, "AddZeroWidthSpace")
    }), _utils.ZERO_WIDTH_SPACE, /*#__PURE__*/_react.default.createElement(Component, (0, _extends2.default)({
      view: nodeViewParams.view,
      getPos: nodeViewParams.getPos,
      node: currentNode
    }, extraComponentProps)), /*#__PURE__*/_react.default.createElement("span", {
      className: "".concat(inlineNodeViewClassname, "AddZeroWidthSpace")
    }));
  };
} // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
// The prosemirror EditorProps has a nodeViews key which has the rough shape:
// type nodeViews: {
//   [nodeViewName: string]: (node, editorView, getPos, decorations, innerDecorations) => NodeView
// }
// So the value of the keys on the nodeViews object, are a function which should return a NodeView.
// The following type NodeViewProducer, refers to these functions which return a NodeView.
//
// So the above type could also be described as
// type NodeViewProducer = (node, editorView, getPos, decorations, innerDecorations) => NodeView
// nodeViews: {
//   [nodeViewName: string]: NodeViewProducer
// }


// This return of this function is intended to be the value of a key
// in a ProseMirror nodeViews object.
function getInlineNodeViewProducer(_ref3) {
  var pmPluginFactoryParams = _ref3.pmPluginFactoryParams,
      Component = _ref3.Component,
      extraComponentProps = _ref3.extraComponentProps;

  function nodeViewProducer() {
    var nodeView = createNodeView({
      nodeViewParams: {
        node: arguments.length <= 0 ? undefined : arguments[0],
        view: arguments.length <= 1 ? undefined : arguments[1],
        getPos: arguments.length <= 2 ? undefined : arguments[2],
        decorations: arguments.length <= 3 ? undefined : arguments[3]
      },
      pmPluginFactoryParams: pmPluginFactoryParams,
      Component: Component,
      extraComponentProps: extraComponentProps
    });
    return nodeView;
  }

  return nodeViewProducer;
}