import React from 'react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { useIntl } from 'react-intl-next';
import { timestampToString, timestampToTaskContext, isPastDate } from '@atlaskit/editor-common/utils';
import { Date } from '@atlaskit/date';
import { setDatePickerAt } from '../actions';
export function DateNodeView(props) {
  var timestamp = props.node.attrs.timestamp,
      _props$view$state = props.view.state,
      doc = _props$view$state.doc,
      schema = _props$view$state.schema,
      selection = _props$view$state.selection,
      getPos = props.getPos;
  var intl = useIntl(); // We fall back to selection.$from even though it does not cover all use cases
  // eg. upon Editor init, selection is at the start, not at the Date node

  var $nodePos = typeof getPos === 'function' ? doc.resolve(getPos()) : selection.$from;
  var parent = $nodePos.parent;
  var withinIncompleteTask = parent.type === schema.nodes.taskItem && parent.attrs.state !== 'DONE';
  var color = withinIncompleteTask && isPastDate(timestamp) ? 'red' : undefined;
  return /*#__PURE__*/React.createElement("span", {
    className: DateSharedCssClassName.DATE_WRAPPER,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement(Date, {
    color: color,
    value: timestamp
  }, withinIncompleteTask ? timestampToTaskContext(timestamp, intl) : timestampToString(timestamp, intl)));

  function handleClick(event) {
    event.nativeEvent.stopImmediatePropagation();
    var _props$view = props.view,
        state = _props$view.state,
        dispatch = _props$view.dispatch;
    setDatePickerAt(state.selection.from)(state, dispatch);
  }
}