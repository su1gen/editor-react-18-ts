"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorSmartCardEvents = void 0;

var _react = require("react");

var _actions = require("../pm-plugins/actions");

var _smartCard = require("@atlaskit/smart-card");

var EditorSmartCardEvents = function EditorSmartCardEvents(_ref) {
  var editorView = _ref.editorView;
  var events = (0, _smartCard.useSmartLinkEvents)();
  (0, _react.useEffect)(function () {
    if (!events) {
      return;
    }

    editorView.dispatch((0, _actions.registerSmartCardEvents)(events)(editorView.state.tr));
  }, [events, editorView]);
  return null;
};

exports.EditorSmartCardEvents = EditorSmartCardEvents;