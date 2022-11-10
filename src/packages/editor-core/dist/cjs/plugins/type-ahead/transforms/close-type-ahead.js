"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeTypeAhead = void 0;

var _key = require("../pm-plugins/key");

var _actions = require("../pm-plugins/actions");

var closeTypeAhead = function closeTypeAhead(tr) {
  return tr.setMeta(_key.pluginKey, {
    action: _actions.ACTIONS.CLOSE_TYPE_AHEAD
  });
};

exports.closeTypeAhead = closeTypeAhead;