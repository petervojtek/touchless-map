touchlessApp.controller('mapCtrl', ['$scope', 'leafletData', 'persistentAppSettings', '$location', 'mapTileProvider',
  function ($scope, leafletData, persistentAppSettings, $location, mapTileProvider) { 

    angular.extend($scope, {
        center: {
          lat:  48.67587,
          lng: 19.05112,
          zoom: 12
        },

        tiles: mapTileProvider.tileList[persistentAppSettings.get('selectedMapTileIdentifier')]
    });

    leafletData.getMap().then(function(map) {
      L.easyButton('ion-settings', function(btn, map){
        $location.path('settings')
      }).addTo( map ); 
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
    var onPositionUpdated = function(position){
      if(marker == null){
        marker = L.circleMarker([position.coords.latitude, position.coords.longitude]);
        leafletData.getMap().then(function(map) {
          marker.addTo(map)
          map.setView(marker.getLatLng())
        });
      }

      marker.setLatLng([position.coords.latitude, position.coords.longitude])
    }

    var onPositionGatheringFailed = function(error){console.log('watchPosition error: '+error)}

    var geoOptions = {
      enableHighAccuracy: true, 
      timeout           : 2000
    };

    var watchPositionID = navigator.geolocation.watchPosition(onPositionUpdated, onPositionGatheringFailed, geoOptions)

    $scope.$on('$destroy',function(){
      navigator.geolocation.clearWatch(watchPositionID)
    });


//////////////// touchless navigation  //////////////////////////////////////

    var lastZoomedInAt = 0
    var lastZoomedOutAt = 0
    var lastMovedAt = 0
    var lastShakedAt = 0
    var gx = 0
    var gy = 0
    var gz = 0
    var zoomSensitivity, moveSensitivity // updated in stateChangeSuccess callback to be properly expired when edited in settingss

    var gzHistory = [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8]

    var avg = function(arr){
      var sum = arr.reduce(function(a, b) { return a + b; });
      return(sum / arr.length)
    }

    inZoomPosition = function(){
      var notUsingMoveX = gx > -1.0 && gx < 1.0
      var notUsingMoveY = gy > -2.5 && gy < 2.5
      var notReturningFromVerticalPosition = avg(gzHistory) > 7
      return(notUsingMoveX && notUsingMoveY && notReturningFromVerticalPosition)
    }



    inZoomInAcceleration = function(){


      return(false)
      //var movingUpFirst = avg(gzHistory.slice(0,11)) > (11.5 - zoomSensitivity*2)
      //var movingDownLater = avg(gzHistory.slice(11,20)) < (7.5 + zoomSensitivity*2)
      //return(movingUpFirst && movingDownLater)
    }

    inZoomOutAcceleration = function(){
      return(false)
    }

    isZoomTime = function(){
      var now = Date.now()
      var z1 = (now - lastZoomedOutAt > 600) && (now - lastZoomedInAt > 2000)
      var z2 = (now - lastZoomedInAt > 600) && (now - lastZoomedOutAt > 2000)
      var m = now - lastMovedAt > 700
      var s =  now - lastShakedAt > 1000

      return((z1 || z2) && m && s)
    }

    inMovePosition = function(){
      var absgx = Math.abs(gx)
      var absgy = Math.abs(gy)
      return (gz < 12.8 && gz > 6.0 && ( (absgx > 3.0 && absgx < 6.0) || (absgy > 3.0 && absgy < 6.0)  ))
    }

    isMoveTime = function(){
      var now = Date.now()
      return((now - lastMovedAt > 300) && (now - lastZoomedInAt > 700) && (now - lastZoomedOutAt > 700) && (now - lastShakedAt > 1000))
    } 

    $scope.zSpeed = 0

    function onAccelerationUpdated(acceleration) {

      gx = acceleration.x
      gy = acceleration.y
      gz = acceleration.z
      gzHistory.push(gz)
      gzHistory.shift()

      $scope.$apply(function(){

        var zs = 0
        for(i = 0; i< gzHistory.length; i++){
          zs += gzHistory[i] - 9.5
        }

        $scope.zSpeed = Math.round(zs*1000)/1000.0


        try{
            if( inZoomPosition() && isZoomTime() ){
              if(inZoomInAcceleration()){
                lastZoomedInAt = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomIn()
                })
                
              } else if(inZoomOutAcceleration() ){
                lastZoomedOutAt = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomOut()
                })             
              }

           } else if( inMovePosition() && isMoveTime() ){

              lastMovedAt = Date.now()
              leafletData.getMap().then(function(map) {
                  try{
                    var xOffset = (-35 * moveSensitivity + 5) * gx
                    var yOffset = (35 * moveSensitivity + 5) * gy

                    map.panBy(new L.Point(xOffset, yOffset), {animate: true})
                  } catch(e){alert(e)}
              })

           }
        } catch(e){alert(e)}

      })
    };

    function onAccelerationError(e) {
        alert('acceleration error '+e);
    };


///////////////////////

    var onShake = function () {
        lastShakedAt = Date.now()
        leafletData.getMap().then(function(map) {
          map.setView(marker.getLatLng())
          map.setZoom(12)
        });
    };

//////////////////////////

    document.addEventListener("deviceready", function() {
      try{
        navigator.accelerometer.watchAcceleration(onAccelerationUpdated, onAccelerationError, { frequency: 60 });
        shake.startWatch(onShake, 40); // https://github.com/leecrossley/cordova-plugin-shake
      } catch(e){alert(e)}
    }, false)
  }])