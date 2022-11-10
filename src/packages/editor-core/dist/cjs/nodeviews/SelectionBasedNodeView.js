"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectionBasedNodeView = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _reactNodeview = require("../plugins/base/pm-plugins/react-nodeview");

var _ReactNodeView2 = _interopRequireDefault(require("./ReactNodeView"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A ReactNodeView that handles React components sensitive
 * to selection changes.
 *
 * If the selection changes, it will attempt to re-render the
 * React component. Otherwise it does nothing.
 *
 * You can subclass `viewShouldUpdate` to include other
 * props that your component might want to consider before
 * entering the React lifecycle. These are usually props you
 * compare in `shouldComponentUpdate`.
 *
 * An example:
 *
 * ```
 * viewShouldUpdate(nextNode) {
 *   if (nextNode.attrs !== this.node.attrs) {
 *     return true;
 *   }
 *
 *   return super.viewShouldUpdate(nextNode);
 * }```
 */
var SelectionBasedNodeView = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(SelectionBasedNodeView, _ReactNodeView);

  var _super = _createSuper(SelectionBasedNodeView);

  function SelectionBasedNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, reactComponent) {
    var _this;

    var hasContext = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var viewShouldUpdate = arguments.length > 8 ? arguments[8] : undefined;
    var hasIntlContext = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
    (0, _classCallCheck2.default)(this, SelectionBasedNodeView);
    _this = _super.call(this, node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, reactComponent, hasContext, viewShouldUpdate, hasIntlContext);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isNodeInsideSelection", function (from, to, pos, posEnd) {
      var _this$getPositionsWit = _this.getPositionsWithDefault(pos, posEnd);

      pos = _this$getPositionsWit.pos;
      posEnd = _this$getPositionsWit.posEnd;

      if (typeof pos !== 'number' || typeof posEnd !== 'number') {
        return false;
      }

      return from <= pos && to >= posEnd;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSelectionInsideNode", function (from, to, pos, posEnd) {
      var _this$getPositionsWit2 = _this.getPositionsWithDefault(pos, posEnd);

      pos = _this$getPositionsWit2.pos;
      posEnd = _this$getPositionsWit2.posEnd;

      if (typeof pos !== 'number' || typeof posEnd !== 'number') {
        return false;
      }

      return pos < from && to < posEnd;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSelectedNode", function (selection) {
      if (selection instanceof _prosemirrorState.NodeSelection) {
        var _this$view$state$sele = _this.view.state.selection,
            from = _this$view$state$sele.from,
            to = _this$view$state$sele.to;
        return selection.node === _this.node || // If nodes are not the same object, we check if they are referring to the same document node
        _this.pos === from && _this.posEnd === to && selection.node.eq(_this.node);
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "insideSelection", function () {
      var _this$view$state$sele2 = _this.view.state.selection,
          from = _this$view$state$sele2.from,
          to = _this$view$state$sele2.to;
      return _this.isSelectedNode(_this.view.state.selection) || _this.isSelectionInsideNode(from, to);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "nodeInsideSelection", function () {
      var selection = _this.view.state.selection;
      var from = selection.from,
          to = selection.to;
      return _this.isSelectedNode(selection) || _this.isNodeInsideSelection(from, to);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onSelectionChange", function () {
      _this.update(_this.node, []);
    });

    _this.updatePos();

    _this.oldSelection = view.state.selection;
    _this.selectionChangeState = _reactNodeview.stateKey.getState(_this.view.state);

    _this.selectionChangeState.subscribe(_this.onSelectionChange);

    return _this;
  }
  /**
   * Update current node's start and end positions.
   *
   * Prefer `this.pos` rather than getPos(), because calling getPos is
   * expensive, unless you know you're definitely going to render.
   */


  (0, _createClass2.default)(SelectionBasedNodeView, [{
    key: "updatePos",
    value: function updatePos() {
      if (typeof this.getPos === 'boolean') {
        return;
      }

      this.pos = this.getPos();
      this.posEnd = this.pos + this.node.nodeSize;
    }
  }, {
    key: "getPositionsWithDefault",
    value: function getPositionsWithDefault(pos, posEnd) {
      return {
        pos: typeof pos !== 'number' ? this.pos : pos,
        posEnd: typeof posEnd !== 'number' ? this.posEnd : posEnd
      };
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(_nextNode) {
      var selection = this.view.state.selection; // update selection

      var oldSelection = this.oldSelection;
      this.oldSelection = selection; // update cached positions

      var oldPos = this.pos,
          oldPosEnd = this.posEnd;
      this.updatePos();
      var from = selection.from,
          to = selection.to;
      var oldFrom = oldSelection.from,
          oldTo = oldSelection.to;

      if (this.node.type.spec.selectable) {
        var newNodeSelection = selection instanceof _prosemirrorState.NodeSelection && selection.from === this.pos;
        var oldNodeSelection = oldSelection instanceof _prosemirrorState.NodeSelection && oldSelection.from === this.pos;

        if (newNodeSelection && !oldNodeSelection || oldNodeSelection && !newNodeSelection) {
          return true;
        }
      }

      var movedInToSelection = this.isNodeInsideSelection(from, to) && !this.isNodeInsideSelection(oldFrom, oldTo);
      var movedOutOfSelection = !this.isNodeInsideSelection(from, to) && this.isNodeInsideSelection(oldFrom, oldTo);
      var moveOutFromOldSelection = this.isNodeInsideSelection(from, to, oldPos, oldPosEnd) && !this.isNodeInsideSelection(from, to);

      if (movedInToSelection || movedOutOfSelection || moveOutFromOldSelection) {
        return true;
      }

      return false;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.selectionChangeState.unsubscribe(this.onSelectionChange);
      (0, _get2.default)((0, _getPrototypeOf2.default)(SelectionBasedNodeView.prototype), "destroy", this).call(this);
    }
  }]);
  return SelectionBasedNodeView;
}(_ReactNodeView2.default);

exports.SelectionBasedNodeView = SelectionBasedNodeView;