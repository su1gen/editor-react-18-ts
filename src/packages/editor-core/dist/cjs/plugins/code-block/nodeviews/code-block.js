"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeBlockNodeView = exports.CodeBlockView = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _utils = require("@atlaskit/editor-common/utils");

var _prosemirrorModel = require("prosemirror-model");

var _classNames = require("../ui/class-names");

var _actions = require("../actions");

var _mainState = require("../pm-plugins/main-state");

var MATCH_NEWLINES = new RegExp('\n', 'g');

var toDOM = function toDOM(node) {
  return ['div', {
    class: 'code-block'
  }, ['div', {
    class: _classNames.codeBlockClassNames.start,
    contenteditable: 'false'
  }], ['div', {
    class: _classNames.codeBlockClassNames.gutter,
    contenteditable: 'false'
  }], ['div', {
    class: _classNames.codeBlockClassNames.content
  }, ['code', {
    'data-language': node.attrs.language || '',
    spellcheck: 'false',
    contenteditable: 'true',
    'data-testid': 'code-block--code'
  }, 0]], ['div', {
    class: _classNames.codeBlockClassNames.end,
    contenteditable: 'false'
  }]];
};

var CodeBlockView = /*#__PURE__*/function () {
  function CodeBlockView(_node, view, getPos) {
    var _this = this;

    (0, _classCallCheck2.default)(this, CodeBlockView);
    (0, _defineProperty2.default)(this, "ensureLineNumbers", (0, _rafSchd.default)(function () {
      var lines = 1;

      _this.node.forEach(function (node) {
        var text = node.text;

        if (text) {
          lines += (node.text.match(MATCH_NEWLINES) || []).length;
        }
      });

      while (_this.lineNumberGutter.childElementCount < lines) {
        _this.lineNumberGutter.appendChild(document.createElement('span'));
      }

      while (_this.lineNumberGutter.childElementCount > lines) {
        _this.lineNumberGutter.removeChild(_this.lineNumberGutter.lastChild);
      }
    }));

    var _DOMSerializer$render = _prosemirrorModel.DOMSerializer.renderSpec(document, toDOM(_node)),
        dom = _DOMSerializer$render.dom,
        contentDOM = _DOMSerializer$render.contentDOM;

    this.getPos = getPos;
    this.view = view;
    this.node = _node;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.lineNumberGutter = this.dom.querySelector(".".concat(_classNames.codeBlockClassNames.gutter));
    this.ensureLineNumbers();
  }

  (0, _createClass2.default)(CodeBlockView, [{
    key: "updateDOMAndSelection",
    value: function updateDOMAndSelection(savedInnerHTML, newCursorPosition) {
      var _this$dom;

      if ((_this$dom = this.dom) !== null && _this$dom !== void 0 && _this$dom.childNodes && this.dom.childNodes.length > 1) {
        var _contentView$childNod;

        var contentView = this.dom.childNodes[1];

        if ((contentView === null || contentView === void 0 ? void 0 : (_contentView$childNod = contentView.childNodes) === null || _contentView$childNod === void 0 ? void 0 : _contentView$childNod.length) > 0) {
          var codeElement = contentView.firstChild;
          codeElement.innerHTML = savedInnerHTML; // We need to set cursor for the DOM update

          var textElement = (0, _toConsumableArray2.default)(codeElement.childNodes).find(function (child) {
            return child.nodeName === '#text';
          });
          var sel = window.getSelection();
          var range = document.createRange();
          range.setStart(textElement, newCursorPosition);
          range.collapse(true);
          sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
          sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        }
      }
    }
  }, {
    key: "coalesceDOMElements",
    value: function coalesceDOMElements() {
      var _this$dom2;

      if ((_this$dom2 = this.dom) !== null && _this$dom2 !== void 0 && _this$dom2.childNodes && this.dom.childNodes.length > 1) {
        var contentView = this.dom.childNodes[1];

        if (contentView !== null && contentView !== void 0 && contentView.childNodes && contentView.childNodes.length > 1) {
          var savedInnerHTML = '';

          while (contentView.childNodes.length > 1) {
            var lastChild = contentView.lastChild;
            savedInnerHTML = lastChild.innerHTML + savedInnerHTML;
            contentView.removeChild(lastChild);
          }

          var firstChild = contentView.firstChild;
          savedInnerHTML = firstChild.innerHTML + '\n' + savedInnerHTML;
          var newCursorPosition = firstChild.innerHTML.length + 1;
          setTimeout(this.updateDOMAndSelection.bind(this, savedInnerHTML, newCursorPosition), 20);
        }
      }
    }
  }, {
    key: "update",
    value: function update(node) {
      if (node.type !== this.node.type) {
        return false;
      }

      if (node !== this.node) {
        if (node.attrs.language !== this.node.attrs.language) {
          this.contentDOM.setAttribute('data-language', node.attrs.language || '');
        }

        this.node = node;
        this.ensureLineNumbers();

        if (_utils.browser.android) {
          this.coalesceDOMElements();
          (0, _actions.resetShouldIgnoreFollowingMutations)(this.view.state, this.view.dispatch);
        }
      }

      return true;
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation(record) {
      var pluginState = (0, _mainState.getPluginState)(this.view.state);

      if (pluginState !== null && pluginState !== void 0 && pluginState.shouldIgnoreFollowingMutations) {
        return true;
      } // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock


      return record.target === this.lineNumberGutter || record.target.parentNode === this.lineNumberGutter;
    }
  }]);
  return CodeBlockView;
}();

exports.CodeBlockView = CodeBlockView;

var codeBlockNodeView = function codeBlockNodeView(node, view, getPos) {
  return new CodeBlockView(node, view, getPos);
};

exports.codeBlockNodeView = codeBlockNodeView;