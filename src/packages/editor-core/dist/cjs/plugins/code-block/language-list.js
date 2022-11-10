"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LANGUAGES = void 0;
exports.createLanguageList = createLanguageList;
exports.filterSupportedLanguages = filterSupportedLanguages;
exports.findMatchedLanguage = findMatchedLanguage;
exports.getLanguageIdentifier = getLanguageIdentifier;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _constants = require("@atlaskit/code/constants");

// We expect alias[0] to be used for the ADF attribute, see ED-2813
var DEFAULT_LANGUAGES = [{
  name: '(None)',
  alias: ['none'],
  value: 'none'
}].concat((0, _toConsumableArray2.default)(_constants.SUPPORTED_LANGUAGES));
exports.DEFAULT_LANGUAGES = DEFAULT_LANGUAGES;

function findMatchedLanguage(supportedLanguages, language) {
  if (!language) {
    return undefined;
  }

  var matches = supportedLanguages.filter(function (supportedLanguage) {
    return supportedLanguage.alias.indexOf(language.toLowerCase()) !== -1;
  });

  if (matches.length > 0) {
    return matches[0];
  }

  return undefined;
}

function filterSupportedLanguages(supportedLanguages) {
  if (!supportedLanguages || !supportedLanguages.length) {
    return DEFAULT_LANGUAGES;
  }

  return DEFAULT_LANGUAGES.filter(function (language) {
    var i = language.alias.length;

    while (i--) {
      if (supportedLanguages.indexOf(language.alias[i]) > -1) {
        return true;
      }
    }

    return false;
  });
}

function getLanguageIdentifier(language) {
  return language.alias[0];
}

function createLanguageList(supportedLanguages) {
  return supportedLanguages.sort(function (left, right) {
    if (left.alias[0] === 'none') {
      return -1;
    }

    if (left.name.toLowerCase() > right.name.toLowerCase()) {
      return 1;
    }

    if (left.name.toLowerCase() < right.name.toLowerCase()) {
      return -1;
    }

    return 0;
  });
}