var PillerCtrl = require('./PillerCtrl');

var moduleName = 'PillerDrtv';

module.exports = moduleName;

angular.module(moduleName, [
  PillerCtrl
])

.directive('piller', function() {
  return {
    restrict: 'E',
    scope: {
      pillCorpus: '=',
      pillerOptions: '='
    },
    require: ['piller', 'ngModel'],
    controller: PillerCtrl,
    controllerAs: PillerCtrl,
    link: function($scope, $elem, attrs, ctrls) {
      var PillerCtrl = ctrls[0];
      var elem = $elem[0];
      var pillerTextarea = elem.querySelector('[piller-textarea]');

      PillerCtrl.init(elem, pillerTextarea, ctrls[1]);
    }
  };
});