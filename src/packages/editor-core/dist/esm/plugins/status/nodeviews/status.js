import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { Status } from '@atlaskit/status/element';
import { messages } from './messages';
var styledStatus = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  opacity: 1;\n"])));
var styledStatusPlaceholder = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  opacity: 0.5;\n"])));

var StatusContainerView = function StatusContainerView(props) {
  var text = props.text,
      color = props.color,
      localId = props.localId,
      style = props.style,
      formatMessage = props.intl.formatMessage;
  var statusText = text ? text : formatMessage(messages.placeholder);

  var handleClick = function handleClick(event) {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    } // handling of popup is done in plugin.apply on selection change.

  };

  return jsx("span", {
    css: text ? styledStatus : styledStatusPlaceholder
  }, jsx(Status, {
    text: statusText,
    color: color,
    localId: localId,
    style: style,
    onClick: handleClick
  }));
};

export var IntlStatusContainerView = injectIntl(StatusContainerView);
export var StatusNodeView = function StatusNodeView(props) {
  var view = props.view;
  var _props$node$attrs = props.node.attrs,
      text = _props$node$attrs.text,
      color = _props$node$attrs.color,
      localId = _props$node$attrs.localId,
      style = _props$node$attrs.style;
  return jsx(IntlStatusContainerView, {
    view: view,
    text: text,
    color: color,
    style: style,
    localId: localId
  });
};