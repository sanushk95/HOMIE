var fs = require('fs');
var admin = require("firebase-admin");

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let createError = require('http-errors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//Importing routes for news.
let newsRoutes = require("./routes/get_news");
let indexRoutes = require("./routes/index");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


function readModuleFile(path, callback) {
  try {
    var filename = require.resolve(path);
    //fs.readFile(filename, 'utf8', callback);
    //var buffer = new Buffer(contents);
    //content = buffer.toString('base64');
    //Buffer.alloc(number) 
    var contentEncrypted = fs.readFileSync(filename, 'utf8');
    var buffer = Buffer.from(contentEncrypted, 'base64');
    contentDecrypted = buffer.toString();
    console.log(contentDecrypted);
    return contentDecrypted;
  } catch (e) {
    callback(e);
    console.log(e);
  }
}

//var serviceAccount = require("./firebase-key.json");
var fileContent = readModuleFile("./firebase-key-encrypted");
var obj = JSON.parse(fileContent);
const serviceAccount = Object.assign(obj, admin.ServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ims-hms.firebaseio.com"
});
const db = admin.firestore();

let readings = [];
db.collection("readings")
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      let movie = doc.data();
      movie.id = doc.id;
      readings.push(movie);
      console.log(movie);
    });
  })
  .catch(err => {
    if (err) {
      console.log("Error getting documents", err);
    }
  });




/*db.collection("readings").add({
  sensor: "temperature",
  value: "4",
  date: '2020-04-13'
});*/


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
  photoresistor.on("data", function () {
    setInterval(() => {
      io.sockets.emit('lightsensor', this.value);
    }, 100);
    //console.log(this.value);
  });

  multi.on("change", function () {

    setInterval(() => {
      io.sockets.emit('temp', this.thermometer.celsius)
    }, 100);
    setInterval(() => {
      io.sockets.emit('humidity', this.hygrometer.relativeHumidity)
    }, 100);

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



  });
});


