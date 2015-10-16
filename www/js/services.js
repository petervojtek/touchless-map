touchlessApp.factory('persistentAppSettings', function($window) {
  var set = function(key, value) {
      $window.localStorage && $window.localStorage.setItem(key, value);
      return this;
  }

  var get = function(key) {
      return $window.localStorage.getItem(key);
  }

  var isUnset = function(key) {
      return ($window.localStorage.getItem(key) == null);
  }

  if(isUnset('zoomSensitivity'))
    set('zoomSensitivity', 50)

  if(isUnset('moveSensitivity'))
    set('moveSensitivity', 50)

  if(isUnset('selectedMapTileIdentifier'))
    set('selectedMapTileIdentifier', 'openstreetmap')

  return {
    set: set,
    get: get,
    isUnset: isUnset
  };
});

touchlessApp.service('mapTileProvider', function() {

    this.tileList = {
        openstreetmap: {
            name: 'Classic (Mapnik)',
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        opencyclemap: {
            name: 'OpenCycleMap',
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        mapbox_outdoors: {
            name: 'Mapbox Outdoors',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia3no0m'
            }
        },
        mapbox_wheat: {
            name: 'Mapbox Wheat Paste',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                mapid: 'bufanuvols.lia35jfp'
            }
        },
        freemap_sk_hiking: {
            name: 'freemap.sk Hiking',
            url: 'http://{s}.freemap.sk/T/{z}/{x}/{y}.jpeg',
            type: 'xyz',
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, freemap.sk'
            }
        },
        freemap_sk_bicycle: {
            name: 'freemap.sk Bicycle',
            url: 'http://{s}.freemap.sk/C/{z}/{x}/{y}.jpeg',
            type: 'xyz',
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, freemap.sk'
            }
        },
        freemap_sk_ski: {
            name: 'freemap.sk Skiing',
            url: 'http://{s}.freemap.sk/K/{z}/{x}/{y}.jpeg',
            type: 'xyz',
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, freemap.sk'
            }
        }
    };
});