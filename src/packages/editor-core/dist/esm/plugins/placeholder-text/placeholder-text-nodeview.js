import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { Selection } from 'prosemirror-state';
import { browser, ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

var serializePlaceholderNode = function serializePlaceholderNode(node) {
  var element = document.createElement('span');
  element.classList.add('pm-placeholder'); // the inline node api test suite requires the following class name

  element.classList.add('placeholderView-content-wrap');

  if (browser.gecko) {
    element.setAttribute('contenteditable', 'true');
  }

  element.innerText = ZERO_WIDTH_SPACE;
  var elementChildren = document.createElement('span');
  elementChildren.classList.add('pm-placeholder__text');
  elementChildren.dataset.placeholder = node.attrs.text;
  elementChildren.setAttribute('contenteditable', 'false');
  element.appendChild(elementChildren);

  if (browser.safari) {
    element.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
  } else {
    element.appendChild(document.createElement('wbr'));
  }

  return element;
};

export var PlaceholderTextNodeView = /*#__PURE__*/function () {
  function PlaceholderTextNodeView(node, view, getPos) {
    _classCallCheck(this, PlaceholderTextNodeView);

    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = serializePlaceholderNode(this.node);
    this.getPos = getPos;
  }

  _createClass(PlaceholderTextNodeView, [{
    key: "stopEvent",
    value: function stopEvent(e) {
      if (e.type === 'mousedown' && typeof this.getPos === 'function') {
        e.preventDefault();
        var _view = this.view;
        var startNodePosition = this.getPos();
        var tr = _view.state.tr;
        tr.setSelection(Selection.near(tr.doc.resolve(startNodePosition)));

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
        tr.setSelection(Selection.near(tr.doc.resolve(placeholderEndPosition)));
        view.dispatch(tr);
        return true;
      }

      return true;
    }
  }]);

  return PlaceholderTextNodeView;
}();