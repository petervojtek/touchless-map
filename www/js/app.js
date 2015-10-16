touchlessApp = angular.module('touchlessApp', ['ionic', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen()
    if(screen && screen.lockOrientation)
      screen.lockOrientation('portrait-primary')
  });

})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('map', {
      url: "/map",
      controller: 'mapCtrl',
      templateUrl: "templates/map.html",
      cache: false
    })

    .state('settings', {
      url: "/settings",
      controller: 'settingsCtrl',
      templateUrl: "templates/settings.html"
    })

    $urlRouterProvider.otherwise('/map');

  });