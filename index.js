let firebaseUtil = require("./firebaseUtil");
let firebaseDbAdapter = require('./utils/firebaseDbAdapter');
let emulator = require('./utils/emulator');

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let createError = require('http-errors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

var admin = require("firebase-admin");

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa6fda777a50942d69faaa5f36528630d';
const authToken = 'be6f6f239bc9df2e7d4b4690e51cdcb5';
const client = require('twilio')(accountSid, authToken);

//Importing routes for news.
let newsRoutes = require("./routes/get_news");
let indexRoutes = require("./routes/index");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let isSent = false;
function sendsms(message) {
  client.messages
  .create({
     body: message,
     from: '+13069947863',
     to: '+15196366439'
   })
  .then(message => console.log(message.sid));
}

//var serviceAccount = require("./firebase-key.json");
let serviceAccount = firebaseUtil.getServiceAccount(); //Using encode object instead

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ims-hms.firebaseio.com"
  });
  const db = admin.firestore();
  firebaseDbAdapter.setDb(db);

  //Note: Writes to firebase cloud storage is disable in development
  //      to conserve usage
  firebaseDbAdapter.disableWrites();

  //firebaseDbAdapter.read(db, 'light', callback);
} catch (e) {
  console.log(e);
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Configuring routes to the server.
app.use('/', indexRoutes);
app.use('/news', newsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function () {
  console.log(`server is running at:http://localhost:3000`);
})
let five = require('johnny-five');
let arduino = new five.Board();

arduino.on("ready", function () {
  var multi = new five.Multi({
    controller: "HTU21D",
    freq: 1000
  });
  photoresistor = new five.Sensor({
    pin: "A2",
    freq: 1000,
    threshold: 50
  });
  arduino.repl.inject({
    pot: photoresistor
  });
  photoresistor.on("data", function () {
    setInterval(() => {
      io.sockets.emit('lightsensor', this.value);
      firebaseDbAdapter.write('light', this.value);
    }, 2000);
    //console.log(this.value);
  });

  multi.on("change", function () {

    setInterval(() => {
      io.sockets.emit('temp', this.thermometer.celsius)
      firebaseDbAdapter.write('temperature', this.thermometer.celsius);

      if(!isSent){
        if(this.thermometer.celsius<15) {
          sendsms("The Temperature Level has dropped, please adjust accordingly. Thank you!!!");
          isSent=true;
        }
        else if(this.thermometer.celsius>28) {
          sendsms("The Temperature Level has increased, please adjust accordingly. Thank you!!!");
          isSent=true;
        }
      }
    }, 2000);
    setInterval(() => {
      io.sockets.emit('humidity', this.hygrometer.relativeHumidity);
      firebaseDbAdapter.write('humidity', this.hygrometer.relativeHumidity);
    }, 2000);

  });
});

arduino.on("ready", function () {
  // Create a new `motion` hardware instance.
  var motion = new five.Motion(2);
  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function () {
    console.log("calibrated");
  });

  motion.on("motionstart", function () {
    console.log("motionstart");
  });


  motion.on("motionend", function () {
    console.log("motionend");
  });

  motion.on("data", function (data) {
    io.sockets.emit('motionElement', this.detectedMotion);
    if (this.detectedMotion) {
      firebaseDbAdapter.write('motion', 'Motion was detected');
    }
  });
});

//Note: These emulators are only enabled for development
//      when the real arduino board is not available
//      Please disable in production mode
emulator.EmulatorAdaptor.disable();
emulator.EmulatorAdaptor.addSensor({
  name: "temperature",
  interval: 3000,
  range: [10, 40],
  onchange: function (sender) {
    var value = sender.value;
    io.sockets.emit('temp', value);
    //firebaseDbAdapter.write('temperature', value);
    console.log( 'temperature ' + new Date().toISOString());
  }
});
emulator.EmulatorAdaptor.addSensor({
  name: "light",
  interval: 3000,
  range: [100, 1023],
  onchange: function (sender) {
    var value = sender.value;
    io.sockets.emit('lightsensor', value);
    //firebaseDbAdapter.write('light', value);
    console.log('motion ' + new Date().toISOString());
  }
});

emulator.EmulatorAdaptor.addSensor({
  name: "humidity",
  interval: 3000,
  range: [10, 40],
  onchange: function (sender) {
    var value = sender.value;
    io.sockets.emit('humidity', value);
    //firebaseDbAdapter.write('humidity', value);
    console.log('temperature ' + new Date().toISOString());
  }
});

emulator.EmulatorAdaptor.addSensor({
  name: "motion",
  interval: 2000,
  range: [0, 1],
  onchange: function (sender) {
    var value = !!sender.value;
    io.sockets.emit('motionElement', value);
    if (value) {
      //firebaseDbAdapter.write('motion', 'Motion was detected');
    }
    console.log('motion ' + new Date().toISOString());
  }
});


