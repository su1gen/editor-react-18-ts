"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participants = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var Participants = /*#__PURE__*/function () {
  function Participants() {
    var participants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();
    (0, _classCallCheck2.default)(this, Participants);
    this.participants = participants;
  }

  (0, _createClass2.default)(Participants, [{
    key: "add",
    value: function add(data) {
      var newSet = new Map(this.participants);
      data.forEach(function (participant) {
        newSet.set(participant.sessionId, participant);
      });
      return new Participants(newSet);
    }
  }, {
    key: "remove",
    value: function remove(sessionIds) {
      var newSet = new Map(this.participants);
      sessionIds.forEach(function (sessionId) {
        newSet.delete(sessionId);
      });
      return new Participants(newSet);
    }
  }, {
    key: "update",
    value: function update(sessionId, lastActive) {
      var newSet = new Map(this.participants);
      var data = newSet.get(sessionId);

      if (!data) {
        return this;
      }

      newSet.set(sessionId, _objectSpread(_objectSpread({}, data), {}, {
        lastActive: lastActive
      }));
      return new Participants(newSet);
    }
  }, {
    key: "updateCursorPos",
    value: function updateCursorPos(sessionId, cursorPos) {
      var newSet = new Map(this.participants);
      var data = newSet.get(sessionId);

      if (!data) {
        return this;
      }

      newSet.set(sessionId, _objectSpread(_objectSpread({}, data), {}, {
        cursorPos: cursorPos
      }));
      return new Participants(newSet);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return Array.from(this.participants.values());
    }
  }, {
    key: "get",
    value: function get(sessionId) {
      return this.participants.get(sessionId);
    }
  }, {
    key: "size",
    value: function size() {
      return this.participants.size;
    }
  }, {
    key: "eq",
    value: function eq(other) {
      var left = this.toArray().map(function (p) {
        return p.sessionId;
      }).sort(function (a, b) {
        return a > b ? -1 : 1;
      }).join('');
      var right = other.toArray().map(function (p) {
        return p.sessionId;
      }).sort(function (a, b) {
        return a > b ? -1 : 1;
      }).join('');
      return left === right;
    }
  }]);
  return Participants;
}();

exports.Participants = Participants;