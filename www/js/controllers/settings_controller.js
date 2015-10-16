touchlessApp.controller('settingsCtrl', ['$scope', 'persistentAppSettings',
  function ($scope, persistentAppSettings) {  
    $scope.sensitivity = {
       value: persistentAppSettings.get('sensitivity'),
       min: 0,
       max: 100
     };

    $scope.onSensitivityChange = function(){
    	persistentAppSettings.set('sensitivity', $scope.sensitivity.value) 
    }

  }])