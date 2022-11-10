import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants'; // We expect alias[0] to be used for the ADF attribute, see ED-2813

export var DEFAULT_LANGUAGES = [{
  name: '(None)',
  alias: ['none'],
  value: 'none'
}].concat(_toConsumableArray(SUPPORTED_LANGUAGES));
export function findMatchedLanguage(supportedLanguages, language) {
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
export function filterSupportedLanguages(supportedLanguages) {
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
export function getLanguageIdentifier(language) {
  return language.alias[0];
}
export function createLanguageList(supportedLanguages) {
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