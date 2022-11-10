"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateNodeView = DateNodeView;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@atlaskit/editor-common/styles");

var _reactIntlNext = require("react-intl-next");

var _utils = require("@atlaskit/editor-common/utils");

var _date = require("@atlaskit/date");

var _actions = require("../actions");

function DateNodeView(props) {
  var timestamp = props.node.attrs.timestamp,
      _props$view$state = props.view.state,
      doc = _props$view$state.doc,
      schema = _props$view$state.schema,
      selection = _props$view$state.selection,
      getPos = props.getPos;
  var intl = (0, _reactIntlNext.useIntl)(); // We fall back to selection.$from even though it does not cover all use cases
  // eg. upon Editor init, selection is at the start, not at the Date node

  var $nodePos = typeof getPos === 'function' ? doc.resolve(getPos()) : selection.$from;
  var parent = $nodePos.parent;
  var withinIncompleteTask = parent.type === schema.nodes.taskItem && parent.attrs.state !== 'DONE';
  var color = withinIncompleteTask && (0, _utils.isPastDate)(timestamp) ? 'red' : undefined;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: _styles.DateSharedCssClassName.DATE_WRAPPER,
    onClick: handleClick
  }, /*#__PURE__*/_react.default.createElement(_date.Date, {
    color: color,
    value: timestamp
  }, withinIncompleteTask ? (0, _utils.timestampToTaskContext)(timestamp, intl) : (0, _utils.timestampToString)(timestamp, intl)));

  function handleClick(event) {
    event.nativeEvent.stopImmediatePropagation();
    var _props$view = props.view,
        state = _props$view.state,
        dispatch = _props$view.dispatch;
    (0, _actions.setDatePickerAt)(state.selection.from)(state, dispatch);
  }
}