var moduleName = 'angular-piller';

module.exports = moduleName;

angular.module(moduleName, [
  require('./PillerTextareaDrtv'),
  require('./PillerDrtv'),
  require('./PillerSrvc')
]);