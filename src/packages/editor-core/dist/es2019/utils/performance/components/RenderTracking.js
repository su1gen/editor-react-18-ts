import { useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useComponentRenderTracking } from '@atlaskit/editor-common/utils';
import { EVENT_TYPE } from '../../../plugins/analytics';
export function RenderTracking(props) {
  const debouncedHandleAnalyticsEvent = useMemo(() => debounce(props.handleAnalyticsEvent, 500), [props.handleAnalyticsEvent]);
  useComponentRenderTracking({
    onRender: ({
      renderCount,
      propsDifference
    }) => {
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