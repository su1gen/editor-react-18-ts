var endPositionNames = ['macro-browser', 'slash-onboarding'];

var isMacro = function isMacro(item) {
  return typeof item.content === 'string' && item.content.includes('macro');
};

export var sortItems = function sortItems(items) {
  return items.sort(function (a, b) {
    if (endPositionNames.includes(a.value.name) && endPositionNames.includes(b.value.name)) {
      return endPositionNames.indexOf(a.value.name) - endPositionNames.indexOf(b.value.name);
    }

    if (endPositionNames.includes(b.value.name)) {
      return -1;
    }

    if (endPositionNames.includes(a.value.name)) {
      return 1;
    }

    if (isMacro(a) && !isMacro(b)) {
      return 1;
    }

    if (isMacro(b) && !isMacro(a)) {
      return -1;
    }

    return a.content < b.content ? -1 : 1;
  });
};