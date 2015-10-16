touchlessApp.factory('persistentAppSettings', function($window) {
  var set = function(key, value) {
      $window.localStorage && $window.localStorage.setItem(key, value);
      return this;
  }

  var get = function(key) {
      return $window.localStorage.getItem(key);
  }

  var isUnset = function(key) {
      return ($window.localStorage.getItem(key) == null);
  }

  if(isUnset('sensitivity'))
    set('sensitivity', 50)

  return {
    set: set,
    get: get,
    isUnset: isUnset
  };
});
