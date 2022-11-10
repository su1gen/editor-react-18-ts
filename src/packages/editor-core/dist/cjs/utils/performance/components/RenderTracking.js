"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderTracking = RenderTracking;

var _react = require("react");

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _utils = require("@atlaskit/editor-common/utils");

var _analytics = require("../../../plugins/analytics");

function RenderTracking(props) {
  var debouncedHandleAnalyticsEvent = (0, _react.useMemo)(function () {
    return (0, _debounce.default)(props.handleAnalyticsEvent, 500);
  }, [props.handleAnalyticsEvent]);
  (0, _utils.useComponentRenderTracking)({
    onRender: function onRender(_ref) {
      var renderCount = _ref.renderCount,
          propsDifference = _ref.propsDifference;

      if (!renderCount) {
        return;
      }

      debouncedHandleAnalyticsEvent({
        payload: {
          action: props.action,
          actionSubject: props.actionSubject,
          attributes: {
            count: renderCount,
            propsDifference: propsDifference
          },
          eventType: _analytics.EVENT_TYPE.OPERATIONAL
        }
      });
    },
    propsDiffingOptions: {
      enabled: true,
      props: props.componentProps,
      propsToIgnore: props.propsToIgnore,
      useShallow: props.useShallow
    },
    zeroBasedCount: true
  });
  return null;
}