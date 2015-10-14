streetlightApp.factory('persistentAppSettings', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage && $window.localStorage.setItem(key, value);
      return this;
    },
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    getBoolean: function(key) {
      return ($window.localStorage.getItem(key) == 'true');
    },
    isUnset: function(key) {
      return ($window.localStorage.getItem(key) == null);
    }
  };
});