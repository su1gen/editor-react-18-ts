"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlaceholderTextNodeView = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _prosemirrorState = require("prosemirror-state");

var _utils = require("@atlaskit/editor-common/utils");

var serializePlaceholderNode = function serializePlaceholderNode(node) {
  var element = document.createElement('span');
  element.classList.add('pm-placeholder'); // the inline node api test suite requires the following class name

  element.classList.add('placeholderView-content-wrap');

  if (_utils.browser.gecko) {
    element.setAttribute('contenteditable', 'true');
  }

  element.innerText = _utils.ZERO_WIDTH_SPACE;
  var elementChildren = document.createElement('span');
  elementChildren.classList.add('pm-placeholder__text');
  elementChildren.dataset.placeholder = node.attrs.text;
  elementChildren.setAttribute('contenteditable', 'false');
  element.appendChild(elementChildren);

  if (_utils.browser.safari) {
    element.appendChild(document.createTextNode(_utils.ZERO_WIDTH_SPACE));
  } else {
    element.appendChild(document.createElement('wbr'));
  }

  return element;
};

var PlaceholderTextNodeView = /*#__PURE__*/function () {
  function PlaceholderTextNodeView(node, view, getPos) {
    (0, _classCallCheck2.default)(this, PlaceholderTextNodeView);
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = serializePlaceholderNode(this.node);
    this.getPos = getPos;
  }

  (0, _createClass2.default)(PlaceholderTextNodeView, [{
    key: "stopEvent",
    value: function stopEvent(e) {
      if (e.type === 'mousedown' && typeof this.getPos === 'function') {
        e.preventDefault();
        var _view = this.view;
        var startNodePosition = this.getPos();
        var tr = _view.state.tr;
        tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(startNodePosition)));

        _view.dispatch(tr);

        return true;
      }

      return false;
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation(record) {
      if (typeof this.getPos !== 'function' || record.type !== 'selection') {
        return true;
      }

      var view = this.view,
          node = this.node;
      var placeholderStartPosition = this.getPos();
      var placeholderEndPosition = this.getPos() + node.nodeSize;
      var selection = view.state.selection; // when the selection is set right after the placeholder.
      // we should let ProseMirror deal with this edge-case

      if (selection.from === placeholderEndPosition) {
        return false;
      }

      var isSelectionAtPlaceholder = selection.from === placeholderStartPosition;
      var isSelectionAfterlaceholder = selection.from > placeholderEndPosition;

      if (isSelectionAtPlaceholder || isSelectionAfterlaceholder) {
        var tr = view.state.tr;
        tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(placeholderEndPosition)));
        view.dispatch(tr);
        return true;
      }

      return true;
    }
  }]);
  return PlaceholderTextNodeView;
}();

exports.PlaceholderTextNodeView = PlaceholderTextNodeView;