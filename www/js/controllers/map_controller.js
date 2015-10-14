touchlessApp.controller('mapCtrl', ['$scope', 'leafletData', 
  function ($scope, leafletData) {  

    angular.extend($scope, {
        attribution: 'skap',
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

    var lastZoomInChange = 0
    var lastZoomOutChange = 0
    var lastMoveChange = 0
    var gx = 0
    var gy = 0
    var gz = 0

    var gzHistory = [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8]

    var avg = function(arr){
      var sum = arr.reduce(function(a, b) { return a + b; });
      return(sum / arr.length)
    }

    inZoomPosition = function(){
      return(gx > -1.0 && gx < 1.0 && gy > -2.5 && gy < 2.5 && avg(gzHistory) > 7)
    }

    inZoomInAcceleration = function(){
      return(avg(gzHistory.slice(0,11)) > 10.5 && avg(gzHistory.slice(11,20)) < 8.5)
    }

    inZoomOutAcceleration = function(){
      return(avg(gzHistory.slice(0,11)) < 8.5 && avg(gzHistory.slice(11,20)) > 10.5)
    }

    isZoomTime = function(){
      var now = Date.now()
      var z1 = (now - lastZoomOutChange > 600) && (now - lastZoomInChange > 2000)
      var z2 = (now - lastZoomInChange > 600) && (now - lastZoomOutChange > 2000)
      var m = now - lastMoveChange > 700

      return((z1 || z2) && m)
    }

    inMovePosition = function(){
      var absgx = Math.abs(gx)
      var absgy = Math.abs(gy)
      return (gz < 12.8 && gz > 6.0 && ( (absgx > 3.0 && absgx < 6.0) || (absgy > 3.0 && absgy < 6.0)  ))
    }

    isMoveTime = function(){
      var now = Date.now()
      return((now - lastMoveChange > 300) && (now - lastZoomInChange > 700) && (now - lastZoomOutChange > 700))
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
                lastZoomInChange = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomIn()
                })
                
              } else if(inZoomOutAcceleration() ){
                lastZoomOutChange = Date.now()
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

    function onAccelerationError(e) {
        alert('acceleration error '+e);
    };

    var options = { frequency: 60 }; 

    document.addEventListener("deviceready", function() {
      var watchID = navigator.accelerometer.watchAcceleration(onAccelerationUpdated, onAccelerationError, options);
    }, false)
  }])