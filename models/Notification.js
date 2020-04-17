const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    message: String,
    timestamp: Date,
});

module.exports = mongoose.model("Notification", schema);