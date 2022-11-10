import _defineProperty from "@babel/runtime/helpers/defineProperty";
import rafSchedule from 'raf-schd';
import { browser } from '@atlaskit/editor-common/utils';
import { DOMSerializer } from 'prosemirror-model';
import { codeBlockClassNames } from '../ui/class-names';
import { resetShouldIgnoreFollowingMutations } from '../actions';
import { getPluginState } from '../pm-plugins/main-state';
const MATCH_NEWLINES = new RegExp('\n', 'g');

const toDOM = node => ['div', {
  class: 'code-block'
}, ['div', {
  class: codeBlockClassNames.start,
  contenteditable: 'false'
}], ['div', {
  class: codeBlockClassNames.gutter,
  contenteditable: 'false'
}], ['div', {
  class: codeBlockClassNames.content
}, ['code', {
  'data-language': node.attrs.language || '',
  spellcheck: 'false',
  contenteditable: 'true',
  'data-testid': 'code-block--code'
}, 0]], ['div', {
  class: codeBlockClassNames.end,
  contenteditable: 'false'
}]];

export class CodeBlockView {
  constructor(_node, view, getPos) {
    _defineProperty(this, "ensureLineNumbers", rafSchedule(() => {
      let lines = 1;
      this.node.forEach(node => {
        const text = node.text;

        if (text) {
          lines += (node.text.match(MATCH_NEWLINES) || []).length;
        }
      });

      while (this.lineNumberGutter.childElementCount < lines) {
        this.lineNumberGutter.appendChild(document.createElement('span'));
      }

      while (this.lineNumberGutter.childElementCount > lines) {
        this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild);
      }
    }));

    const {
      dom,
      contentDOM
    } = DOMSerializer.renderSpec(document, toDOM(_node));
    this.getPos = getPos;
    this.view = view;
    this.node = _node;
    this.dom = dom;
    this.contentDOM = contentDOM;
    this.lineNumberGutter = this.dom.querySelector(`.${codeBlockClassNames.gutter}`);
    this.ensureLineNumbers();
  }

  updateDOMAndSelection(savedInnerHTML, newCursorPosition) {
    var _this$dom;

    if ((_this$dom = this.dom) !== null && _this$dom !== void 0 && _this$dom.childNodes && this.dom.childNodes.length > 1) {
      var _contentView$childNod;

      const contentView = this.dom.childNodes[1];

      if ((contentView === null || contentView === void 0 ? void 0 : (_contentView$childNod = contentView.childNodes) === null || _contentView$childNod === void 0 ? void 0 : _contentView$childNod.length) > 0) {
        const codeElement = contentView.firstChild;
        codeElement.innerHTML = savedInnerHTML; // We need to set cursor for the DOM update

        const textElement = [...codeElement.childNodes].find(child => child.nodeName === '#text');
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(textElement, newCursorPosition);
        range.collapse(true);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
      }
    }
  }

  coalesceDOMElements() {
    var _this$dom2;

    if ((_this$dom2 = this.dom) !== null && _this$dom2 !== void 0 && _this$dom2.childNodes && this.dom.childNodes.length > 1) {
      const contentView = this.dom.childNodes[1];

      if (contentView !== null && contentView !== void 0 && contentView.childNodes && contentView.childNodes.length > 1) {
        let savedInnerHTML = '';

        while (contentView.childNodes.length > 1) {
          const lastChild = contentView.lastChild;
          savedInnerHTML = lastChild.innerHTML + savedInnerHTML;
          contentView.removeChild(lastChild);
        }

        const firstChild = contentView.firstChild;
        savedInnerHTML = firstChild.innerHTML + '\n' + savedInnerHTML;
        const newCursorPosition = firstChild.innerHTML.length + 1;
        setTimeout(this.updateDOMAndSelection.bind(this, savedInnerHTML, newCursorPosition), 20);
      }
    }
  }

  update(node) {
    if (node.type !== this.node.type) {
      return false;
    }

    if (node !== this.node) {
      if (node.attrs.language !== this.node.attrs.language) {
        this.contentDOM.setAttribute('data-language', node.attrs.language || '');
      }

      this.node = node;
      this.ensureLineNumbers();

      if (browser.android) {
        this.coalesceDOMElements();
        resetShouldIgnoreFollowingMutations(this.view.state, this.view.dispatch);
      }
    }

    return true;
  }

  ignoreMutation(record) {
    const pluginState = getPluginState(this.view.state);

    if (pluginState !== null && pluginState !== void 0 && pluginState.shouldIgnoreFollowingMutations) {
      return true;
    } // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock


    return record.target === this.lineNumberGutter || record.target.parentNode === this.lineNumberGutter;
  }

}
export const codeBlockNodeView = (node, view, getPos) => new CodeBlockView(node, view, getPos);