var moduleName = 'PillerCtrl';

module.exports = moduleName;

angular.module(moduleName, [
  require('./PillerSrvc')
])

.controller(moduleName, function($scope, PillerSrvc) {
  var PillerCtrl = this;

  PillerCtrl.init = init;


  function init(container, textarea, ngModel) {
    PillerCtrl.ngModel = ngModel;

    initOptions();

    PillerCtrl.pillerInstance = PillerSrvc.create(container, function() {
      return $scope.pillCorpus || [];
    }, $scope.pillerOptions, textarea);

    PillerCtrl.ngModel.$render = render;
    PillerCtrl.ngModel.$parsers.push(parser);

    watchOptions();
  }

  function initOptions() {
    $scope.pillerOptions = $scope.pillerOptions || {};
    $scope.pillerOptions.onModelChange = onPillerModelChange;
  }

  function watchOptions() {
    $scope.$watchCollection('pillerOptions', function(newValue, oldValue) {
      if (
        (newValue && !oldValue) ||
        (newValue && oldValue && newValue.storageKey !== oldValue.storageKey)
      ) {
        PillerCtrl.pillerInstance.reset();
      }
    });
  }

  function render() {
    PillerCtrl.pillerInstance.modelValue = PillerCtrl.ngModel.$modelValue;
  }

  function parser() {
    return PillerCtrl.pillerInstance.modelValue;
  }

  function onPillerModelChange(modelValue) {
    PillerCtrl.ngModel.$setViewValue(modelValue && modelValue.text || '');
  }
});