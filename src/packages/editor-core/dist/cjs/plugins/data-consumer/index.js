"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _adfSchema = require("@atlaskit/adf-schema");

var _prosemirrorState = require("prosemirror-state");

var _pluginKey = require("./plugin-key");

function createPlugin() {
  return new _prosemirrorState.Plugin({
    key: _pluginKey.pluginKey
  });
}

var dataConsumerMarkPlugin = function dataConsumerMarkPlugin() {
  return {
    name: 'dataConsumerPlugin',
    marks: function marks() {
      return [{
        name: 'dataConsumer',
        mark: _adfSchema.dataConsumer
      }];
    }
  };
};

var _default = dataConsumerMarkPlugin;
exports.default = _default;