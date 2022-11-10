import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["level"];
import React from 'react';
import Loadable from 'react-loadable';
export var IconAction = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-action" */
    './action').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconCode = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-code" */
    './code').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconDate = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-date" */
    './date').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconDecision = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-decision" */
    './decision').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconDivider = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-divider" */
    './divider').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconEmoji = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-emoji" */
    './emoji').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconImages = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-images" */
    './images').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconLayout = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-layout" */
    './layout').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconLink = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-link" */
    './link').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconListNumber = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-list-number" */
    './list-number').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconList = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-list" */
    './list').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconMention = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-mention" */
    './mention').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconPanelError = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-panel-error" */
    './panel-error').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconPanelNote = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-panel-note" */
    './panel-note').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconPanelSuccess = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-panel-success" */
    './panel-success').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconPanelWarning = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-panel-warning" */
    './panel-warning').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconPanel = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-panel" */
    './panel').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconCustomPanel = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-custon-panel" */
    './custom-panel').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconQuote = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-quote" */
    './quote').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconStatus = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-status" */
    './status').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconFallback = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-fallback" */
    './fallback').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});

function importHeading(level) {
  switch (level) {
    case 1:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-1" */
      "./heading1");

    case 2:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-2" */
      "./heading2");

    case 3:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-3" */
      "./heading3");

    case 4:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-4" */
      "./heading4");

    case 5:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-5" */
      "./heading5");

    case 6:
    default:
      return import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-heading-6" */
      "./heading6");
  }
}

export var IconHeading = function IconHeading(_ref) {
  var level = _ref.level,
      props = _objectWithoutProperties(_ref, _excluded);

  var Icon = Loadable({
    loader: function loader() {
      return importHeading(level).then(function (module) {
        return module.default;
      });
    },
    loading: function loading() {
      return null;
    }
  });
  return /*#__PURE__*/React.createElement(Icon, props);
};
export var IconFeedback = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-feedback" */
    './feedback').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
export var IconExpand = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-expand" */
    './expand').then(function (module) {
      return module.default;
    });
  },
  loading: function loading() {
    return null;
  }
});