import React, { useRef } from 'react';
import uuid from 'uuid';
import { useComponentRenderTracking } from '@atlaskit/editor-common/utils';
import { RenderCountProfiler as RenderCountProfilerClass } from '@atlaskit/editor-common/utils';
export let ProfiledComponentIds;

(function (ProfiledComponentIds) {
  ProfiledComponentIds["editor"] = "Editor";
  ProfiledComponentIds["appearance"] = "FullPageEditor";
  ProfiledComponentIds["reactEditorView"] = "ReactEditorView";
  ProfiledComponentIds["contentArea"] = "FullPageContentArea";
  ProfiledComponentIds["toolbar"] = "FullPageToolbar";
  ProfiledComponentIds["mention"] = "MentionNodeView";
})(ProfiledComponentIds || (ProfiledComponentIds = {}));

const CoreRenderCountProfiler = ({
  componentId
}) => {
  const {
    current: instanceId
  } = useRef(uuid());

  const onRender = ({
    renderCount
  }) => {
    const profiler = RenderCountProfilerClass.getInstance({
      store: window
    });
    profiler.setRenderCount({
      componentId,
      instanceId,
      renderCount
    });
  };

  useComponentRenderTracking({
    onRender,
    propsDiffingOptions: {
      enabled: false
    },
    zeroBasedCount: false
  });
  return null;
};

export const RenderCountProfiler = ({
  componentId
}) => {
  const profiler = RenderCountProfilerClass.getInstance({
    store: window
  });

  if (profiler.isEnabled()) {
    return /*#__PURE__*/React.createElement(CoreRenderCountProfiler, {
      componentId: componentId
    });
  }

  return null;
};