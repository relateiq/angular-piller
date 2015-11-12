var moduleName = 'PillerSrvc';

module.exports = moduleName;

angular.module(moduleName, [])

.factory(moduleName, function() {
  return require('piller');
});