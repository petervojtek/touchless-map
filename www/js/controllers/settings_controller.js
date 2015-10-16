touchlessApp.controller('settingsCtrl', ['$scope', 'persistentAppSettings', 'mapTileProvider', '$location',
  function ($scope, persistentAppSettings, mapTileProvider, $location) {  
    $scope.goBackToMap = function(){
      $location.path('map')
    }

    $scope.zoomSensitivity = {
       value: persistentAppSettings.get('zoomSensitivity'),
       min: 0,
       max: 100
     };

    $scope.onZoomSensitivityChange = function(){
    	persistentAppSettings.set('zoomSensitivity', $scope.zoomSensitivity.value) 
    }

    $scope.moveSensitivity = {
       value: persistentAppSettings.get('moveSensitivity'),
       min: 0,
       max: 100
     };

    $scope.onMoveSensitivityChange = function(){
      persistentAppSettings.set('moveSensitivity', $scope.moveSensitivity.value) 
    }

    $scope.mapTiles = Object.keys(mapTileProvider.tileList).map(function(tileIdentifier){
      return({name: mapTileProvider.tileList[tileIdentifier]['name'], identifier: tileIdentifier})

    })

    $scope.presetTile = {
        identifier: persistentAppSettings.get('selectedMapTileIdentifier')
    };  

    $scope.onMaptileSelected = function(selectedMapTile){
      persistentAppSettings.set('selectedMapTileIdentifier', selectedMapTile['identifier'])
    }

  }])