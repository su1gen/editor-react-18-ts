import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { TextSelection, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Slice } from 'prosemirror-model';
export var FakeTextCursorBookmark = /*#__PURE__*/function () {
  function FakeTextCursorBookmark(pos) {
    _classCallCheck(this, FakeTextCursorBookmark);

    _defineProperty(this, "pos", undefined);

    _defineProperty(this, "visible", false);

    this.pos = pos;
  }

  _createClass(FakeTextCursorBookmark, [{
    key: "map",
    value: function map(mapping) {
      return new FakeTextCursorBookmark(mapping.map(this.pos));
    }
  }, {
    key: "resolve",
    value: function resolve(doc) {
      var $pos = doc.resolve(this.pos);
      return Selection.near($pos);
    }
  }]);

  return FakeTextCursorBookmark;
}();
export var FakeTextCursorSelection = /*#__PURE__*/function (_Selection) {
  _inherits(FakeTextCursorSelection, _Selection);

  var _super = _createSuper(FakeTextCursorSelection);

  function FakeTextCursorSelection($pos) {
    _classCallCheck(this, FakeTextCursorSelection);

    return _super.call(this, $pos, $pos);
  }

  _createClass(FakeTextCursorSelection, [{
    key: "map",
    value: function map(doc, mapping) {
      var $pos = doc.resolve(mapping.map(this.$head.pos));
      return new FakeTextCursorSelection($pos);
    }
  }, {
    key: "eq",
    value: function eq(other) {
      return other instanceof FakeTextCursorSelection && other.head === this.head;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        type: 'Cursor',
        pos: this.head
      };
    }
  }, {
    key: "getBookmark",
    value: function getBookmark() {
      return new FakeTextCursorBookmark(this.anchor);
    }
  }], [{
    key: "content",
    value: function content() {
      return Slice.empty;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(doc, json) {
      return new FakeTextCursorSelection(doc.resolve(json.pos));
    }
  }]);

  return FakeTextCursorSelection;
}(Selection);
Selection.jsonID('fake-text-cursor', FakeTextCursorSelection);
export var addFakeTextCursor = function addFakeTextCursor(state, dispatch) {
  var selection = state.selection;

  if (selection.empty) {
    var $from = state.selection.$from;
    dispatch(state.tr.setSelection(new FakeTextCursorSelection($from)));
  }
};
export var removeFakeTextCursor = function removeFakeTextCursor(state, dispatch) {
  if (state.selection instanceof FakeTextCursorSelection) {
    var $from = state.selection.$from;
    dispatch(state.tr.setSelection(new TextSelection($from)));
  }
};
export var drawFakeTextCursor = function drawFakeTextCursor(state) {
  if (!(state.selection instanceof FakeTextCursorSelection)) {
    return null;
  }

  var node = document.createElement('div');
  node.className = 'ProseMirror-fake-text-cursor';
  return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node, {
    key: 'Cursor'
  })]);
};