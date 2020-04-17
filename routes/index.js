let express = require('express');
let router = express.Router();
let axios = require('axios');
var admin = require("firebase-admin");

let firebaseUtil = require("../firebaseUtil");
let firebaseDbAdapter = require('../utils/firebaseDbAdapter');

//Models
let Notification = require("../models/Notification.js");
let Preferences = require("../models/Preferences");

router.post("/preferences", (req, res, next) => {
    let id = Preferences.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, record) {
        let query = {_id: record._id};
        //console.log(record.id);
        //console.log(req.body);

        Preferences.findByIdAndUpdate(query, {
            roomName: req.body.room_name,
            sendMotionNotification: req.body.motion_notif,
            sendTempNotification: req.body.temp_notif,
            sendWeatherNotification: req.body.weather_notif,
            lowTemp: req.body.low_temp,
            highTemp: req.body.high_temp
        }, (err, response) => {
            if(err) throw err;
            
            console.log("Save successful");
            res.send(JSON.stringify({status: "success"}));
        });
    });
});


router.get("/", (req, res, next) => {
    let newsArticles;

    axios.get('http://127.0.0.1:3000/news')
        .then((response) => {
            res.render("index", { articles: response.data.articles });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/settings", (req, res, next) => {
    Preferences.find({}, (err, result) => {
        if(err) {
            throw err;
        }

        console.log(result);
        res.render("settings", {preferences: result});
    });
});

router.get("/notifications", (req, res, next) => {
    //res.render("notifications");
    /*firebaseDbAdapter.getNotifications(function (result) {
        console.log({ notifications: result });
        res.render("notifications", { notifications: result });
    });*/
    Notification.find({}, (err, result) => {
        if(err) {
            throw err;
        }

        res.render("notifications", { notifications: result });
    });
});

router.get("/logs", (req, res, next) => {
    firebaseDbAdapter.getLogs(function (result) {
        console.log({ logs: result });
        res.render("logs", { logs: result });
    });
});

router.get("/account", (req, res, next) => {
    res.render("account");
});

router.get("/signout", (req, res, next) => {
    res.render("signout");
});

module.exports = router;