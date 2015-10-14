touchlessApp = angular.module('touchlessApp', ['ionic', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen()
    if (typeof(window.plugins) !== 'undefined' && typeof(window.plugins.insomnia) !== 'undefined') 
       window.plugins.insomnia.keepAwake() // keep display on
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('map', {
      url: "/map",
      controller: 'mapCtrl',
      templateUrl: "templates/map.html"
    })

    $urlRouterProvider.otherwise('/map');

  });