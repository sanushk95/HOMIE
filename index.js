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
let temperature;
let light_pin_led;
io.on('connection',function(){
    light_pin_led.on('light_status',function(){
        light_pin_led.toggle();
    })
    //console.log("socket connected")
})
arduino.on('ready',function(){
    console.log("arduino is running");
    temperature = new five.Thermometer({
        controller: 'LM35',
        pin:'A0',
        freq:1000
    });
    light_pin_led = new five.Led(13);
    light_pin_led.off();
    temperature.on('data',function(){
        io.sockets.emit('temperature',this.celsius);
    })
})