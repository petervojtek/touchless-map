touchlessApp.controller('settingsCtrl', ['$scope', 'persistentAppSettings', 'mapTileProvider', '$location',
  function ($scope, persistentAppSettings, mapTileProvider, $location) {  
    $scope.goBackToMap = function(){
      $location.path('map')
    }

    $scope.sensitivity = {
       value: persistentAppSettings.get('sensitivity'),
       min: 0,
       max: 100
     };

    $scope.onSensitivityChange = function(){
    	persistentAppSettings.set('sensitivity', $scope.sensitivity.value) 
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