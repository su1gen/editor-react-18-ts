import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { SelectionStyle, getSelectionStyles, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
export var emojiStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .", " {\n    display: inline-block;\n\n    .", " {\n      cursor: pointer;\n\n      &.", " > span {\n        /** needed for selection style to cover custom emoji image properly */\n        display: flex;\n      }\n    }\n\n    &.", " {\n      .", ",\n        .", " {\n        border-radius: 2px;\n        ", "\n      }\n    }\n  }\n"])), EmojiSharedCssClassName.EMOJI_CONTAINER, EmojiSharedCssClassName.EMOJI_NODE, EmojiSharedCssClassName.EMOJI_IMAGE, akEditorSelectedNodeClassName, EmojiSharedCssClassName.EMOJI_SPRITE, EmojiSharedCssClassName.EMOJI_IMAGE, getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.BoxShadow]));