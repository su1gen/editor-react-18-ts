"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconStatus = exports.IconQuote = exports.IconPanelWarning = exports.IconPanelSuccess = exports.IconPanelNote = exports.IconPanelError = exports.IconPanel = exports.IconMention = exports.IconListNumber = exports.IconList = exports.IconLink = exports.IconLayout = exports.IconImages = exports.IconHeading = exports.IconFeedback = exports.IconFallback = exports.IconExpand = exports.IconEmoji = exports.IconDivider = exports.IconDecision = exports.IconDate = exports.IconCustomPanel = exports.IconCode = exports.IconAction = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _excluded = ["level"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || (0, _typeof2.default)(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var IconAction = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./action'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconAction = IconAction;
var IconCode = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./code'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconCode = IconCode;
var IconDate = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./date'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconDate = IconDate;
var IconDecision = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./decision'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconDecision = IconDecision;
var IconDivider = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./divider'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconDivider = IconDivider;
var IconEmoji = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./emoji'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconEmoji = IconEmoji;
var IconImages = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./images'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconImages = IconImages;
var IconLayout = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./layout'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconLayout = IconLayout;
var IconLink = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./link'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconLink = IconLink;
var IconListNumber = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./list-number'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconListNumber = IconListNumber;
var IconList = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./list'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconList = IconList;
var IconMention = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./mention'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconMention = IconMention;
var IconPanelError = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./panel-error'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconPanelError = IconPanelError;
var IconPanelNote = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./panel-note'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconPanelNote = IconPanelNote;
var IconPanelSuccess = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./panel-success'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconPanelSuccess = IconPanelSuccess;
var IconPanelWarning = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./panel-warning'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconPanelWarning = IconPanelWarning;
var IconPanel = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./panel'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconPanel = IconPanel;
var IconCustomPanel = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./custom-panel'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconCustomPanel = IconCustomPanel;
var IconQuote = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./quote'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconQuote = IconQuote;
var IconStatus = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./status'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconStatus = IconStatus;
var IconFallback = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./fallback'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconFallback = IconFallback;

function importHeading(level) {
  switch (level) {
    case 1:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading1"));
      });

    case 2:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading2"));
      });

    case 3:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading3"));
      });

    case 4:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading4"));
      });

    case 5:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading5"));
      });

    case 6:
    default:
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./heading6"));
      });
  }
}

var IconHeading = function IconHeading(_ref) {
  var level = _ref.level,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var Icon = (0, _reactLoadable.default)({
    loader: function loader() {
      return importHeading(level).then(function (module) {
        return module.default;
      });
    },
    loading: function loading() {
      return null;
    }
  });
  return /*#__PURE__*/_react.default.createElement(Icon, props);
};

exports.IconHeading = IconHeading;
var IconFeedback = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./feedback'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconFeedback = IconFeedback;
var IconExpand = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./expand'));
    }).then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
exports.IconExpand = IconExpand;