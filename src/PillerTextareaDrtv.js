var moduleName = 'PillerTextareaDrtv';

module.exports = moduleName;

angular.module(moduleName, [])

.directive('pillerTextarea', function() {
  return {
    restrict: 'A',
    require: ['^piller', '?ngModel'],
    link: function($scope, $elem, attrs, ctrls) {
      ctrls[0].initTextarea($elem[0], ctrls[1], $scope.$eval(attrs.ngModel));
    }
  };
});