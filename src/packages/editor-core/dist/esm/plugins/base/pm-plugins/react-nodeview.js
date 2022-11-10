import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var ReactNodeViewState = /*#__PURE__*/function () {
  function ReactNodeViewState() {
    _classCallCheck(this, ReactNodeViewState);

    _defineProperty(this, "changeHandlers", []);

    this.changeHandlers = [];
  }

  _createClass(ReactNodeViewState, [{
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
export var stateKey = new PluginKey('reactNodeView');
export var plugin = new SafePlugin({
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

var plugins = function plugins() {
  return [plugin];
};

export default plugins;