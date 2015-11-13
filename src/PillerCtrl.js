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
        PillerCtrl.ngModel = PillerCtrl.ngModel || ngModel;

        if (!PillerCtrl.ngModel) {
            throw new Error('angular-piller: ng-model is required from <piller/> or [piller-textarea]');
        }

        initOptions();

        PillerCtrl.pillerInstance = PillerSrvc.create(container, function() {
            return $scope.pillCorpus || [];
        }, $scope.pillerOptions, PillerCtrl.textarea);

        PillerCtrl.ngModel.$render = render;
        PillerCtrl.ngModel.$parsers.push(parser);

        watchOptions();
    }

    function initTextarea(textarea, ngModel) {
        PillerCtrl.ngModel = ngModel;
        PillerCtrl.textarea = textarea;
    }

    function initOptions() {
        $scope.pillerOptions = $scope.pillerOptions || {};
        $scope.pillerOptions.onModelChange = onPillerModelChange;
        $scope.pillerOptions.showSearchMatches = function(matches) {
            $scope.showSearchMatches({
                pillerInstance: PillerCtrl.pillerInstance,
                matches: matches
            });
        };
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

    function onPillerModelChange(modelValue) {
        PillerCtrl.ngModel.$setViewValue(modelValue && modelValue.text || '');
    }
});