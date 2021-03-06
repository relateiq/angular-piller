var moduleName = 'PillerCtrl';

module.exports = moduleName;

angular.module(moduleName, [
  require('./PillerSrvc')
])

.controller(moduleName, function($scope, PillerSrvc) {
  var PillerCtrl = this;

  PillerCtrl.init = init;
  PillerCtrl.initTextarea = initTextarea;


  function init(container, ngModel, initialModelValue) {
    PillerCtrl.ngModel = ngModel || PillerCtrl.ngModel;
    PillerCtrl.initialModelValue = initialModelValue || PillerCtrl.initialModelValue;

    if (!PillerCtrl.ngModel) {
      throw new Error('angular-piller: ng-model is required from <piller/> or [piller-textarea]');
    }

    initOptions();

    PillerCtrl.pillerInstance = PillerSrvc.create(PillerCtrl.initialModelValue, container, function() {
      return PillerCtrl.pillCorpus || [];
    }, PillerCtrl.pillerOptions, PillerCtrl.textarea);

    PillerCtrl.ngModel.$render = render;
    PillerCtrl.ngModel.$parsers.push(parser);
    PillerCtrl.ngModel.$formatters.push(formatter);

    // this is unfortunate but necessary because ngModel parsers can not be setup until the pillerInstance is declared
    PillerCtrl.ngModel.$$parseAndValidate();

    PillerCtrl.initialModelValue = null; // don't leak memory

    watchOptions();
  }

  function initTextarea(textarea, ngModel, initialModelValue) {
    PillerCtrl.ngModel = ngModel;
    PillerCtrl.textarea = textarea;
    PillerCtrl.initialModelValue = initialModelValue;
  }

  function initOptions() {
    PillerCtrl.pillerOptions = PillerCtrl.pillerOptions || {};
    PillerCtrl.pillerOptions.onModelChange = onPillerModelChange;
    PillerCtrl.pillerOptions.showSearchMatches = function(matches) {
      PillerCtrl.showSearchMatches({
        pillerInstance: PillerCtrl.pillerInstance,
        matches: matches
      });
    };
  }

  function watchOptions() {
    $scope.$watchCollection('PillerCtrl.pillerOptions', function(newValue, oldValue) {
      if (
        (newValue && !oldValue) ||
        (newValue && oldValue && newValue.storageKey !== oldValue.storageKey)
      ) {
        PillerCtrl.pillerInstance.reset();
      }
    });
  }

  function render() {
    if (PillerCtrl.ngModel.$modelValue && !PillerCtrl.ngModel.$modelValue._isPillerModelValue) {
      PillerCtrl.ngModel.$modelValue = PillerCtrl.pillerInstance.createModelValue(
        PillerCtrl.ngModel.$modelValue.text,
        PillerCtrl.ngModel.$modelValue.pills
      );
    }

    PillerCtrl.pillerInstance.modelValue = PillerCtrl.ngModel.$modelValue;
  }

  function parser() {
    return PillerCtrl.pillerInstance.modelValue;
  }

  function formatter(modelValue) {
    return modelValue && modelValue.text || '';
  }

  function onPillerModelChange(modelValue) {
    PillerCtrl.ngModel.$setViewValue(modelValue && modelValue.text || '');
  }
});