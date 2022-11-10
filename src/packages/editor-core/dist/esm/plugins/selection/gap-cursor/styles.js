import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css, keyframes } from '@emotion/react';
var gapCursorBlink = keyframes(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  from, to {\n    opacity: 0;\n  }\n  50% {\n    opacity: 1;\n  }\n"])));
export var hideCaretModifier = 'ProseMirror-hide-gapcursor';
var gapCursor = '.ProseMirror-gapcursor';
var prosemirrorwidget = '.ProseMirror-widget';
var wrapLeft = '[layout="wrap-left"]';
var wrapRight = '[layout="wrap-right"]';
export var gapCursorStyles = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  /* =============== GAP CURSOR ================== */\n  .ProseMirror {\n    &.", " {\n      caret-color: transparent;\n    }\n\n    ", " {\n      display: none;\n      pointer-events: none;\n      position: relative;\n\n      & span {\n        caret-color: transparent;\n        position: absolute;\n        height: 100%;\n        width: 100%;\n        display: block;\n      }\n\n      & span::after {\n        animation: 1s ", " step-end infinite;\n        border-left: 1px solid;\n        content: '';\n        display: block;\n        position: absolute;\n        top: 0;\n        height: 100%;\n      }\n      &.-left span::after {\n        left: -3px;\n      }\n      &.-right span::after {\n        right: -3px;\n      }\n      & span[layout='full-width'],\n      & span[layout='wide'] {\n        margin-left: 50%;\n        transform: translateX(-50%);\n      }\n      &", " {\n        float: right;\n      }\n\n      /* fix vertical alignment of gap cursor */\n      &:first-of-type + ul,\n      &:first-of-type + span + ul,\n      &:first-of-type + ol,\n      &:first-of-type + span + ol,\n      &:first-of-type + pre,\n      &:first-of-type + span + pre,\n      &:first-of-type + blockquote,\n      &:first-of-type + span + blockquote {\n        margin-top: 0;\n      }\n    }\n    &.ProseMirror-focused ", " {\n      display: block;\n      border-color: transparent;\n    }\n  }\n\n  /* This hack below is for two images aligned side by side */\n  ", "", " + span + ", ",\n  ", "", " + span + ", ",\n  ", " + ", " + ", ",\n  ", " + ", " + span + ", ",\n  ", " + ", " + ", ",\n  ", " + ", " + span + ", ",\n  ", " + ", " + ", ",\n  ", " + ", " + span ", ",\n  ", " + ", " + ", ",\n  ", " + ", " + span + ", ",\n  ", " + ", " {\n    clear: none;\n  }\n\n  ", " + ", " + ", " > div,\n  ", " + ", " + span + ", " > div,\n  ", " + ", " + ", " > div,\n  ", " + ", " + span + ", " > div,\n  ", " + ", " + ", " > div,\n  ", " + ", " + span + ", " > div,\n  ", " + ", " + ", " > div,\n  ", " + ", " + span + ", " > div {\n    margin-right: 0;\n    margin-left: 0;\n    margin-bottom: 0;\n  }\n\n  ", " + ", ",\n  ", " + ", " {\n    float: left;\n  }\n\n  ", " + ", " + span + ", "::after,\n  ", " + ", " + span + ", "::after,\n  ", " + ", " + ", "::after,\n  ", " + ", " + span + ", "::after,\n  ", " + ", " + ", "::after,\n  ", " + ", " + span + ", "::after {\n    visibility: hidden;\n    display: block;\n    font-size: 0;\n    content: ' ';\n    clear: both;\n    height: 0;\n  }\n\n  ", " + ", " + ", " + *,\n  ", " + ", " + ", " + span + *,\n  ", " + ", " + ", " + *,\n  ", " + ", " + ", " + span + *,\n  ", " + ", " + span + ", " + *,\n  ", " + ", " + span + ", " + *,\n  ", " + ", " + span + ", " + *,\n  ", " + ", " + span + ", " + *,\n  ", " + ", " + ", " + * > *,\n  ", " + ", " + ", " + span + * > *,\n  ", " + ", " + ", " + * > *,\n  ", " + ", " + ", " + span + * > *,\n  ", " + ", " + span + ", " + * > *,\n  ", " + ", " + span + ", " + * > *,\n  ", " + ", " + span + ", " + * > *,\n  ", " + ", " + span + ", " + * > *,\n  ", " + ", " + *,\n  ", " + ", " + span + * {\n    margin-top: 0;\n  }\n"])), hideCaretModifier, gapCursor, gapCursorBlink, wrapRight, gapCursor, gapCursor, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapLeft, gapCursor, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapRight, wrapLeft, gapCursor, wrapRight, gapCursor, gapCursor, wrapLeft, wrapRight, gapCursor, wrapRight, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, gapCursor, wrapLeft, wrapRight, gapCursor, wrapRight, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, wrapRight, gapCursor, wrapLeft, wrapLeft, gapCursor, wrapRight, wrapRight, gapCursor, wrapLeft, gapCursor, wrapLeft, wrapRight, gapCursor, wrapRight, wrapLeft, prosemirrorwidget, gapCursor, prosemirrorwidget, gapCursor);