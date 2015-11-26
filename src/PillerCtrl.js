var moduleName = 'PillerCtrl';

module.exports = moduleName;

angular.module(moduleName, [
  require('./PillerSrvc')
])

.controller(moduleName, function($scope, PillerSrvc) {
  var PillerCtrl = this;

  PillerCtrl.init = init;
  PillerCtrl.initTextarea = initTextarea;


  function init(container, ngModel) {
    PillerCtrl.ngModel = ngModel || PillerCtrl.ngModel;

    if (!PillerCtrl.ngModel) {
      throw new Error('angular-piller: ng-model is required from <piller/> or [piller-textarea]');
    }

    initOptions();

    PillerCtrl.pillerInstance = PillerSrvc.create(container, function() {
      return PillerCtrl.pillCorpus || [];
    }, PillerCtrl.pillerOptions, PillerCtrl.textarea);

    PillerCtrl.ngModel.$render = render;
    PillerCtrl.ngModel.$parsers.push(parser);
    PillerCtrl.ngModel.$formatters.unshift(formatter);

    watchOptions();
  }

  function initTextarea(textarea, ngModel) {
    PillerCtrl.ngModel = ngModel;
    PillerCtrl.textarea = textarea;
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

  function formatter() {
    return PillerCtrl.pillerInstance.modelValue && PillerCtrl.pillerInstance.modelValue.text || '';
  }

  function onPillerModelChange(modelValue) {
    PillerCtrl.ngModel.$setViewValue(modelValue && modelValue.text || '');
  }
});