# TouchlessMap Smartphone App

Experimental smartphone app for touchless map control employing smartphone's accelerometer.
Use case: move and zoom map on your smartphone while wearing gloves.

<a href="https://play.google.com/store/apps/details?id=com.ionicframework.myapp418130">
  <img alt="Get it on Google Play"
       src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png" />
</a>

## Usage

* Touchless mode is disabled when smartphone is in vertical (upright) position
* Touchless mode is enabled when smartphone is in horizontal position
* Application will automatically lock screen orientation into portrait mode

### Move Map

Tilt your smartphone to move map in X and Y axis.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/move.gif"></img>

### Zoom In

Move the smartphone towards yourself and back to zoom in one level.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoom-in.gif"></img>

### Zoom Out

Move the smartphone away from you (towards ground) and back to starting position to zoom out.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoom-out.gif"></img>

### Return to Your Current Location and Reset Zoom

Shake your smartphone to return to location provided by your phone and change zoom level to initial value.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/shake.gif"></img>

## Known Issues

If the map is visible but not moving when smartphone is tilted, restart the app (stop app in Android app manager and start it again).

## How to Modify the Application and Contribute

Feel free to suggest bugs, new features or adjustments to the existing user interface via [Issues](https://github.com/petervojtek/touchless-map/issues).

The smartphone app is written in [Ionic framework](ionicframework.com) in HTML and JS and can be compiled to run on many smartphone plaforms (iOS, MS, ..). I had the opportunity to test it only on Android, you are welcome to build it and try it on another platform.

You will need to install  following [cordova](https://cordova.apache.org/) plugins into your ionic project:
* cordova-plugin-device-motion
* cordova-plugin-shake
* cordova-plugin-geolocation
* cordova-plugin-screen-orientation

If you have some code adjustments to share, use pull request.

## Credits

* [Šaňo](https://www.openstreetmap.org/user/laznik/)
* Icons in logo provided by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>

## License

MIT

