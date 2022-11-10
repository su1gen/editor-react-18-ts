import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import getDeviceInfo from './getDeviceInfo';
import getBrowserInfo from './getBrowserInfo';
var JIRA_ISSUE_COLLECTOR_URL = 'https://product-fabric.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-w0bwo4/b/14/e73395c53c3b10fde2303f4bf74ffbf6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=98644b9c';

var loadJiraCollectorDialogScript = function loadJiraCollectorDialogScript(labels, packageName, coreVersion, packageVersion, sessionId, contentId, tabId) {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                    customfield_11712: "version: ".concat(packageName, "@").concat(packageVersion, " (").concat(coreVersion, ")\n              Browser: ").concat(getBrowserInfo(navigator.userAgent), "\n              OS: ").concat(getDeviceInfo(navigator.userAgent, navigator.appVersion))
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

export default loadJiraCollectorDialogScript;