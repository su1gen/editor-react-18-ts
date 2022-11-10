"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderCountProfiler = exports.ProfiledComponentIds = void 0;

var _react = _interopRequireWildcard(require("react"));

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("@atlaskit/editor-common/utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ProfiledComponentIds;
exports.ProfiledComponentIds = ProfiledComponentIds;

(function (ProfiledComponentIds) {
  ProfiledComponentIds["editor"] = "Editor";
  ProfiledComponentIds["appearance"] = "FullPageEditor";
  ProfiledComponentIds["reactEditorView"] = "ReactEditorView";
  ProfiledComponentIds["contentArea"] = "FullPageContentArea";
  ProfiledComponentIds["toolbar"] = "FullPageToolbar";
  ProfiledComponentIds["mention"] = "MentionNodeView";
})(ProfiledComponentIds || (exports.ProfiledComponentIds = ProfiledComponentIds = {}));

var CoreRenderCountProfiler = function CoreRenderCountProfiler(_ref) {
  var componentId = _ref.componentId;

  var _useRef = (0, _react.useRef)((0, _uuid.default)()),
      instanceId = _useRef.current;

  var onRender = function onRender(_ref2) {
    var renderCount = _ref2.renderCount;

    var profiler = _utils.RenderCountProfiler.getInstance({
      store: window
    });

    profiler.setRenderCount({
      componentId: componentId,
      instanceId: instanceId,
      renderCount: renderCount
    });
  };

  (0, _utils.useComponentRenderTracking)({
    onRender: onRender,
    propsDiffingOptions: {
      enabled: false
    },
    zeroBasedCount: false
  });
  return null;
};

var RenderCountProfiler = function RenderCountProfiler(_ref3) {
  var componentId = _ref3.componentId;

  var profiler = _utils.RenderCountProfiler.getInstance({
    store: window
  });

  if (profiler.isEnabled()) {
    return /*#__PURE__*/_react.default.createElement(CoreRenderCountProfiler, {
      componentId: componentId
    });
  }

  return null;
};

exports.RenderCountProfiler = RenderCountProfiler;