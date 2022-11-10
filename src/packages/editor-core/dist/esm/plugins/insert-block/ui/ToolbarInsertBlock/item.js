/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import EditorImageIcon from '@atlaskit/icon/glyph/editor/image';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DateIcon from '@atlaskit/icon/glyph/editor/date';
import StatusIcon from '@atlaskit/icon/glyph/status';
import ExpandNodeIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import PlaceholderTextIcon from '@atlaskit/icon/glyph/media-services/text';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';
import { shortcutStyle } from '../../../../ui/styles';
import { tooltip, addLink, toggleTable } from '../../../../keymaps';
import { shallowEquals } from './shallow-equals';

var from = function from(init) {
  return {
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    value: {
      name: init.name
    },
    elemBefore: jsx(init.Icon, {
      label: init.content
    }),
    elemAfter: init.shortcut ? jsx("div", {
      css: shortcutStyle
    }, init.shortcut) : undefined,
    'aria-label': init.content,
    'aria-haspopup': init['aria-haspopup'],
    shortcut: init.shortcut,
    isDisabled: init.disabled
  };
};

var mem = function mem(fn) {
  return memoizeOne(fn, shallowEquals);
};

export var action = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'action',
    shortcut: '[]',
    Icon: TaskIcon
  });
});
export var link = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'link',
    shortcut: tooltip(addLink),
    Icon: LinkIcon,
    'aria-haspopup': init['aria-haspopup']
  });
});
export var media = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'media',
    Icon: EditorImageIcon
  });
});
export var imageUpload = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'image upload',
    Icon: EditorImageIcon
  });
});
export var mention = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'mention',
    Icon: MentionIcon,
    shortcut: '@',
    'aria-haspopup': init['aria-haspopup']
  });
});
export var emoji = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'emoji',
    Icon: EmojiIcon,
    shortcut: ':',
    'aria-haspopup': init['aria-haspopup']
  });
});
export var table = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'table',
    Icon: TableIcon,
    shortcut: tooltip(toggleTable)
  });
});
export var layout = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'layout',
    Icon: LayoutTwoEqualIcon
  });
});
export var codeblock = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'codeblock',
    Icon: CodeIcon,
    shortcut: init.shortcut
  });
});
export var panel = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'panel',
    Icon: InfoIcon,
    shortcut: init.shortcut
  });
});
export var blockquote = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'blockquote',
    Icon: QuoteIcon,
    shortcut: init.shortcut
  });
});
export var decision = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'decision',
    Icon: DecisionIcon,
    shortcut: '<>'
  });
});
export var horizontalrule = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'horizontalrule',
    Icon: HorizontalRuleIcon,
    shortcut: '---'
  });
});
export var expand = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'expand',
    Icon: ExpandNodeIcon
  });
});
export var date = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'date',
    Icon: DateIcon,
    shortcut: '//'
  });
});
export var placeholder = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'placeholder text',
    Icon: function Icon() {
      return jsx(PlaceholderTextIcon, {
        label: ""
      });
    }
  });
});
export var status = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'status',
    Icon: StatusIcon
  });
});
export var more = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'macro',
    Icon: function Icon() {
      return jsx(EditorMoreIcon, {
        label: ""
      });
    }
  });
});