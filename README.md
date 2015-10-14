# TouchlessMap Smartphone App

Experimental smartphone app for touchless map control employing smartphone's accelerometer.
Use case: move and zoom map on your smartphone while wearing gloves.

## How to Install

Get it from Google Play Store.

## How to use it

When smartphone is in vertical (upright) position, touchless mode is disabled.
Touchless mode is enabled when smartphone is in horizontal position.

### Move Map

Tilt your smartphone to move map in X and Y axis.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/move.gif"></img>

### Zoom In

Move the smartphone towards you and return back to starting position.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoomin.gif"></img>

### Zoom Out

Move the smartphone away from you and return back to starting position.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/zoomout.gif"></img>

### Return to Your Position

Shake your smartphone.

<img src="https://github.com/petervojtek/touchless-map/raw/master/videos/shake.gif"></img>

## How to Modify the Application

The smartphone app is written is [Ionic framework](ionicframework.com).
You will need to install  following [cordova](https://cordova.apache.org/) plugins into your ionic project:
* cordova-plugin-device-motion
* cordova-plugin-shake
* cordova-plugin-geolocation
* https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git


