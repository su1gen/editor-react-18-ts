"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onItemActivated = onItemActivated;

var _commands = require("../../list/commands");

var _commands2 = require("../../indentation/commands");

var _keymaps = require("../../tasks-and-decisions/pm-plugins/keymaps");

var _analytics = require("../../analytics");

var _indentationButtons = require("../pm-plugins/indentation-buttons");

function onItemActivated(_ref) {
  var buttonName = _ref.buttonName,
      editorView = _ref.editorView;

  switch (buttonName) {
    case 'bullet_list':
      (0, _commands.toggleBulletList)(editorView, _analytics.INPUT_METHOD.TOOLBAR);
      break;

    case 'ordered_list':
      (0, _commands.toggleOrderedList)(editorView, _analytics.INPUT_METHOD.TOOLBAR);
      break;

    case 'indent':
      {
        var node = _indentationButtons.pluginKey.getState(editorView.state).node;

        if (node === 'paragraph_heading') {
          (0, _commands2.getIndentCommand)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (node === 'list') {
          (0, _commands.indentList)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (node === 'taskList') {
          (0, _keymaps.getIndentCommand)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        break;
      }

    case 'outdent':
      {
        var _node = _indentationButtons.pluginKey.getState(editorView.state).node;

        if (_node === 'paragraph_heading') {
          (0, _commands2.getOutdentCommand)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (_node === 'list') {
          (0, _commands.outdentList)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (_node === 'taskList') {
          (0, _keymaps.getUnindentCommand)(_analytics.INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        break;
      }
  }
}