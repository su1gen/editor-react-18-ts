import { useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useComponentRenderTracking } from '@atlaskit/editor-common/utils';
import { EVENT_TYPE } from '../../../plugins/analytics';
export function RenderTracking(props) {
  var debouncedHandleAnalyticsEvent = useMemo(function () {
    return debounce(props.handleAnalyticsEvent, 500);
  }, [props.handleAnalyticsEvent]);
  useComponentRenderTracking({
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
          eventType: EVENT_TYPE.OPERATIONAL
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