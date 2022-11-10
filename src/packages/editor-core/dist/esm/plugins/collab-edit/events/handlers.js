import { handleInit, handleConnection, handlePresence, handleTelePointer, applyRemoteData } from '../actions';
import { addSynchronyEntityAnalytics, addSynchronyErrorAnalytics } from '../analytics';

var effect = function effect(fn, eq) {
  var previousDeps;
  var cleanup;
  return function () {
    for (var _len = arguments.length, currentDeps = new Array(_len), _key = 0; _key < _len; _key++) {
      currentDeps[_key] = arguments[_key];
    }

    if (cleanup && eq(previousDeps, currentDeps)) {
      return cleanup;
    }

    cleanup = fn.apply(void 0, currentDeps);
    previousDeps = currentDeps;
    return cleanup;
  };
};

export var subscribe = effect(function (view, provider, options, _providerFactory) {
  var entityRef;
  var entityHandlers = {
    disconnectedHandler: function disconnectedHandler() {
      addSynchronyEntityAnalytics(view.state, view.state.tr)('disconnected');
    },
    errorHandler: function errorHandler() {
      addSynchronyEntityAnalytics(view.state, view.state.tr)('error');
    }
  };

  var unsubscribeSynchronyEntity = function unsubscribeSynchronyEntity() {
    if (entityRef) {
      entityRef.off('disconnected', entityHandlers.disconnectedHandler);
      entityRef.off('error', entityHandlers.errorHandler);
    }
  };

  var handlers = {
    initHandler: function initHandler(data) {
      view.dispatch(view.state.tr.setMeta('collabInitialised', true));
      handleInit(data, view, options);
    },
    connectedHandler: function connectedHandler(data) {
      return handleConnection(data, view);
    },
    dataHandler: function dataHandler(data) {
      return applyRemoteData(data, view, options);
    },
    presenceHandler: function presenceHandler(data) {
      return handlePresence(data, view);
    },
    telepointerHandler: function telepointerHandler(data) {
      return handleTelePointer(data, view);
    },
    localStepsHandler: function localStepsHandler(data) {
      var steps = data.steps;
      var state = view.state;
      var tr = state.tr;
      steps.forEach(function (step) {
        return tr.step(step);
      });
      view.dispatch(tr);
    },
    errorHandler: function errorHandler(error) {
      addSynchronyErrorAnalytics(view.state, view.state.tr)(error);
    },
    entityHandler: function entityHandler(_ref) {
      var entity = _ref.entity;
      unsubscribeSynchronyEntity();

      if (options.EXPERIMENTAL_allowInternalErrorAnalytics) {
        entity.on('disconnected', entityHandlers.disconnectedHandler);
        entity.on('error', entityHandlers.errorHandler);
        entityRef = entity;
      }
    }
  };
  provider.on('init', handlers.initHandler).on('connected', handlers.connectedHandler).on('data', handlers.dataHandler).on('presence', handlers.presenceHandler).on('telepointer', handlers.telepointerHandler).on('local-steps', handlers.localStepsHandler).on('error', handlers.errorHandler).on('entity', handlers.entityHandler);
  return function () {
    unsubscribeSynchronyEntity();
    provider.off('init', handlers.initHandler).off('connected', handlers.connectedHandler).off('data', handlers.dataHandler).off('presence', handlers.presenceHandler).off('telepointer', handlers.telepointerHandler).off('local-steps', handlers.localStepsHandler).off('error', handlers.errorHandler).off('entity', handlers.entityHandler);
  };
}, function (previousDeps, currentDeps) {
  return currentDeps && currentDeps.every(function (dep, i) {
    return dep === previousDeps[i];
  });
});