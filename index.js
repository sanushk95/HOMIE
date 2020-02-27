let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

http.listen(3000,function(){
    console.log(`server is running at:http://localhost:3000`);
})
let five = require('johnny-five');
let arduino =new five.Board();
arduino.on("ready", function() {
    // Create a new `motion` hardware instance.
    var motion = new five.Motion(2);
    // "calibrated" occurs once, at the beginning of a session,
    motion.on("calibrated", function() {
      console.log("calibrated");
    });
    // "motionstart" events are fired when the "calibrated"
    // proximal area is disrupted, generally by some form of movement
    motion.on("motionstart", function() {
      console.log("motionstart");
    });
    // "motionend" events are fired following a "motionstart" event
    // when no movement has occurred in X ms
    motion.on("motionend", function() {
      console.log("motionend");
    });
    // "data" events are fired at the interval set in opts.freq
    // or every 25ms. Uncomment the following to see all
    // motion detection readings.
    motion.on("data", function(data) {
      console.log(data);
    });
  });
