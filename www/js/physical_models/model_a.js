touchlessApp.service('physicalModelA', function() {

  this.onAccelerationUpdated = function(acceleration, ms, zs) {
    gx = acceleration.x
    gy = acceleration.y
    gz = acceleration.z
    gzHistory.push(gz)
    gzHistory.shift()
    moveSensitivity = ms
    zoomSensitivity = zs
  }

  this.shouldZoomIn = function(){
    if (inZoomPosition() && isZoomTime() && inZoomInAcceleration() ) {
      lastZoomedInAt = Date.now();
      return(true);
    } else
    return(false)
  }

  this.shouldZoomOut = function(){
    if (inZoomPosition() && isZoomTime() && inZoomOutAcceleration() ) {
      lastZoomedOutAt = Date.now();
      return(true);
    }else
    return(false)
  }

  this.shouldMoveByOffset = function(){
    if (inMovePosition() && isMoveTime()) {
      lastMovedAt = Date.now()
      var xOffset = (-35 * moveSensitivity + 5) * gx
      var yOffset = (35 * moveSensitivity + 5) * gy
      return([xOffset, yOffset])
    } else
    return([0,0])
  }

  /////////////////////////////////////////////////////

  var lastZoomedInAt = 0
  var lastZoomedOutAt = 0
  var lastMovedAt = 0
  var lastShakedAt = 0
  var gx = 0
  var gy = 0
  var gz = 0
  var moveSensitivity, zoomSensitivity
  var gzHistory = [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8]

  var avg = function(arr) {
    var sum = arr.reduce(function(a, b) {
      return a + b;
    });
    return (sum / arr.length)
  }

  inZoomPosition = function() {
    var notUsingMoveX = gx > -1.0 && gx < 1.0
    var notUsingMoveY = gy > -2.5 && gy < 2.5
    var notReturningFromVerticalPosition = avg(gzHistory) > 7
    return (notUsingMoveX && notUsingMoveY && notReturningFromVerticalPosition)
  }

  inZoomInAcceleration = function() {
    var movingUpFirst = avg(gzHistory.slice(0, 11)) > (11.5 - zoomSensitivity * 2)
    var movingDownLater = avg(gzHistory.slice(11, 20)) < (7.5 + zoomSensitivity * 2)
    return (movingUpFirst && movingDownLater)
  }

  inZoomOutAcceleration = function() {
    var movingDownFirst = avg(gzHistory.slice(0, 11)) < (7.5 + zoomSensitivity * 2)
    var movingUpLater = avg(gzHistory.slice(11, 20)) > (11.5 - zoomSensitivity * 2)
    return (movingDownFirst && movingUpLater)
  }

  isZoomTime = function() {
    var now = Date.now()
    var z1 = (now - lastZoomedOutAt > 600) && (now - lastZoomedInAt > 2000)
    var z2 = (now - lastZoomedInAt > 600) && (now - lastZoomedOutAt > 2000)
    var m = now - lastMovedAt > 700
    var s = now - lastShakedAt > 1000

    return ((z1 || z2) && m && s)
  }

  inMovePosition = function() {
    var absgx = Math.abs(gx)
    var absgy = Math.abs(gy)
    return (gz < 12.8 && gz > 6.0 && ((absgx > 3.0 && absgx < 6.0) || (absgy > 3.0 && absgy < 6.0)))
  }

  isMoveTime = function() {
    var now = Date.now()
    return ((now - lastMovedAt > 300) && (now - lastZoomedInAt > 700) && (now - lastZoomedOutAt > 700) && (now - lastShakedAt > 1000))
  }

})
