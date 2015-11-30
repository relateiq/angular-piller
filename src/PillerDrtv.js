var PillerCtrl = require('./PillerCtrl');

var moduleName = 'PillerDrtv';

module.exports = moduleName;

angular.module(moduleName, [
  PillerCtrl
])

.directive('piller', function() {
  return {
    restrict: 'E',
    scope: true,
    bindToController: {
      pillCorpus: '=',
      pillerOptions: '=',
      showSearchMatches: '&'
    },
    require: ['piller', '?ngModel'],
    controller: PillerCtrl,
    controllerAs: PillerCtrl,
    link: function($scope, $elem, attrs, ctrls) {
      ctrls[0].init($elem[0], ctrls[1], $scope.$eval(attrs.ngModel));
    }
  };
});