"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _getDeviceInfo = _interopRequireDefault(require("./getDeviceInfo"));

var _getBrowserInfo = _interopRequireDefault(require("./getBrowserInfo"));

var JIRA_ISSUE_COLLECTOR_URL = 'https://product-fabric.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-w0bwo4/b/14/e73395c53c3b10fde2303f4bf74ffbf6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=98644b9c';

var loadJiraCollectorDialogScript = function loadJiraCollectorDialogScript(labels, packageName, coreVersion, packageVersion, sessionId, contentId, tabId) {
  return new Promise( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(resolve, reject) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (window.jQuery) {
                window.ATL_JQ_PAGE_PROPS = {
                  triggerFunction: function triggerFunction(showCollectorDialog) {
                    if (typeof showCollectorDialog === 'function') {
                      resolve(showCollectorDialog);
                    } else {
                      reject('Failed to initialize showCollectorDialog');
                    }
                  },
                  fieldValues: {
                    description: "Please describe the problem you're having or feature you'd like to see:\n\n\n",
                    // 11711 is the field ID for the Feedback Labels field on Product Fabric.
                    // this is found by clicking "configure" on the field and inspecting the URL
                    customfield_11711: labels || [],
                    customfield_11712: "version: ".concat(packageName, "@").concat(packageVersion, " (").concat(coreVersion, ")\n              Browser: ").concat((0, _getBrowserInfo.default)(navigator.userAgent), "\n              OS: ").concat((0, _getDeviceInfo.default)(navigator.userAgent, navigator.appVersion))
                  },
                  environment: {
                    'Editor Package': packageName,
                    'Editor Version': packageVersion,
                    'Editor Core Version': coreVersion,
                    sessionId: sessionId,
                    contentId: contentId,
                    tabId: tabId
                  },
                  priority: '1',
                  components: '15306' // Fix here

                };
                window.jQuery.ajax({
                  url: JIRA_ISSUE_COLLECTOR_URL,
                  type: 'get',
                  cache: true,
                  dataType: 'script'
                });
              } else {
                reject('jQuery is not defined');
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _default = loadJiraCollectorDialogScript;
exports.default = _default;