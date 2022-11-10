import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { Caption } from '@atlaskit/editor-common/ui';
import { SelectionBasedNodeView } from '../../../nodeviews/';
export class CaptionNodeView extends SelectionBasedNodeView {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "selected", this.insideSelection());
  }

  createDomRef() {
    const domRef = document.createElement('figcaption');
    domRef.setAttribute('data-caption', 'true');
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    return {
      dom
    };
  }

  render(_props, forwardRef) {
    return /*#__PURE__*/React.createElement(Caption, {
      selected: this.insideSelection(),
      hasContent: this.node.content.childCount > 0
    }, /*#__PURE__*/React.createElement("div", {
      ref: forwardRef
    }));
  }

  viewShouldUpdate(nextNode) {
    if (this.node.childCount !== nextNode.childCount) {
      return true;
    }

    const newSelected = this.insideSelection();
    const selectedStateChange = this.selected !== newSelected;
    this.selected = newSelected;
    return selectedStateChange;
  }

}
export default function captionNodeView(portalProviderAPI, eventDispatcher) {
  return (node, view, getPos) => {
    const hasIntlContext = true;
    return new CaptionNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {}, undefined, undefined, undefined, hasIntlContext).init();
  };
}