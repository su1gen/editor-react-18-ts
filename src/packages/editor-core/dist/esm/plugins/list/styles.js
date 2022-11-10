import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { browser } from '@atlaskit/editor-common/utils';
import { codeBlockInListSafariFix } from '@atlaskit/editor-common/styles';
export var listsStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror li {\n    position: relative;\n\n    > p:not(:first-child) {\n      margin: 4px 0 0 0;\n    }\n\n    // In SSR the above rule will apply to all p tags because first-child would be a style tag.\n    // The following rule resets the first p tag back to its original margin\n    // defined in packages/editor/editor-common/src/styles/shared/paragraph.ts\n    > style:first-child + p {\n      margin-top: ", ";\n    }\n\n    ", "\n  }\n"])), blockNodesVerticalMargin, browser.safari ? codeBlockInListSafariFix : '');