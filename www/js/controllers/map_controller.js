touchlessApp.controller('mapCtrl', ['$scope', 'leafletData', 
  function ($scope, leafletData) {  

    angular.extend($scope, {
        center: {
          lat:  48.67587,
          lng: 19.05112,
          zoom: 8
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
              type: 'xyz'
            }
          },
        }
    });

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
    inZoomPosition = function(){
      return(x > -1.0 && x < 1.0 && y > -2.5 && y < 2.5)
    }

    var lastZoomChange = 0
    var lastMoveChange = 0
    var gx = 0
    var gy = 0
    var gz = 0

    isZoomTime = function(){
      return(Date.now() - lastZoomChange > 500)
    }

    inMovePosition = function(){
      var absgx = Math.abs(gx)
      var absgy = Math.abs(gy)
      return (gz < 12.8 && gz > 6.0 && ( (absgx > 3.0 && absgx < 6.0) || (absgy > 3.0 && absgy < 6.0)  ))
    }

    isMoveTime = function(){
      return(Date.now() - lastMoveChange > 500)
    } 

    function onSuccess(a) {
      gx = a.x
      gy = a.y
      gz = a.z
      $scope.$apply(function(){
        try{
            if( inZoomPosition() && isZoomTime() ){
              if(gz > 12.8 && gy > 0){
                lastZoomChange = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomIn()
                })
                
              } else if(gz < 6.0 && gy < 0){
                lastZoomChange = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomOut()
                })             
              }

           } else if( inMovePosition() && isMoveTime() ){

              lastMoveChange = Date.now()
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

    function onError(e) {
        alert('acceleration error '+e);
    };

    var options = { frequency: 50 }; 

    document.addEventListener("deviceready", function() {
      var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }, false)
  }])