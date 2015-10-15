touchlessApp = angular.module('touchlessApp', ['ionic', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen()
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