touchlessApp.controller('mapCtrl', ['$scope', 'leafletData', 
  function ($scope, leafletData) {  

    angular.extend($scope, {
        center: {
          lat:  48.67587,
          lng: 19.05112,
          zoom: 12
        },
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              type: 'xyz',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            freemapHiking: {
              name: 'freemap.sk (Hiking)',
              url: 'http://{s}.freemap.sk/T/{z}/{x}/{y}.jpeg',
              type: 'xyz',
              maxZoom: 16 // fixme: ignored by leaflet
            }
          },
        }
    });

    leafletData.getMap().then(function(map) {
      map.attributionControl.addAttribution("(c) openstreetmap.org contributors");
    });

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
    var gx = 0
    var gy = 0
    var gz = 0

    var gzHistory = [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8]

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
      var movingUpFirst = avg(gzHistory.slice(0,11)) > 10.5
      var movingDownLater = avg(gzHistory.slice(11,20)) < 8.5
      return(movingUpFirst && movingDownLater)
    }

    inZoomOutAcceleration = function(){
      var movingDownFirst = avg(gzHistory.slice(0,11)) < 8.5
      var movingUpLater = avg(gzHistory.slice(11,20)) > 10.5
      return(movingDownFirst && movingUpLater)
    }

    isZoomTime = function(){
      var now = Date.now()
      var z1 = (now - lastZoomedOutAt > 600) && (now - lastZoomedInAt > 2000)
      var z2 = (now - lastZoomedInAt > 600) && (now - lastZoomedOutAt > 2000)
      var m = now - lastMovedAt > 700

      return((z1 || z2) && m)
    }

    inMovePosition = function(){
      var absgx = Math.abs(gx)
      var absgy = Math.abs(gy)
      return (gz < 12.8 && gz > 6.0 && ( (absgx > 3.0 && absgx < 6.0) || (absgy > 3.0 && absgy < 6.0)  ))
    }

    isMoveTime = function(){
      var now = Date.now()
      return((now - lastMovedAt > 300) && (now - lastZoomedInAt > 700) && (now - lastZoomedOutAt > 700))
    } 
    function onAccelerationUpdated(acceleration) {

      gx = acceleration.x
      gy = acceleration.y
      gz = acceleration.z
      gzHistory.push(gz)
      gzHistory.shift()

      $scope.$apply(function(){
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
                    var xOffset = -20 * gx
                    var yOffset = 20 * gy

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