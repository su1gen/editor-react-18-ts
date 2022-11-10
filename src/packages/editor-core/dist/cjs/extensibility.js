"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmitterEvents = void 0;
Object.defineProperty(exports, "Extension", {
  enumerable: true,
  get: function get() {
    return _Extension.default;
  }
});
Object.defineProperty(exports, "ExtensionNode", {
  enumerable: true,
  get: function get() {
    return _extension.ExtensionNode;
  }
});
Object.defineProperty(exports, "ExtensionNodeWrapper", {
  enumerable: true,
  get: function get() {
    return _ExtensionNodeWrapper.default;
  }
});
Object.defineProperty(exports, "getChangedNodes", {
  enumerable: true,
  get: function get() {
    return _document.getChangedNodes;
  }
});
Object.defineProperty(exports, "tablePluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});
Object.defineProperty(exports, "toJSON", {
  enumerable: true,
  get: function get() {
    return _utils.toJSON;
  }
});
Object.defineProperty(exports, "validateNodes", {
  enumerable: true,
  get: function get() {
    return _nodes.validateNodes;
  }
});

var _document = require("./utils/document");

var _nodes = require("./utils/nodes");

var _utils = require("./utils");

var _Extension = _interopRequireDefault(require("./plugins/extension/ui/Extension"));

var _ExtensionNodeWrapper = _interopRequireDefault(require("./plugins/extension/ui/Extension/ExtensionNodeWrapper"));

var _extension = require("./plugins/extension/nodeviews/extension");

var _pluginKey = require("@atlaskit/editor-plugin-table/plugin-key");

var EmitterEvents = {
  TABLE_DELETED: 'TABLE_DELETED'
};
exports.EmitterEvents = EmitterEvents;