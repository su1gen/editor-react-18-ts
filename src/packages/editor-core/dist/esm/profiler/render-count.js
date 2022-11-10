import React, { useRef } from 'react';
import uuid from 'uuid';
import { useComponentRenderTracking } from '@atlaskit/editor-common/utils';
import { RenderCountProfiler as RenderCountProfilerClass } from '@atlaskit/editor-common/utils';
export var ProfiledComponentIds;

(function (ProfiledComponentIds) {
  ProfiledComponentIds["editor"] = "Editor";
  ProfiledComponentIds["appearance"] = "FullPageEditor";
  ProfiledComponentIds["reactEditorView"] = "ReactEditorView";
  ProfiledComponentIds["contentArea"] = "FullPageContentArea";
  ProfiledComponentIds["toolbar"] = "FullPageToolbar";
  ProfiledComponentIds["mention"] = "MentionNodeView";
})(ProfiledComponentIds || (ProfiledComponentIds = {}));

var CoreRenderCountProfiler = function CoreRenderCountProfiler(_ref) {
  var componentId = _ref.componentId;

  var _useRef = useRef(uuid()),
      instanceId = _useRef.current;

  var onRender = function onRender(_ref2) {
    var renderCount = _ref2.renderCount;
    var profiler = RenderCountProfilerClass.getInstance({
      store: window
    });
    profiler.setRenderCount({
      componentId: componentId,
      instanceId: instanceId,
      renderCount: renderCount
    });
  };

  useComponentRenderTracking({
    onRender: onRender,
    propsDiffingOptions: {
      enabled: false
    },
    zeroBasedCount: false
  });
  return null;
};

export var RenderCountProfiler = function RenderCountProfiler(_ref3) {
  var componentId = _ref3.componentId;
  var profiler = RenderCountProfilerClass.getInstance({
    store: window
  });

  if (profiler.isEnabled()) {
    return /*#__PURE__*/React.createElement(CoreRenderCountProfiler, {
      componentId: componentId
    });
  }

  return null;
};