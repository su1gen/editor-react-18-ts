"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateKey = exports.plugin = exports.default = exports.ReactNodeViewState = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var ReactNodeViewState = /*#__PURE__*/function () {
  function ReactNodeViewState() {
    (0, _classCallCheck2.default)(this, ReactNodeViewState);
    (0, _defineProperty2.default)(this, "changeHandlers", []);
    this.changeHandlers = [];
  }

  (0, _createClass2.default)(ReactNodeViewState, [{
    key: "subscribe",
    value: function subscribe(cb) {
      this.changeHandlers.push(cb);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(cb) {
      this.changeHandlers = this.changeHandlers.filter(function (ch) {
        return ch !== cb;
      });
    }
  }, {
    key: "notifyNewSelection",
    value: function notifyNewSelection(fromPos, toPos) {
      this.changeHandlers.forEach(function (cb) {
        return cb(fromPos, toPos);
      });
    }
  }]);
  return ReactNodeViewState;
}();

exports.ReactNodeViewState = ReactNodeViewState;
var stateKey = new _prosemirrorState.PluginKey('reactNodeView');
exports.stateKey = stateKey;
var plugin = new _safePlugin.SafePlugin({
  state: {
    init: function init() {
      return new ReactNodeViewState();
    },
    apply: function apply(_tr, pluginState) {
      return pluginState;
    }
  },
  key: stateKey,
  view: function view(_view) {
    var pluginState = stateKey.getState(_view.state);
    return {
      update: function update(view) {
        var _view$state$selection = view.state.selection,
            from = _view$state$selection.from,
            to = _view$state$selection.to;
        pluginState.notifyNewSelection(from, to);
      }
    };
  }
});
exports.plugin = plugin;

var plugins = function plugins() {
  return [plugin];
};

var _default = plugins;
exports.default = _default;