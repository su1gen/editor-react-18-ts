import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var Preset = /*#__PURE__*/function () {
  function Preset() {
    _classCallCheck(this, Preset);

    this.plugins = [];
  }

  _createClass(Preset, [{
    key: "add",
    value: function add(plugin) {
      this.plugins.push(plugin);
      return this;
    }
  }, {
    key: "has",
    value: function has(plugin) {
      return this.plugins.some(function (pluginPreset) {
        if (Array.isArray(pluginPreset)) {
          return pluginPreset[0] === plugin;
        }

        return pluginPreset === plugin;
      });
    }
  }, {
    key: "getEditorPlugins",
    value: function getEditorPlugins(excludes) {
      var editorPlugins = this.processEditorPlugins();
      return this.removeExcludedPlugins(editorPlugins, excludes);
    }
  }, {
    key: "processEditorPlugins",
    value: function processEditorPlugins() {
      var cache = new Map();
      this.plugins.forEach(function (pluginEntry) {
        if (Array.isArray(pluginEntry)) {
          var _pluginEntry = _slicedToArray(pluginEntry, 2),
              fn = _pluginEntry[0],
              options = _pluginEntry[1];

          cache.set(fn, options);
        } else {
          /**
           * Prevent usage of same plugin twice without override.
           * [
           *  plugin1,
           *  [plugin1, { option1: value }],
           *  plugin1, // This will throw
           * ]
           */
          if (cache.has(pluginEntry) && cache.get(pluginEntry) === undefined) {
            throw new Error("".concat(pluginEntry, " is already included!"));
          }

          cache.set(pluginEntry, undefined);
        }
      });
      var plugins = [];
      cache.forEach(function (options, fn) {
        plugins.push(fn(options));
      });
      return plugins;
    }
  }, {
    key: "removeExcludedPlugins",
    value: function removeExcludedPlugins(plugins, excludes) {
      if (excludes) {
        return plugins.filter(function (plugin) {
          return !plugin || !excludes.has(plugin.name);
        });
      }

      return plugins;
    }
  }]);

  return Preset;
}();