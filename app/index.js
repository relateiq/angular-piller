require('angular');

angular.module('AngularPillerApp', [
  require('../src'),
  require('./SearchDisplay')
])

.controller('AppCtrl', function($scope, PillerSrvc, SearchDisplaySrvc) {
  $scope.pillerModel = null;
  $scope.pillerOptions = {
    storageKey: 'myStorageKey',
    scrollable: true
  };
  $scope.pillCorpus = createPillCorpus();

  $scope.showPillerSearchMatches = function(pillerInstance, matches) {
    SearchDisplaySrvc.showSearchMatches(pillerInstance, $scope.pillCorpus, matches);
  };

  function createPillCorpus() {
    var peoplePills = [{
      id: '1',
      text: 'John Smith'
    }, {
      id: '2',
      text: 'Jane Smith'
    }, {
      id: '3',
      text: 'John Doe'
    }, {
      id: '4',
      text: 'Jane Doe'
    }, {
      id: '5',
      text: 'Mr. Uñîcõdê Man'
    }].map(function(obj) {
      return PillerSrvc.createPill(obj.id, obj, obj.text, null, {
        prefix: '@',
        searchPrefix: '@',
        minSearchCharacters: 3,
        maxSearchWords: 3
      });
    });

    var equationPills = [{
      id: '6',
      text: 'SUM'
    }, {
      id: '7',
      text: 'AVERAGE'
    }, {
      id: '8',
      text: 'MEDIAN'
    }, {
      id: '9',
      text: 'SIN'
    }, {
      id: '10',
      text: 'COS'
    }].map(function(obj) {
      return PillerSrvc.createPill(obj.id, obj, obj.text, null, {
        searchPrefix: '=',
        minSearchCharacters: 2,
        maxSearchWords: 1,
        suffix: '(  )',
        caretPositionFromEnd: -2
      });
    });

    return peoplePills.concat(equationPills);
  }
})

;