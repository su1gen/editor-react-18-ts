import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';
import { getContextualToolbarItemsFromModule } from '@atlaskit/editor-common/extensions';
import ButtonGroup from '@atlaskit/button/button-group';
import { nodeToJSON } from '../../../utils';
import { createExtensionAPI } from '../../extension/extension-api';
import Button from './Button';
import Separator from './Separator';

var noop = function noop() {
  return null;
};

var isDefaultExport = function isDefaultExport(mod) {
  return mod.hasOwnProperty('default');
};

var resolveExtensionIcon = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(getIcon) {
    var maybeIcon;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (getIcon) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", noop);

          case 2:
            _context.next = 4;
            return getIcon();

          case 4:
            maybeIcon = _context.sent;
            return _context.abrupt("return", isDefaultExport(maybeIcon) ? maybeIcon.default : maybeIcon);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function resolveExtensionIcon(_x) {
    return _ref.apply(this, arguments);
  };
}();

var ExtensionButton = function ExtensionButton(props) {
  var item = props.item,
      node = props.node,
      editorView = props.editorView;
  var ButtonIcon = item.icon ? Loadable({
    loader: function () {
      var _loader = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", resolveExtensionIcon(item.icon));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function loader() {
        return _loader.apply(this, arguments);
      }

      return loader;
    }(),
    loading: noop
  }) : undefined;

  var onClick = function onClick() {
    if (typeof item.action !== 'function') {
      throw new Error("'action' of context toolbar item '".concat(item.key, "' is not a function"));
    }

    var targetNodeAdf = nodeToJSON(node);
    var api = createExtensionAPI({
      editorView: editorView
    });
    item.action(targetNodeAdf, api);
  };

  return /*#__PURE__*/React.createElement(Button, {
    title: item.label,
    icon: ButtonIcon ? /*#__PURE__*/React.createElement(ButtonIcon, {
      label: item.label || ''
    }) : undefined,
    onClick: onClick,
    tooltipContent: item.tooltip,
    disabled: item.disabled
  }, item.label);
};

export var ExtensionsPlaceholder = function ExtensionsPlaceholder(props) {
  var node = props.node,
      editorView = props.editorView,
      extensionProvider = props.extensionProvider,
      separator = props.separator;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      extensions = _useState2[0],
      setExtensions = _useState2[1];

  useEffect(function () {
    if (extensionProvider) {
      getExtensions();
    }

    function getExtensions() {
      return _getExtensions.apply(this, arguments);
    } // leaving dependencies array empty so that this effect runs just once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps


    function _getExtensions() {
      _getExtensions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = setExtensions;
                _context3.next = 3;
                return extensionProvider.getExtensions();

              case 3:
                _context3.t1 = _context3.sent;
                (0, _context3.t0)(_context3.t1);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _getExtensions.apply(this, arguments);
    }
  }, []);
  var extensionItems = React.useMemo(function () {
    return getContextualToolbarItemsFromModule(extensions, nodeToJSON(node), createExtensionAPI({
      editorView: editorView
    }));
  }, [extensions, node, editorView]);

  if (!extensionItems.length) {
    return null;
  } // ButtonGroup wraps each child with another layer
  // but count fragment as 1 child, so here we create the children manually.


  var children = [];

  if (separator && ['start', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/React.createElement(Separator, null));
  }

  extensionItems.forEach(function (item, index) {
    children.push( /*#__PURE__*/React.createElement(ExtensionButton, {
      node: node,
      item: item,
      editorView: editorView
    }));

    if (index < extensionItems.length - 1) {
      children.push( /*#__PURE__*/React.createElement(Separator, null));
    }
  });

  if (separator && ['end', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/React.createElement(Separator, null));
  }

  return /*#__PURE__*/React.createElement(ButtonGroup, {
    children: children
  });
};