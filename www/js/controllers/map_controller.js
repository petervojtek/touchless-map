touchlessApp.controller('mapCtrl', ['$scope', 'leafletData', 'persistentAppSettings', '$location', 'mapTileProvider', 'physicalModelA',
  function($scope, leafletData, persistentAppSettings, $location, mapTileProvider, physicalModelA) {

    angular.extend($scope, {
      center: {
        lat: 48.67587,
        lng: 19.05112,
        zoom: 12
      },

      tiles: mapTileProvider.tileList[persistentAppSettings.get('selectedMapTileIdentifier')]
    });

    leafletData.getMap().then(function(map) {
      L.easyButton('ion-settings', function(btn, map) {
        $location.path('settings')
      }).addTo(map);
    });

    // this view is cached and following callback allows us to expire variables after being edited in settings
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if ($location.path() == "/map") {
        $scope.tiles = mapTileProvider.tileList[persistentAppSettings.get('selectedMapTileIdentifier')]
        zoomSensitivity = parseInt(persistentAppSettings.get('zoomSensitivity')) / 100.0 // 0.0 = min, 1.0 = max
        moveSensitivity = parseInt(persistentAppSettings.get('moveSensitivity')) / 100.0
      }
    })

    //////  set your position marker and center map to it on application start

    var marker = null
    var onPositionUpdated = function(position) {
      if (marker == null) {
        marker = L.circleMarker([position.coords.latitude, position.coords.longitude]);
        leafletData.getMap().then(function(map) {
          marker.addTo(map)
          map.setView(marker.getLatLng())
        });
      }

      marker.setLatLng([position.coords.latitude, position.coords.longitude])
    }

    var onPositionGatheringFailed = function(error) {
      console.log('watchPosition error: ' + error)
    }

    var geoOptions = {
      enableHighAccuracy: true,
      timeout: 2000
    };

    var watchPositionID = navigator.geolocation.watchPosition(onPositionUpdated, onPositionGatheringFailed, geoOptions)

    $scope.$on('$destroy', function() {
      navigator.geolocation.clearWatch(watchPositionID)
    });


    //////////////// touchless navigation  //////////////////////////////////////

    var zoomSensitivity, moveSensitivity // updated via stateChangeSuccess callback to assure their proper value when edited in settingss

    var physicalModel = physicalModelA // more to come..

    function onAccelerationUpdated(acceleration) {
      physicalModel.onAccelerationUpdated(acceleration, zoomSensitivity, moveSensitivity)

      $scope.$apply(function() {
        if (physicalModel.shouldZoomIn()) {
          leafletData.getMap().then(function(map) {
            map.zoomIn()
          })
        } else if (physicalModel.shouldZoomOut()) {
          leafletData.getMap().then(function(map) {
            map.zoomOut()
          })
        } else {
          var offset = physicalModel.shouldMoveByOffset()
          var xOffset = offset[0]
          var yOffset = offset[1]
          if (xOffset != 0 || yOffset != 0) {
            leafletData.getMap().then(function(map) {
              map.panBy(new L.Point(xOffset, yOffset), {
                animate: true
              })
            })
          }
        }

      })

    };

    function onAccelerationError(e) {
      alert('acceleration error ' + e);
    };

    ///////////////////////

    var onShake = function() {
      lastShakedAt = Date.now()
      leafletData.getMap().then(function(map) {
        map.setView(marker.getLatLng())
        map.setZoom(12)
      });
    };

    //////////////////////////

    document.addEventListener("deviceready", function() {
      try {
        navigator.accelerometer.watchAcceleration(onAccelerationUpdated, onAccelerationError, {
          frequency: 60
        });
        shake.startWatch(onShake, 40); // https://github.com/leecrossley/cordova-plugin-shake
      } catch (e) {
        alert(e)
      }
    }, false)
  }
])
