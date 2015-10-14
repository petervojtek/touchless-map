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

    inZoomPosition = function(){
      return(x > -1.0 && x < 1.0 && y > -2.5 && y < 2.5)
    }

    var lastZoomChange = 0
    var lastMoveChange = 0
    var x = 0
    var y = 0
    var z = 0

    isZoomTime = function(){
      return(Date.now() - lastZoomChange > 500)
    }

    inMovePosition = function(){
      var absX = Math.abs(x)
      var absY = Math.abs(y)
      return (z < 12.8 && z > 6.0 && ( (absX > 3.0 && absX < 5.0) || (absY > 3.0 && absY < 5.0)  ))
    }

    isMoveTime = function(){
      return(Date.now() - lastMoveChange > 500)
    } 

    function onSuccess(a) {
      x = a.x
      y = a.y
      z = a.z
      $scope.$apply(function(){
        try{
            if( inZoomPosition() && isZoomTime() ){
              if(z > 12.8 && y > 0){
                lastZoomChange = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomIn()
                })
                
              } else if(z < 6.0 && y < 0){
                lastZoomChange = Date.now()
                leafletData.getMap().then(function(map) {
                  map.zoomOut()
                })             
              }

           } else if( inMovePosition() && isMoveTime() ){

              lastMoveChange = Date.now()
              leafletData.getMap().then(function(map) {
                  try{
                    var xOffset = -20 * x
                    var yOffset = 20 * y

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