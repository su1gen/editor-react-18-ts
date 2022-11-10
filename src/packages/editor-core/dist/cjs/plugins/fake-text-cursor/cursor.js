"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFakeTextCursor = exports.drawFakeTextCursor = exports.addFakeTextCursor = exports.FakeTextCursorSelection = exports.FakeTextCursorBookmark = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorModel = require("prosemirror-model");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FakeTextCursorBookmark = /*#__PURE__*/function () {
  function FakeTextCursorBookmark(pos) {
    (0, _classCallCheck2.default)(this, FakeTextCursorBookmark);
    (0, _defineProperty2.default)(this, "pos", undefined);
    (0, _defineProperty2.default)(this, "visible", false);
    this.pos = pos;
  }

  (0, _createClass2.default)(FakeTextCursorBookmark, [{
    key: "map",
    value: function map(mapping) {
      return new FakeTextCursorBookmark(mapping.map(this.pos));
    }
  }, {
    key: "resolve",
    value: function resolve(doc) {
      var $pos = doc.resolve(this.pos);
      return _prosemirrorState.Selection.near($pos);
    }
  }]);
  return FakeTextCursorBookmark;
}();

exports.FakeTextCursorBookmark = FakeTextCursorBookmark;

var FakeTextCursorSelection = /*#__PURE__*/function (_Selection) {
  (0, _inherits2.default)(FakeTextCursorSelection, _Selection);

  var _super = _createSuper(FakeTextCursorSelection);

  function FakeTextCursorSelection($pos) {
    (0, _classCallCheck2.default)(this, FakeTextCursorSelection);
    return _super.call(this, $pos, $pos);
  }

  (0, _createClass2.default)(FakeTextCursorSelection, [{
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
      return _prosemirrorModel.Slice.empty;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(doc, json) {
      return new FakeTextCursorSelection(doc.resolve(json.pos));
    }
  }]);
  return FakeTextCursorSelection;
}(_prosemirrorState.Selection);

exports.FakeTextCursorSelection = FakeTextCursorSelection;

_prosemirrorState.Selection.jsonID('fake-text-cursor', FakeTextCursorSelection);

var addFakeTextCursor = function addFakeTextCursor(state, dispatch) {
  var selection = state.selection;

  if (selection.empty) {
    var $from = state.selection.$from;
    dispatch(state.tr.setSelection(new FakeTextCursorSelection($from)));
  }
};

exports.addFakeTextCursor = addFakeTextCursor;

var removeFakeTextCursor = function removeFakeTextCursor(state, dispatch) {
  if (state.selection instanceof FakeTextCursorSelection) {
    var $from = state.selection.$from;
    dispatch(state.tr.setSelection(new _prosemirrorState.TextSelection($from)));
  }
};

exports.removeFakeTextCursor = removeFakeTextCursor;

var drawFakeTextCursor = function drawFakeTextCursor(state) {
  if (!(state.selection instanceof FakeTextCursorSelection)) {
    return null;
  }

  var node = document.createElement('div');
  node.className = 'ProseMirror-fake-text-cursor';
  return _prosemirrorView.DecorationSet.create(state.doc, [_prosemirrorView.Decoration.widget(state.selection.head, node, {
    key: 'Cursor'
  })]);
};

exports.drawFakeTextCursor = drawFakeTextCursor;