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
  var multi = new five.Multi({
    controller: "HTU21D",
    freq: 500
  });
  photoresistor = new five.Sensor({
    pin: "A2",
    freq: 700,
    threshold: 50
  });
  arduino.repl.inject({
  pot: photoresistor
});
photoresistor.on("data", function() {
  setInterval(() => {
    io.sockets.emit('lightsensor', this.value);
  }, 100);
  //console.log(this.value);
});

  multi.on("change", function() {
    
    setInterval(() => { 
      io.sockets.emit('temp', this.thermometer.celsius)}, 100);
    setInterval(() => { 
      io.sockets.emit('humidity', this.hygrometer.relativeHumidity)
    }, 100);
   
  });
});

arduino.on("ready", function() {
    // Create a new `motion` hardware instance.
    var motion = new five.Motion(2);
    // "calibrated" occurs once, at the beginning of a session,
    motion.on("calibrated", function() {
      console.log("calibrated");
    });
    
    
    motion.on("motionstart", function() {
      console.log("motionstart");
    });
    
    
    motion.on("motionend", function() {
      console.log("motionend");
    });
    
    motion.on("data",function(data){
      
        io.sockets.emit('motionElement',this.detectedMotion);
     
      
      
    });
  });

  
