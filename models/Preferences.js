const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    roomName: String,
    sendMotionNotification: Boolean,
    sendTempNotification: Boolean,
    sendWeatherNotification: Boolean,
    lowTemp: Number,
    highTemp: Number
});

module.exports = mongoose.model("Preferences", schema);