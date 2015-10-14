# TouchlessMap Smartphone App

Experimental smartphone app for touchless map control employing smartphone's accelerometer.
Use case: move and zoom map on your smartphone while wearing gloves.

## How to Install

Install it on Your Android device from Google Play Store.

## How to use it

When smartphone is in vertical (upright) position, touchless mode is disabled.
Touchless mode is enabled when smartphone is in horizontal position.

### Move Map

Tilt your smartphone to move map in X and Y axis.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/move.gif"></img>

### Zoom In

Move the smartphone towards you and return back to starting position.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoom-in.gif"></img>

### Zoom Out

Move the smartphone away from you and return back to starting position.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoom-out.gif"></img>

### Return to Your Current Location and Reset Zoom

Shake your smartphone.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/shake.gif"></img>

## Troubleshooting

The app is experimental and I tested it only my android smartphone, but feel free to point out on bugs via new [Issue](https://github.com/petervojtek/touchless-map/issues).

If the map is visible but not moving when smartphone is tilted, restart the app (stop app in Android app manager and start it again).

## How to Modify the Application and Contribute

The smartphone app is written is [Ionic framework](ionicframework.com) and can be compiled to run on many smartphone plaforms (iOS, MS, ..). I had the opportunity to test it only on Android, you are welcome to build it and try it on another platform.

You will need to install  following [cordova](https://cordova.apache.org/) plugins into your ionic project:
* cordova-plugin-device-motion
* cordova-plugin-shake
* cordova-plugin-geolocation
* https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git

Feel free to propose new features or adjustments to the existing user interface via [Issues](https://github.com/petervojtek/touchless-map/issues).

## License

MIT



