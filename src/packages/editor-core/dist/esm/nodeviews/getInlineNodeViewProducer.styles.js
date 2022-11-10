import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import { inlineNodeViewClassname } from './getInlineNodeViewProducer'; // For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export var InlineNodeViewSharedStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .", " {\n    display: inline;\n    user-select: all;\n    /* Collapses zero width spaces inside the inline node view\n    to prevent the node from line breaking too early.\n    */\n    white-space: nowrap;\n    /* Then reset to the Editor default so we don't interfere\n    with any component styling. */\n    & > * {\n      white-space: pre-wrap;\n    }\n  }\n  /** Remove browser deafult selections style. This prevents\n    unexpected visual artefacts in Safari when navigating\n    with the keyboard or making range selections. */\n  &.ua-safari {\n    .", " {\n      ::selection,\n      *::selection {\n        background: transparent;\n      }\n    }\n  }\n\n  &.ua-chrome .", " > span {\n    user-select: none;\n  }\n\n  .", "AddZeroWidthSpace {\n    ::after {\n      content: '", "';\n    }\n  }\n"])), inlineNodeViewClassname, inlineNodeViewClassname, inlineNodeViewClassname, inlineNodeViewClassname, ZERO_WIDTH_SPACE);